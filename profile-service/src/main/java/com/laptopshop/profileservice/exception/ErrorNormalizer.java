package com.laptopshop.profileservice.exception;

import com.laptopshop.profileservice.dto.response.KeycloakError;
import feign.FeignException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ErrorNormalizer {
    ObjectMapper objectMapper;
    HashMap<String, ErrorCode> errorMap = new HashMap<>(
            Map.of(
                    "User exists with same email", ErrorCode.EMAIL_ALREADY_EXISTED,
                    "User exists with same username", ErrorCode.USERNAME_ALREADY_EXISTED
            )
    );

    public AppException handleKeyCloakException(FeignException e) {
        try {
            log.info("deserializing....");
            var response = objectMapper.readValue(e.contentUTF8(), KeycloakError.class);
            if (Objects.nonNull(response.getErrorMessage()) && Objects.nonNull(errorMap.get(response.getErrorMessage()))) {
                return new AppException(errorMap.get(response.getErrorMessage()));
            } else {
                return new AppException(ErrorCode.INVALID_KEY);
            }
        } catch (JacksonException ex) {
            log.error("failed to parse keycloak response", ex);
            throw new RuntimeException(ex);
        }
    }
}
