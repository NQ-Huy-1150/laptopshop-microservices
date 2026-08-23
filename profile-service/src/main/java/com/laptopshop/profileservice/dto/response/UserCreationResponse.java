package com.laptopshop.profileservice.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationResponse {
    String id;
    String firstName;
    String lastName;
    String username;
    String accessToken;
    String refreshToken;
    String email;
    LocalDate dob;
    String address;
    String phoneNumber;
}
