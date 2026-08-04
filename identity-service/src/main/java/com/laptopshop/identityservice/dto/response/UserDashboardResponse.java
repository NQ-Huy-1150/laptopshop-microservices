package com.laptopshop.identityservice.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserDashboardResponse {
    String id;
    String username;
    String email;
    String firstName;
    String lastName;
    Set<RoleResponse> roles;
}
