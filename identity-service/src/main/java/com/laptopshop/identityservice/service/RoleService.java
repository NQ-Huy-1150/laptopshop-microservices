package com.laptopshop.identityservice.service;

import com.laptopshop.identityservice.dto.request.RoleCreationRequest;
import com.laptopshop.identityservice.dto.request.RoleUpdateRequest;
import com.laptopshop.identityservice.dto.response.RoleResponse;
import com.laptopshop.identityservice.entity.Permission;
import com.laptopshop.identityservice.entity.Role;
import com.laptopshop.identityservice.exception.AppException;
import com.laptopshop.identityservice.exception.ErrorCode;
import com.laptopshop.identityservice.mapper.RoleMapper;
import com.laptopshop.identityservice.repository.PermissionRepository;
import com.laptopshop.identityservice.repository.RoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleService {
    RoleRepository roleRepository;
    PermissionRepository permissionRepository;
    RoleMapper mapper;

    @PreAuthorize("hasRole('ADMIN')")
    public RoleResponse create(RoleCreationRequest request) {
        Role role = this.mapper.toRole(request);
        List<Permission> permissions = this.permissionRepository.findAllById(request.getPermissions());
        role.setPermissions(new HashSet<>(permissions));
        return this.mapper.toResponse(this.roleRepository.save(role));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public RoleResponse update(RoleUpdateRequest request) {
        Role role = this.roleRepository.findById(request.getName())
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        role.setDescription(request.getDescription());
        List<Permission> permissions = this.permissionRepository.findAllById(request.getPermissions());
        role.setPermissions(new HashSet<>(permissions));
        return this.mapper.toResponse(this.roleRepository.save(role));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void delete(String id) {
        if (!this.roleRepository.existsById(id)) {
            throw new AppException(ErrorCode.ROLE_NOT_FOUND);
        }
        this.roleRepository.deleteById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<RoleResponse> getAllRole() {
        return this.roleRepository.findAll().stream().map(mapper::toResponse).toList();
    }
}
