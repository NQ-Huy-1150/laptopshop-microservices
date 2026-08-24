package com.laptopshop.profileservice.mapper;

import com.laptopshop.profileservice.dto.response.UserDashboardResponse;
import com.laptopshop.profileservice.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserDashboardMapper {
    UserDashboardResponse toResponse(User user);
}
