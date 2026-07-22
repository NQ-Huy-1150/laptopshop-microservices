package com.laptopshop.identityservice.controller;

import com.laptopshop.identityservice.dto.request.PermissionCreationRequest;
import com.laptopshop.identityservice.dto.request.PermissionUpdateRequest;
import com.laptopshop.identityservice.dto.response.ApiResponse;
import com.laptopshop.identityservice.dto.response.PermissionResponse;
import com.laptopshop.identityservice.dto.response.RoleResponse;
import com.laptopshop.identityservice.service.PermissionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/permissions")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionController {
    PermissionService permissionService;

    @PostMapping
    ApiResponse<PermissionResponse> create(@RequestBody PermissionCreationRequest request) {
        return ApiResponse.<PermissionResponse>builder()
                .code(200)
                .result(this.permissionService.create(request))
                .build();
    }

    @PutMapping("/update")
    ApiResponse<PermissionResponse> update(@RequestBody PermissionUpdateRequest request) {
        return ApiResponse.<PermissionResponse>builder()
                .code(200)
                .result(this.permissionService.update(request))
                .build();
    }

    @DeleteMapping("/delete/{id}")
    ApiResponse<?> delete(@PathVariable String id) {
        this.permissionService.delete(id);
        return ApiResponse.<RoleResponse>builder()
                .code(200)
                .message("Delete successfully")
                .build();
    }

    @GetMapping
    ApiResponse<List<PermissionResponse>> fetchAllPermission() {
        return ApiResponse.<List<PermissionResponse>>builder()
                .code(200)
                .result(this.permissionService.getAllPermission())
                .build();
    }


}
