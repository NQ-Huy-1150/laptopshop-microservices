package com.laptopshop.profileservice.service;

import com.laptopshop.profileservice.dto.request.*;
import com.laptopshop.profileservice.dto.response.*;
import com.laptopshop.profileservice.entity.User;
import com.laptopshop.profileservice.exception.AppException;
import com.laptopshop.profileservice.exception.ErrorCode;
import com.laptopshop.profileservice.exception.ErrorNormalizer;
import com.laptopshop.profileservice.mapper.UserDashboardMapper;
import com.laptopshop.profileservice.mapper.UserMapper;
import com.laptopshop.profileservice.repository.UserRepository;
import com.laptopshop.profileservice.repository.httpClient.KeyCloakClient;
import feign.FeignException;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserService {
    UserRepository userRepository;
    KeyCloakClient keyCloakClient;
    UserMapper mapper;
    UserDashboardMapper dashboardMapper;
    ErrorNormalizer errorNormalizer;
    @NonFinal
    @Value("${app.client_id}")
    String clientId;

    @NonFinal
    @Value("${app.client_secret}")
    String clientSecret;

    @Transactional
    public UserCreationResponse create(UserCreationRequest request) {
        // get client access token
        TokenExchangeResponse clientToken;
        String keycloakUserId;
        UserTokenExchangeResponse userTokenRequest;
        try {
            clientToken = keyCloakClient.exchangeClientToken(TokenExchangeParams.builder()
                    .grant_type("client_credentials")
                    .client_id(clientId)
                    .client_secret(clientSecret)
                    .scope("openid")
                    .build());
            // create user
            var rs = keyCloakClient.create("BEARER " + clientToken.getAccess_token(),
                    CreateKeyCloakUserRequest.builder()
                            .username(request.getUsername())
                            .email(request.getEmail())
                            .firstName(request.getFirstName())
                            .lastName(request.getLastName())
                            .enabled(true)
                            .emailVerified(false)
                            .requiredActions(List.of())
                            .credentials(List.of(Credential.builder()
                                    .type("password")
                                    .value(request.getPassword())
                                    .temporary(false)
                                    .build()))
                            .build());
            log.info("rs : {}", rs);
            // get user info
            keycloakUserId = extractKeyCloakUserId(rs);
            // get user access token
            userTokenRequest = keyCloakClient.exchangeUserToken(UserTokenExchangeRequest.builder()
                    .grant_type("password")
                    .client_id(clientId)
                    .client_secret(clientSecret)
                    .username(request.getUsername())
                    .password(request.getPassword())
                    .scope("openid")
                    .build());
        } catch (FeignException e) {
            log.error(e.contentUTF8());
            throw errorNormalizer.handleKeyCloakException(e);
        }
        // add user to db
        if (!StringUtils.hasText(keycloakUserId)) {
            throw new AppException(ErrorCode.FAIL_TO_EXTRACT_USER_ID_FROM_KEYCLOAK_RESPONSE);
        }
        var user = mapper.toUser(request);
        user.setKeyCloakId(keycloakUserId);
        user = userRepository.save(user);
        // create payload and return to fe
        var response = mapper.toResponse(user);
        response.setAccessToken(userTokenRequest.getAccess_token());
        response.setRefreshToken(userTokenRequest.getRefresh_token());
        return response;
    }

    private String extractKeyCloakUserId(ResponseEntity<?> response) {
        var location = Objects.requireNonNull(response.getHeaders().get("Location")).getFirst();
        String[] split = location.split("/");
        return split[split.length - 1];
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    public List<UserInfo> fetchUsers() {
        return userRepository.findAll().stream().map(mapper::toUserInfo).toList();
    }


    @Transactional
    public UserUpdateResponse update(UserUpdateRequest request) {
        User user = this.userRepository.findById(request.getId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        var data = keyCloakClient.updateUser();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setDob(request.getDob());
        user.setEmail(request.getEmail());
        user.setAddress(request.getAddress());
        return mapper.toUpdateResponse(this.userRepository.save(user));
    }

    @Transactional
    public AddressUpdateResponse updateAddress(AddressUpdateRequest request) {
        var userId = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = this.userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (!request.getAddress().equals(user.getAddress())) {
            user.setAddress(request.getAddress());
            user = userRepository.save(user);
        }
        return AddressUpdateResponse.builder()
                .address(user.getAddress())
                .build();
    }

    @Transactional
    public void delete(String id) {
        if (!this.userRepository.existsById(id)) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        this.userRepository.deleteById(id);
    }

    @PreAuthorize("#keyCloakId == authentication.name")
    public UserInfo getUserInfo(String keyCloakId) {
        log.info("get owner info successfully");
        User user = this.userRepository.findById(keyCloakId)
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

    @PreAuthorize("hasAuthority('ADMIN')")
    @Transactional
    public UserDashboardResponse handleDashboardUpdate(UserDashboardUpdateRequest request) {
        var user = userRepository.findById(request.getId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
//        var roles = roleRepository.findAllById(request.getRoles());
//        user.setRoles(new HashSet<>(roles));
//        user = userRepository.save(user);
//        return userDashboardMapper.toResponse(user);
        return null;
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    public PageResponse<UserDashboardResponse> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        var data = userRepository.findAll(pageable);
        return PageResponse.<UserDashboardResponse>builder()
                .currentPage(page)
                .totalPages(data.getTotalPages())
                .totalElements(data.getTotalElements())
                .pageSize(data.getSize())
                .data(data.getContent().stream().map(dashboardMapper::toResponse).toList())
                .build();
    }
}
