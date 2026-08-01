package com.laptopshop.identityservice.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserInfo {
    String firstName;
    String lastName;
    String username;
    String email;
    LocalDate birthDate;
    String address;
    String phoneNumber;
}
