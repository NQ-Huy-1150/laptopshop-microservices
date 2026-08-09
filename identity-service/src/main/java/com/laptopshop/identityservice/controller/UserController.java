package com.laptopshop.identityservice.controller;

import com.laptopshop.identityservice.dto.request.AddressUpdateRequest;
import com.laptopshop.identityservice.dto.request.UserCreationRequest;
import com.laptopshop.identityservice.dto.request.UserUpdateRequest;
import com.laptopshop.identityservice.dto.response.*;
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

    @PutMapping
    public ApiResponse<UserUpdateResponse> update(@RequestBody @Valid UserUpdateRequest request) {
        return ApiResponse.<UserUpdateResponse>builder()
                .result(this.userService.update(request))
                .build();
    }

    @PutMapping("/address")
    public ApiResponse<AddressUpdateResponse> updateAddress(@RequestBody @Valid AddressUpdateRequest request) {
        return ApiResponse.<AddressUpdateResponse>builder()
                .result(this.userService.updateAddress(request))
                .build();
    }

    @DeleteMapping("/{id}")
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

    @GetMapping("/{id}")
    public ApiResponse<UserInfo> getInfo(@PathVariable String id) {
        return ApiResponse.<UserInfo>builder()
                .result(this.userService.getUserInfo(id))
                .build();
    }
}
