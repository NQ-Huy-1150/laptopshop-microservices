package com.laptopshop.identityservice.mapper;

import com.laptopshop.identityservice.dto.request.PermissionCreationRequest;
import com.laptopshop.identityservice.dto.response.PermissionResponse;
import com.laptopshop.identityservice.entity.Permission;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission(PermissionCreationRequest request);

    PermissionResponse toResponse(Permission permission);
}
