package com.laptopshop.profileservice.controller;

import com.laptopshop.profileservice.dto.response.ApiResponse;
import com.laptopshop.profileservice.dto.response.PageResponse;
import com.laptopshop.profileservice.dto.response.UserDashboardResponse;
import com.laptopshop.profileservice.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserDashboardControl {
    UserService userService;

    @GetMapping
    ApiResponse<PageResponse<UserDashboardResponse>> getUsers(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size
    ) {
        return ApiResponse.<PageResponse<UserDashboardResponse>>builder()
                .result(userService.getAll(page, size))
                .build();
    }
}
