package com.laptopshop.profileservice.controller;

import com.laptopshop.profileservice.dto.request.UserCreationRequest;
import com.laptopshop.profileservice.dto.response.ApiResponse;
import com.laptopshop.profileservice.dto.response.UserCreationResponse;
import com.laptopshop.profileservice.dto.response.UserInfo;
import com.laptopshop.profileservice.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserController {
    UserService userService;

    @PostMapping("/registration")
    ApiResponse<UserCreationResponse> create(@RequestBody @Valid UserCreationRequest request) {
        return ApiResponse.<UserCreationResponse>builder()
                .result(userService.create(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<UserInfo>> fetchUsers() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        
        return ApiResponse.<List<UserInfo>>builder()
                .result(userService.fetchUsers())
                .build();
    }
}
