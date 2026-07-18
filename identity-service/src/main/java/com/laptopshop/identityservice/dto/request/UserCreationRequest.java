package com.laptopshop.identityservice.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {
    @NotEmpty
    String firstName;
    @NotEmpty
    String lastName;
    @NotEmpty
    String email;
    @NotEmpty
    String username;
    @Size(min = 8, message = "at least 8 characters")
    String password;
    LocalDate dob;
}
