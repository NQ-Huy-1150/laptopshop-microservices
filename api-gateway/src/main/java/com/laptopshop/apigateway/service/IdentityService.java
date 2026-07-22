package com.laptopshop.apigateway.service;

import com.laptopshop.apigateway.dto.request.IntrospectRequest;
import com.laptopshop.apigateway.dto.response.ApiResponse;
import com.laptopshop.apigateway.dto.response.IntrospectResponse;
import com.laptopshop.apigateway.repository.webClient.IdentityClient;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class IdentityService {
    IdentityClient identityClient;

    public Mono<ApiResponse<IntrospectResponse>> introspect(IntrospectRequest request) {
        return identityClient.introspect(request);
    }
}
