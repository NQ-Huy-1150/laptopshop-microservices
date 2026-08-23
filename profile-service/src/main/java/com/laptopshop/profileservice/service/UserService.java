package com.laptopshop.profileservice.service;

import com.laptopshop.profileservice.dto.request.*;
import com.laptopshop.profileservice.dto.response.TokenExchangeResponse;
import com.laptopshop.profileservice.dto.response.UserCreationResponse;
import com.laptopshop.profileservice.dto.response.UserTokenExchangeResponse;
import com.laptopshop.profileservice.exception.AppException;
import com.laptopshop.profileservice.exception.ErrorCode;
import com.laptopshop.profileservice.mapper.UserMapper;
import com.laptopshop.profileservice.repository.UserRepository;
import com.laptopshop.profileservice.repository.httpClient.KeyCloakClient;
import feign.FeignException;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserService {
    UserRepository userRepository;
    KeyCloakClient keyCloakClient;
    UserMapper mapper;
    @NonFinal
    @Value("${app.client_id}")
    String clientId;

    @NonFinal
    @Value("${app.client_secret}")
    String clientSecret;

    @Transactional
    public UserCreationResponse create(UserCreationRequest request) {
        // get client access token
        TokenExchangeResponse clientToken = null;
        String keycloakUserId;
        UserTokenExchangeResponse userTokenRequest = null;
        try {
            clientToken = keyCloakClient.exchangeClientToken(TokenExchangeParams.builder()
                    .grant_type("client_credentials")
                    .client_id(clientId)
                    .client_secret(clientSecret)
                    .scope("openid")
                    .build());
            // create user
            var rs = keyCloakClient.create("BEARER " + clientToken.getAccess_token(),
                    CreateKeyCloakUserRequest.builder()
                            .username(request.getUsername())
                            .email(request.getEmail())
                            .firstName(request.getFirstName())
                            .lastName(request.getLastName())
                            .enabled(true)
                            .emailVerified(false)
                            .requiredActions(List.of())
                            .credentials(List.of(Credential.builder()
                                    .type("password")
                                    .value(request.getPassword())
                                    .temporary(false)
                                    .build()))
                            .build());
            log.info("rs : {}", rs);
            // get user info
            keycloakUserId = extractKeyCloakUserId(rs);
            // get user access token
            userTokenRequest = keyCloakClient.exchangeUserToken(UserTokenExchangeRequest.builder()
                    .grant_type("password")
                    .client_id(clientId)
                    .client_secret(clientSecret)
                    .username(request.getUsername())
                    .password(request.getPassword())
                    .scope("openid")
                    .build());
        } catch (FeignException e) {
            log.error(e.contentUTF8());
            throw new AppException(ErrorCode.FAIL_TO_SEND_REQUEST_TO_KEYCLOAK);
        }
        // add user to db
        if (!StringUtils.hasText(keycloakUserId)) {
            throw new AppException(ErrorCode.FAIL_TO_EXTRACT_USER_ID_FROM_KEYCLOAK_RESPONSE);
        }
        var user = mapper.toUser(request);
        user.setKeyCloakId(keycloakUserId);
        user = userRepository.save(user);
        // create payload and return to fe
        var response = mapper.toResponse(user);
        response.setAccessToken(userTokenRequest.getAccess_token());
        response.setRefreshToken(userTokenRequest.getRefresh_token());
        return response;
    }

    private String extractKeyCloakUserId(ResponseEntity<?> response) {
        var location = Objects.requireNonNull(response.getHeaders().get("Location")).getFirst();
        String[] split = location.split("/");
        return split[split.length - 1];
    }
}
