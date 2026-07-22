package com.laptopshop.identityservice.controller;

import com.laptopshop.identityservice.dto.request.IntrospectRequest;
import com.laptopshop.identityservice.dto.request.RefreshRequest;
import com.laptopshop.identityservice.dto.request.UserLoginRequest;
import com.laptopshop.identityservice.dto.request.UserLogoutRequest;
import com.laptopshop.identityservice.dto.response.ApiResponse;
import com.laptopshop.identityservice.dto.response.AuthenticationResponse;
import com.laptopshop.identityservice.dto.response.IntrospectResponse;
import com.laptopshop.identityservice.dto.response.RefreshResponse;
import com.laptopshop.identityservice.service.AuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;

    @PostMapping("/login")
    public ApiResponse<AuthenticationResponse> login(@RequestBody UserLoginRequest request) {
        return ApiResponse.<AuthenticationResponse>builder()
                .result(this.authenticationService.login(request))
                .build();
    }

    @PostMapping("/introspect")
    public ApiResponse<IntrospectResponse> introspect(@RequestBody IntrospectRequest request) {
        return ApiResponse.<IntrospectResponse>builder()
                .result(this.authenticationService.introspect(request))
                .build();
    }

    @PostMapping("/logout")
    public ApiResponse<?> logout(@RequestBody UserLogoutRequest request) {
        this.authenticationService.logout(request);
        return ApiResponse.builder()
                .code(200)
                .message("Logout successfully !")
                .build();
    }

    @PostMapping("/refresh")
    public ApiResponse<RefreshResponse> refresh(@RequestBody RefreshRequest request) {
        return ApiResponse.<RefreshResponse>builder()
                .result(this.authenticationService.refeshToken(request))
                .build();
    }
}
