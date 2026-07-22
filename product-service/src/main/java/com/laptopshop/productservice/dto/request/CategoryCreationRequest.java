package com.laptopshop.productservice.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryCreationRequest {
    @NotEmpty(message = "CATEGORY_NAME_INVALID")
    String name;
    @NotEmpty(message = "CATEGORY_DESCRIPTION_INVALID")
    String description;
}
