package com.laptopshop.identityservice.mapper;

import com.laptopshop.identityservice.dto.response.UserDashboardResponse;
import com.laptopshop.identityservice.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserDashboardMapper {
    UserDashboardResponse toResponse(User user);
}
