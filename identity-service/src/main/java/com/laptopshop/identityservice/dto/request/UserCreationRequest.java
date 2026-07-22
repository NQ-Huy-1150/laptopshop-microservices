package com.laptopshop.identityservice.dto.request;

import com.laptopshop.identityservice.validator.DobConstraint;
import jakarta.validation.constraints.Email;
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
    @NotEmpty(message = "FIRST_NAME_NOT_VALID")
    String firstName;
    @NotEmpty
    @NotEmpty(message = "LAST_NAME_NOT_VALID")
    String lastName;
    @Email(message = "EMAIL_NOT_VALID")
    String email;
    @Size(min = 6, message = "USERNAME_NOT_VALID")
    String username;
    @Size(min = 8, message = "PASSWORD_NOT_VALID")
    String password;
    @DobConstraint(min = 12, message = "INVALID_DOB")
    LocalDate dob;
    @NotEmpty(message = "ADDRESS_NOT_VALID")
    String address;
    @Size(min = 10, max = 10, message = "PHONE_NUMBER_NOT_VALID")
    String phoneNumber;
}
