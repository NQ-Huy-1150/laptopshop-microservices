package com.laptopshop.productservice.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductCreationRequest {
    @NotEmpty(message = "PRODUCT_NAME_INVALID")
    String name;
    @NotEmpty(message = "PRODUCT_SPECS_INVALID")
    String specs;
    @NotEmpty(message = "PRODUCT_DESCRIPTION_INVALID")
    String description;
    @DecimalMin(value = "0.0", message = "PRODUCT_PRICE_INVALID")
    BigDecimal price;
    @NotEmpty(message = "PRODUCT_BRAND_INVALID")
    String brand;
    List<String> categoryIds;
}
