package com.laptopshop.identityservice.configuration;

import com.laptopshop.identityservice.dto.request.IntrospectRequest;
import com.laptopshop.identityservice.exception.AppException;
import com.laptopshop.identityservice.exception.ErrorCode;
import com.laptopshop.identityservice.service.AuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

import javax.crypto.spec.SecretKeySpec;
import java.util.Objects;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class CustomJwtDecoder implements JwtDecoder {
    final AuthenticationService authenticationService;
    NimbusJwtDecoder nimbusJwtDecoder = null;
    @Value("${app.secret-key}")
    String secretKey;

    @Override
    public Jwt decode(String token) throws JwtException {
        var authenticate = this.authenticationService
                .introspect(IntrospectRequest
                        .builder()
                        .token(token)
                        .build());
        log.info("valid status : {}", authenticate.isValid());
        if (!authenticate.isValid()) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        if (Objects.isNull(nimbusJwtDecoder)) {
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(), "HS512");
            nimbusJwtDecoder = NimbusJwtDecoder.withSecretKey(secretKeySpec)
                    .macAlgorithm(MacAlgorithm.HS512).build();
        }
        return nimbusJwtDecoder.decode(token);
    }
}
