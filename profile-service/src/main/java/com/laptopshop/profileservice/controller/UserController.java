package com.laptopshop.profileservice.controller;

import com.laptopshop.profileservice.dto.request.UserCreationRequest;
import com.laptopshop.profileservice.dto.response.ApiResponse;
import com.laptopshop.profileservice.dto.response.UserCreationResponse;
import com.laptopshop.profileservice.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserController {
    UserService userService;

    @PostMapping("/registration")
    ApiResponse<UserCreationResponse> create(@RequestBody UserCreationRequest request) {
        return ApiResponse.<UserCreationResponse>builder()
                .result(userService.create(request))
                .build();
    }
}
