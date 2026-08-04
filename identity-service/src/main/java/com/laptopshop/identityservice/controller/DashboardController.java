package com.laptopshop.identityservice.controller;

import com.laptopshop.identityservice.dto.request.UserDashboardUpdateRequest;
import com.laptopshop.identityservice.dto.response.ApiResponse;
import com.laptopshop.identityservice.dto.response.UserDashboardResponse;
import com.laptopshop.identityservice.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/dashboard/users")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DashboardController {
    UserService userService;

    @PutMapping
    ApiResponse<UserDashboardResponse> updateUser(@RequestBody UserDashboardUpdateRequest request) {
        return ApiResponse.<UserDashboardResponse>builder()
                .result(userService.handleDashboardUpdate(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<UserDashboardResponse>> getAllUserDashboard() {
        return ApiResponse.<List<UserDashboardResponse>>builder()
                .result(userService.getAllUserDashboard())
                .build();
    }

}
