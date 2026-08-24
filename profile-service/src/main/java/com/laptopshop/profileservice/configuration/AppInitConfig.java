package com.laptopshop.profileservice.configuration;

import com.laptopshop.profileservice.dto.request.CreateKeyCloakUserRequest;
import com.laptopshop.profileservice.dto.request.Credential;
import com.laptopshop.profileservice.dto.request.TokenExchangeParams;
import com.laptopshop.profileservice.entity.User;
import com.laptopshop.profileservice.exception.AppException;
import com.laptopshop.profileservice.exception.ErrorCode;
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
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;

@Component
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AppInitConfig {
    @NonFinal
    @Value("${app.client_id}")
    String clientId;
    @NonFinal
    @Value("${app.client_secret}")
    String clientSecret;

    @Bean
    @Transactional
    ApplicationRunner applicationRunner(KeyCloakClient client, UserRepository userRepository) {
        return args -> {
            if (!userRepository.existsByUsername("admin")) {
                ResponseEntity<?> response = null;
                try {
                    var clientToken = client.exchangeClientToken(TokenExchangeParams.builder()
                            .grant_type("client_credentials")
                            .client_id(clientId)
                            .client_secret(clientSecret)
                            .scope("openid")
                            .build());
                    response = client.create("BEARER " + clientToken.getAccess_token(),
                            CreateKeyCloakUserRequest.builder()
                                    .username("admin")
                                    .firstName("admin")
                                    .lastName("ad")
                                    .email("")
                                    .emailVerified(false)
                                    .enabled(true)
                                    .credentials(List.of(Credential.builder()
                                            .type("password")
                                            .value("admin")
                                            .temporary(false)
                                            .build()))
                                    .build());
                } catch (FeignException e) {
                    log.error("Error : {}", e.contentUTF8());
                    log.error(String.valueOf(e));
                    throw new AppException(ErrorCode.FAIL_TO_SEND_REQUEST_TO_KEYCLOAK);
                }
                User user = new User();
                user.setFirstName("admin");
                user.setLastName("ad");
                user.setUsername("admin");
                user.setKeyCloakId(extractKeyCloakUserId(response));
                userRepository.save(user);
                log.warn("admin users has been created with default password \"admin\", please change it");
            }
        };
    }

    private String extractKeyCloakUserId(ResponseEntity<?> response) {
        var location = Objects.requireNonNull(response.getHeaders().get("Location")).getFirst();
        String[] split = location.split("/");
        return split[split.length - 1];
    }
}
