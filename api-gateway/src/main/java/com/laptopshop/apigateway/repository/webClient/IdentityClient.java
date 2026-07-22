package com.laptopshop.apigateway.repository.webClient;

import com.laptopshop.apigateway.dto.request.IntrospectRequest;
import com.laptopshop.apigateway.dto.response.ApiResponse;
import com.laptopshop.apigateway.dto.response.IntrospectResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Component
public class IdentityClient {
    WebClient webClient;

    public Mono<ApiResponse<IntrospectResponse>> introspect(IntrospectRequest request) {
        return webClient.post()
                .uri("/auth/introspect")
                .bodyValue(request)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<ApiResponse<IntrospectResponse>>() {
                })
                .timeout(Duration.ofSeconds(5));
    }
}
