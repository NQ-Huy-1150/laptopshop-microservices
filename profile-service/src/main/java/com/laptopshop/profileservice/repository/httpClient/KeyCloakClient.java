package com.laptopshop.profileservice.repository.httpClient;

import com.laptopshop.profileservice.dto.request.CreateKeyCloakUserRequest;
import com.laptopshop.profileservice.dto.request.TokenExchangeParams;
import com.laptopshop.profileservice.dto.request.UserTokenExchangeRequest;
import com.laptopshop.profileservice.dto.response.TokenExchangeResponse;
import com.laptopshop.profileservice.dto.response.UserTokenExchangeResponse;
import feign.QueryMap;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "laptopshop-identity", url = "${app.keycloak-url}")
public interface KeyCloakClient {
    @PostMapping(value = "/admin/realms/laptopshop/users", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<?> create(
            @RequestHeader("Authorization") String token,
            @RequestBody CreateKeyCloakUserRequest request);

    @PostMapping(value = "/realms/laptopshop/protocol/openid-connect/token",
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    TokenExchangeResponse exchangeClientToken(@QueryMap TokenExchangeParams params);

    @PostMapping(value = "/realms/laptopshop/protocol/openid-connect/token",
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    UserTokenExchangeResponse exchangeUserToken(@QueryMap UserTokenExchangeRequest request);

    @PutMapping(value = "/admin/realms/laptopshop/users/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    Object updateUser(
            @PathVariable String id,
            @RequestHeader("Authorization") String token,
            @RequestBody CreateKeyCloakUserRequest request
    );
}
