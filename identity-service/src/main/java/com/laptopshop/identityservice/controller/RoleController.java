package com.laptopshop.identityservice.controller;

import com.laptopshop.identityservice.dto.request.RoleCreationRequest;
import com.laptopshop.identityservice.dto.request.RoleUpdateRequest;
import com.laptopshop.identityservice.dto.response.ApiResponse;
import com.laptopshop.identityservice.dto.response.RoleResponse;
import com.laptopshop.identityservice.service.RoleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleController {
    RoleService roleService;

    @GetMapping
    ApiResponse<List<RoleResponse>> fetchAllRole() {
        return ApiResponse.<List<RoleResponse>>builder()
                .code(200)
                .result(this.roleService.getAllRole())
                .build();
    }

    @PostMapping
    ApiResponse<RoleResponse> create(@RequestBody RoleCreationRequest request) {
        return ApiResponse.<RoleResponse>builder()
                .code(200)
                .result(this.roleService.create(request))
                .build();
    }

    @PutMapping("/update")
    ApiResponse<RoleResponse> update(@RequestBody RoleUpdateRequest request) {
        return ApiResponse.<RoleResponse>builder()
                .code(200)
                .result(this.roleService.update(request))
                .build();
    }

    @DeleteMapping("/delete/{id}")
    ApiResponse<?> delete(@PathVariable String id) {
        this.roleService.delete(id);
        return ApiResponse.<RoleResponse>builder()
                .code(200)
                .message("Delete successfully")
                .build();
    }
}
