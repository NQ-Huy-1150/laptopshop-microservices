package com.laptopshop.identityservice.service;

import com.laptopshop.identityservice.dto.request.UserCreationRequest;
import com.laptopshop.identityservice.dto.request.UserDashboardUpdateRequest;
import com.laptopshop.identityservice.dto.request.UserUpdateRequest;
import com.laptopshop.identityservice.dto.response.*;
import com.laptopshop.identityservice.entity.Role;
import com.laptopshop.identityservice.entity.User;
import com.laptopshop.identityservice.enums.PredefinedRole;
import com.laptopshop.identityservice.exception.AppException;
import com.laptopshop.identityservice.exception.ErrorCode;
import com.laptopshop.identityservice.mapper.UserDashboardMapper;
import com.laptopshop.identityservice.mapper.UserMapper;
import com.laptopshop.identityservice.repository.RoleRepository;
import com.laptopshop.identityservice.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    AuthenticationService authenticationService;
    UserDashboardMapper userDashboardMapper;

    @PreAuthorize("hasRole('ADMIN')")
    public List<UserCreationResponse> getAllUsers() {
        return this.userRepository.findAll().stream().map(userMapper::toCreateResponse).toList();
    }

    @Transactional
    public UserCreationResponse create(UserCreationRequest request) {
        log.info("Creating user {}", request.getEmail());
        User user = userMapper.toCreateUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        Role role = this.roleRepository.findById(PredefinedRole.USER.name())
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
        Set<Role> roles = new HashSet<>();
        roles.add(role);
        user.setRoles(roles);
        user = this.userRepository.save(user);
        var response = userMapper.toCreateResponse(user);
        var token = authenticationService.generateToken(user);
        response.setToken(token);
        return response;
    }

    @Transactional
    public UserUpdateResponse update(UserUpdateRequest request) {
        User user = this.userRepository.findById(request.getId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setDob(request.getDob());
        user.setEmail(request.getEmail());
        return this.userMapper.toUpdateResponse(this.userRepository.save(user));
    }

    @Transactional
    public void delete(String id) {
        if (!this.userRepository.existsById(id)) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        this.userRepository.deleteById(id);
    }

    @PreAuthorize("#id == authentication.name")
    public UserInfo getUserInfo(String id) {
        log.info("get owner info successfully");
        User user = this.userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return UserInfo.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .username(user.getUsername())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public UserDashboardResponse handleDashboardUpdate(UserDashboardUpdateRequest request) {
        var user = userRepository.findById(request.getId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        var roles = roleRepository.findAllById(request.getRoles());
        user.setRoles(new HashSet<>(roles));
        user = userRepository.save(user);
        return userDashboardMapper.toResponse(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public PageResponse<UserDashboardResponse> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        var data = userRepository.findAll(pageable);
        return PageResponse.<UserDashboardResponse>builder()
                .currentPage(page)
                .totalPages(data.getTotalPages())
                .totalElements(data.getTotalElements())
                .pageSize(data.getSize())
                .data(data.getContent().stream().map(userDashboardMapper::toResponse).toList())
                .build();
    }
}
