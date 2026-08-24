package com.laptopshop.profileservice.service;

import com.laptopshop.profileservice.dto.request.IntrospectRequest;
import com.laptopshop.profileservice.dto.request.UserLoginRequest;
import com.laptopshop.profileservice.dto.request.UserTokenExchangeRequest;
import com.laptopshop.profileservice.dto.response.AuthenticationResponse;
import com.laptopshop.profileservice.dto.response.IntrospectResponse;
import com.laptopshop.profileservice.dto.response.UserTokenExchangeResponse;
import com.laptopshop.profileservice.exception.AppException;
import com.laptopshop.profileservice.exception.ErrorCode;
import com.laptopshop.profileservice.repository.httpClient.KeyCloakClient;
import feign.FeignException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthenticationService {
    KeyCloakClient keyCloakClient;
    @NonFinal
    @Value("${app.client_id}")
    String clientId;

    @NonFinal
    @Value("${app.client_secret}")
    String clientSecret;

    public AuthenticationResponse login(UserLoginRequest request) {
        UserTokenExchangeResponse userTokenExchangeResponse = null;
        try {
            userTokenExchangeResponse = keyCloakClient.exchangeUserToken(UserTokenExchangeRequest.builder()
                    .grant_type("password")
                    .client_id(clientId)
                    .client_secret(clientSecret)
                    .username(request.getUsername())
                    .password(request.getPassword())
                    .scope("openid")
                    .build());
        } catch (FeignException e) {
            log.error("Error : {}", e.contentUTF8());
            log.error(String.valueOf(e));
            throw new AppException(ErrorCode.FAIL_TO_RETRIEVE_USER_TOKEN);
        }
        return AuthenticationResponse.builder()
                .accessToken(userTokenExchangeResponse.getAccess_token())
                .refreshToken(userTokenExchangeResponse.getRefresh_token())
                .build();
    }

    public IntrospectResponse introspect(IntrospectRequest request) {
        return null;
    }
}
