package com.laptopshop.identityservice.service;

import com.laptopshop.identityservice.dto.request.PermissionCreationRequest;
import com.laptopshop.identityservice.dto.request.PermissionUpdateRequest;
import com.laptopshop.identityservice.dto.response.PermissionResponse;
import com.laptopshop.identityservice.entity.Permission;
import com.laptopshop.identityservice.exception.AppException;
import com.laptopshop.identityservice.exception.ErrorCode;
import com.laptopshop.identityservice.mapper.PermissionMapper;
import com.laptopshop.identityservice.repository.PermissionRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionService {
    PermissionRepository permissionRepository;
    PermissionMapper mapper;

    @PreAuthorize("hasRole('ADMIN')")
    public List<PermissionResponse> getAllPermission() {
        return this.permissionRepository.findAll().stream().map(mapper::toResponse).toList();
    }

    @PreAuthorize("hasRole('ADMIN')")
    public PermissionResponse create(PermissionCreationRequest request) {
        Permission permission = this.mapper.toPermission(request);
        return this.mapper.toResponse(this.permissionRepository.save(permission));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public PermissionResponse update(PermissionUpdateRequest request) {
        var permission = this.permissionRepository.findById(request.getName())
                .orElseThrow((() -> new AppException(ErrorCode.PERMISSION_NOT_FOUND)));
        permission.setDescription(request.getDescription());
        return this.mapper.toResponse(this.permissionRepository.save(permission));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void delete(String id) {
        if (!this.permissionRepository.existsById(id)) {
            throw new AppException(ErrorCode.PERMISSION_NOT_FOUND);
        }
        this.permissionRepository.deleteById(id);
    }
}
