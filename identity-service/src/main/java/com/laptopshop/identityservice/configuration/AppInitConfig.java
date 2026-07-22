package com.laptopshop.identityservice.configuration;

import com.laptopshop.identityservice.entity.Role;
import com.laptopshop.identityservice.entity.User;
import com.laptopshop.identityservice.enums.PredefinedRole;
import com.laptopshop.identityservice.exception.AppException;
import com.laptopshop.identityservice.exception.ErrorCode;
import com.laptopshop.identityservice.repository.RoleRepository;
import com.laptopshop.identityservice.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AppInitConfig {
    PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository) {
        return args -> {
            if (!userRepository.existsByUsername("admin")) {
                Role role = roleRepository.findById(PredefinedRole.ADMIN.name())
                        .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
                User user = User.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin"))
                        .roles(new HashSet<>(List.of(role)))
                        .build();
                userRepository.save(user);
                log.warn("admin users has been created with default password \"admin\", please change it");
            }
        };
    }
}
