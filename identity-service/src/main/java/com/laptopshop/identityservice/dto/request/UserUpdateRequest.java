package com.laptopshop.identityservice.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    @NotEmpty
    @NotNull
    String id;
    @NotEmpty
    String firstName;
    @NotEmpty
    String lastName;
    @NotEmpty
    String email;
    LocalDate dob;
}
