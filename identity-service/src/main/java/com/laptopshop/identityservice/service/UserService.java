package com.laptopshop.identityservice.service;

import com.laptopshop.identityservice.dto.request.UserCreationRequest;
import com.laptopshop.identityservice.dto.request.UserUpdateRequest;
import com.laptopshop.identityservice.dto.response.UserCreationResponse;
import com.laptopshop.identityservice.dto.response.UserUpdateResponse;
import com.laptopshop.identityservice.entity.Role;
import com.laptopshop.identityservice.entity.User;
import com.laptopshop.identityservice.enums.PredefinedRole;
import com.laptopshop.identityservice.exception.AppException;
import com.laptopshop.identityservice.exception.ErrorCode;
import com.laptopshop.identityservice.mapper.UserMapper;
import com.laptopshop.identityservice.repository.RoleRepository;
import com.laptopshop.identityservice.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserRepository userRepository;
    RoleRepository roleRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;

    @PreAuthorize("hasRole('ADMIN')")
    public List<UserCreationResponse> getAllUsers() {
        return this.userRepository.findAll().stream().map(userMapper::toCreateResponse).toList();
    }

    public UserCreationResponse create(UserCreationRequest request) {
        User user = userMapper.toCreateUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        Role role = this.roleRepository.findById(PredefinedRole.USER.name())
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        Set<Role> roles = new HashSet<>();
        roles.add(role);
        user.setRoles(roles);
        return userMapper.toCreateResponse(this.userRepository.save(user));
    }

    public UserUpdateResponse update(UserUpdateRequest request) {
        User user = this.userRepository.findById(request.getId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setDob(request.getDob());
        user.setEmail(request.getEmail());
        List<Role> roles = roleRepository.findAllById(request.getRoles());
        user.setRoles(new HashSet<>(roles));
        return this.userMapper.toUpdateResponse(this.userRepository.save(user));
    }

    public void delete(String id) {
        if (!this.userRepository.existsById(id)) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        this.userRepository.deleteById(id);
    }
}
