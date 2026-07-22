package com.laptopshop.identityservice.mapper;

import com.laptopshop.identityservice.dto.request.RoleCreationRequest;
import com.laptopshop.identityservice.dto.response.RoleResponse;
import com.laptopshop.identityservice.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    @Mapping(target = "permissions",ignore = true)
    Role toRole(RoleCreationRequest request);

    RoleResponse toResponse (Role role);
}
