package com.laptopshop.identityservice.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateResponse {
    String id;
    String firstName;
    String lastName;
    String username;
    String email;
    LocalDate dob;
    String address;
    String phoneNumber;
    Set<RoleResponse> roles;
}
