package com.laptopshop.apigateway.configuration;

import com.laptopshop.apigateway.dto.request.IntrospectRequest;
import com.laptopshop.apigateway.dto.response.ApiResponse;
import com.laptopshop.apigateway.service.IdentityService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.util.CollectionUtils;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

import java.util.Arrays;
import java.util.List;

@Slf4j
@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationFilter implements GlobalFilter, Ordered {
    IdentityService identityService;
    ObjectMapper objectMapper;
    @NonFinal
    final
    String[] PUBLIC_ENDPOINTS = {
            "/identity/users/registration",
            "/identity/auth/.*",
            "/file/media/download/.*",
    };
    @NonFinal
    @Value("${app.prefix}")
    String apiPrefix;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        log.info("Enter authentication filter");
        if (isPublicEndpoint(exchange.getRequest())) {
            return chain.filter(exchange);
        }
        List<String> authHeaders = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION);
        if (CollectionUtils.isEmpty(authHeaders)) {
            return unauthenticated(exchange.getResponse());
        }
        String token = authHeaders.getFirst().replace("Bearer ", "");
        var introspectResponse = this.identityService.introspect(
                IntrospectRequest.builder()
                        .token(token)
                        .build()
        );
        log.info("token: {}", token);
        return introspectResponse.flatMap(response -> {
            log.info("result : {}", response.getResult().isValid());
            if (!response.getResult().isValid()) {
                return unauthenticated(exchange.getResponse());
            }
            log.info("forwarded request -> identity service");
            return chain.filter(exchange);
        }).onErrorResume(e -> {
            log.error("AuthenticationFilter error", e);
            return unauthenticated(exchange.getResponse());
        });
    }

    @Override
    public int getOrder() {
        return -1;
    }

    private boolean isPublicEndpoint(ServerHttpRequest request) {
        return Arrays.stream(PUBLIC_ENDPOINTS).anyMatch(s -> request.getURI().getPath().matches(apiPrefix + s));
    }

    private Mono<Void> unauthenticated(ServerHttpResponse response) {
        ApiResponse<?> apiResponse = ApiResponse.builder()
                .code(401)
                .message("UNAUTHENTICATED")
                .build();
        String body = null;
        try {
            body = objectMapper.writeValueAsString(apiResponse);
        } catch (JacksonException e) {
            throw new RuntimeException(e);
        }
        response.getHeaders().add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        return response.writeWith(Mono.just(response.bufferFactory().wrap(body.getBytes())));
    }
}