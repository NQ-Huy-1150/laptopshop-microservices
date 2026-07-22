package com.laptopshop.identityservice.dto.request;

import com.laptopshop.identityservice.validator.DobConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    @NotEmpty(message = "USER_ID_NOT_VALID")
    String id;
    @NotEmpty(message = "FIRST_NAME_NOT_VALID")
    String firstName;
    @NotEmpty(message = "LAST_NAME_NOT_VALID")
    String lastName;
    @Email(message = "EMAIL_NOT_VALID")
    String email;
    @DobConstraint(min = 13, message = "INVALID_DOB")
    LocalDate dob;
    @NotEmpty(message = "ADDRESS_NOT_VALID")
    String address;
    @Size(min = 10, max = 10, message = "PHONE_NUMBER_NOT_VALID")
    String phoneNumber;

    Set<String> roles;
}
