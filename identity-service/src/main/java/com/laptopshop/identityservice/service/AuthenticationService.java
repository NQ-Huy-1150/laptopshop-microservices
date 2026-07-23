package com.laptopshop.identityservice.service;

import com.laptopshop.identityservice.dto.request.IntrospectRequest;
import com.laptopshop.identityservice.dto.request.RefreshRequest;
import com.laptopshop.identityservice.dto.request.UserLoginRequest;
import com.laptopshop.identityservice.dto.request.UserLogoutRequest;
import com.laptopshop.identityservice.dto.response.AuthenticationResponse;
import com.laptopshop.identityservice.dto.response.IntrospectResponse;
import com.laptopshop.identityservice.dto.response.RefreshResponse;
import com.laptopshop.identityservice.entity.InvalidatedToken;
import com.laptopshop.identityservice.entity.User;
import com.laptopshop.identityservice.exception.AppException;
import com.laptopshop.identityservice.exception.ErrorCode;
import com.laptopshop.identityservice.repository.InvalidatedTokenRepository;
import com.laptopshop.identityservice.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthenticationService {
    UserRepository userRepository;
    InvalidatedTokenRepository invalidatedTokenRepository;
    @NonFinal
    @Value("${app.secret-key}")
    String secretKey;

    @NonFinal
    @Value("${app.expiration-time}")
    long expiryTime;

    @NonFinal
    @Value("${app.refreshable-time}")
    long refreshableTime;

    public IntrospectResponse introspect(IntrospectRequest request) {
        SignedJWT signedJWT = null;
        try {
            signedJWT = verifyToken(request.getToken(), false);
            return IntrospectResponse.builder()
                    .valid(true)
                    .userId(signedJWT.getJWTClaimsSet().getSubject())
                    .build();
        } catch (AppException | ParseException ex) {
            log.info("authentication failed : {}, {}", request.getToken(), ex.getMessage());
            return IntrospectResponse.builder()
                    .valid(false)
                    .userId(null)
                    .build();
        }
    }

    public AuthenticationResponse login(UserLoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.INFO_NOT_MATCH);
        }
        var token = generateToken(user);
        return AuthenticationResponse.builder()
                .token(token)
                .build();
    }

    public void logout(UserLogoutRequest request) {
        try {
            var signedJWT = verifyToken(request.getToken(), true);
            InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                    .jti(signedJWT.getJWTClaimsSet().getJWTID())
                    .expirationTime(signedJWT.getJWTClaimsSet().getExpirationTime())
                    .build();
            this.invalidatedTokenRepository.save(invalidatedToken);
        } catch (AppException | ParseException e) {
            log.info("if invalid token ~ already logout");
        }

    }

    public RefreshResponse refeshToken(RefreshRequest request) {
        try {
            var signedJWT = verifyToken(request.getToken(), true);
            InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                    .jti(signedJWT.getJWTClaimsSet().getJWTID())
                    .expirationTime(signedJWT.getJWTClaimsSet().getExpirationTime())
                    .build();
            this.invalidatedTokenRepository.save(invalidatedToken);

            var userId = signedJWT.getJWTClaimsSet().getSubject();
            var user = this.userRepository.findById(userId)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
            return RefreshResponse.builder()
                    .token(generateToken(user))
                    .build();
        } catch (ParseException | AppException e) {
            return RefreshResponse.builder()
                    .status("FAILED")
                    .build();
        }
    }

    private String generateToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getId())
                .issuer("laptopshop.com")
                .jwtID(UUID.randomUUID().toString())
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plus(expiryTime, ChronoUnit.SECONDS).toEpochMilli()))
                .claim("scope", buildScope(user))
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject object = new JWSObject(header, payload);
        try {
            object.sign(new MACSigner(secretKey.getBytes()));
            return object.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
    }

    private SignedJWT verifyToken(String token, boolean isRefreshable) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            var jti = signedJWT.getJWTClaimsSet().getJWTID();
            MACVerifier verifier = new MACVerifier(secretKey.getBytes());
            var verified = signedJWT.verify(verifier);
            var expirationTime = isRefreshable
                    ? new Date(signedJWT.getJWTClaimsSet().getIssueTime()
                    .toInstant().plus(refreshableTime, ChronoUnit.SECONDS).toEpochMilli())
                    : signedJWT.getJWTClaimsSet().getExpirationTime();
            if (!(verified && expirationTime.after(new Date()))) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }
            if (invalidatedTokenRepository.existsById(jti)) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }
            return signedJWT;
        } catch (ParseException | JOSEException e) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    private String buildScope(User user) {
        StringJoiner joiner = new StringJoiner(" ");
        if (!CollectionUtils.isEmpty(user.getRoles())) {
            user.getRoles().forEach(role -> {
                joiner.add("ROLE_" + role.getName());
                if (!CollectionUtils.isEmpty(role.getPermissions())) {
                    role.getPermissions().forEach(permission -> {
                                joiner.add(permission.getName());
                            }
                    );
                }
            });
        }
        return joiner.toString();
    }
}
