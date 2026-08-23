package com.laptopshop.profileservice.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateKeyCloakUserRequest {
    String username;
    String firstName;
    String lastName;
    String email;
    boolean enabled;
    boolean emailVerified;
    List<Credential> credentials;
    List<String> requiredActions;
}
