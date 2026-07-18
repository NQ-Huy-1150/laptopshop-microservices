package com.laptopshop.identityservice.mapper;

import com.laptopshop.identityservice.dto.request.UserCreationRequest;
import com.laptopshop.identityservice.dto.response.UserCreationResponse;
import com.laptopshop.identityservice.dto.response.UserUpdateResponse;
import com.laptopshop.identityservice.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toCreateUser(UserCreationRequest request);

    UserCreationResponse toCreateResponse(User user);

    UserUpdateResponse toUpdateResponse(User user);
}
