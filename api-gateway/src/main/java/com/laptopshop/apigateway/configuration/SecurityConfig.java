package com.laptopshop.apigateway.configuration;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebFluxSecurity
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SecurityConfig {
    JwtServerAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    String[] PUBLIC_ENDPOINTS = {
            "/profile/users/registration",
            "/identity/auth/**",
            "/file/media/download/**",
            "/product/products",
            "/product/products/**",
            "/inventory/management",
            "/inventory/management/**",
    };
    @NonFinal
    @Value("${app.prefix}")
    String apiPrefix;

    @Bean
    public SecurityWebFilterChain filterChain(ServerHttpSecurity http) throws Exception {
        http.authorizeExchange(exchange ->
                exchange.pathMatchers(Arrays.stream(PUBLIC_ENDPOINTS)
                                .map(s -> apiPrefix + s).toArray(String[]::new))
                        .permitAll()
                        .anyExchange().authenticated());
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()));
        http.oauth2ResourceServer(oAuth2 ->
                oAuth2.jwt(Customizer.withDefaults()).authenticationEntryPoint(jwtAuthenticationEntryPoint));
        http.exceptionHandling(exception -> exception.authenticationEntryPoint(jwtAuthenticationEntryPoint));
        http.csrf(ServerHttpSecurity.CsrfSpec::disable);
        http.formLogin(ServerHttpSecurity.FormLoginSpec::disable);
        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("*"));
        configuration.setAllowedMethods(List.of("*"));
        configuration.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
