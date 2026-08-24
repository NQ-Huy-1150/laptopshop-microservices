package com.laptopshop.profileservice.mapper;

import com.laptopshop.profileservice.dto.request.UserCreationRequest;
import com.laptopshop.profileservice.dto.response.UserCreationResponse;
import com.laptopshop.profileservice.dto.response.UserUpdateResponse;
import com.laptopshop.profileservice.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreationRequest request);

    UserCreationResponse toResponse(User user);

    UserUpdateResponse toUpdateResponse(User user);
}
