package com.laptopshop.identityservice.controller;

import com.laptopshop.identityservice.dto.request.UserCreationRequest;
import com.laptopshop.identityservice.dto.request.UserUpdateRequest;
import com.laptopshop.identityservice.dto.response.ApiResponse;
import com.laptopshop.identityservice.dto.response.UserCreationResponse;
import com.laptopshop.identityservice.dto.response.UserUpdateResponse;
import com.laptopshop.identityservice.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
    UserService userService;

    @PostMapping("/registration")
    public ApiResponse<UserCreationResponse> create(@RequestBody @Valid UserCreationRequest request) {
        return ApiResponse.<UserCreationResponse>builder()
                .result(this.userService.create(request))
                .build();
    }

    @PutMapping("/update")
    public ApiResponse<UserUpdateResponse> update(@RequestBody @Valid UserUpdateRequest request) {
        return ApiResponse.<UserUpdateResponse>builder()
                .result(this.userService.update(request))
                .build();
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<?> delete(@PathVariable String id) {
        this.userService.delete(id);
        return ApiResponse.builder()
                .message("Delete Successfully")
                .build();
    }

    @GetMapping
    public ApiResponse<List<UserCreationResponse>> fetchAllUsers() {
        return ApiResponse.<List<UserCreationResponse>>builder()
                .result(this.userService.getAllUsers())
                .build();
    }
}
