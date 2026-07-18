package com.laptopshop.identityservice.service;

import com.laptopshop.identityservice.dto.request.UserCreationRequest;
import com.laptopshop.identityservice.dto.request.UserUpdateRequest;
import com.laptopshop.identityservice.dto.response.UserCreationResponse;
import com.laptopshop.identityservice.dto.response.UserUpdateResponse;
import com.laptopshop.identityservice.entity.User;
import com.laptopshop.identityservice.exception.AppException;
import com.laptopshop.identityservice.exception.ErrorCode;
import com.laptopshop.identityservice.mapper.UserMapper;
import com.laptopshop.identityservice.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;

    public UserCreationResponse create(UserCreationRequest request) {
        User user = userMapper.toCreateUser(request);

        return userMapper.toCreateResponse(this.userRepository.save(user));
    }

    public UserUpdateResponse update(UserUpdateRequest request) {
        User user = this.userRepository.findById(request.getId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setDob(request.getDob());
        user.setEmail(request.getEmail());
        return this.userMapper.toUpdateResponse(this.userRepository.save(user));
    }

    public void delete(String id) {
        if (!this.userRepository.existsById(id)) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        this.userRepository.deleteById(id);
    }
}
