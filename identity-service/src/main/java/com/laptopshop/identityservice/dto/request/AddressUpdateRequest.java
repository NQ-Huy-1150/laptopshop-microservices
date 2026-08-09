package com.laptopshop.identityservice.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddressUpdateRequest {
    @NotEmpty(message = "ADDRESS_NOT_VALID")
    String address;
}
