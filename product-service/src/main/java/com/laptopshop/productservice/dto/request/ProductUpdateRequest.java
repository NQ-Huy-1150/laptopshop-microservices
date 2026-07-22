package com.laptopshop.productservice.dto.request;

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
public class ProductUpdateRequest {
    @NotEmpty(message = "PRODUCT_ID_INVALID")
    String id;
    @NotEmpty(message = "PRODUCT_NAME_INVALID")
    String name;
    @NotEmpty(message = "PRODUCT_SPECS_INVALID")
    String specs;
    @NotEmpty(message = "PRODUCT_DESCRIPTION_INVALID")
    String description;
    @NotEmpty(message = "PRODUCT_PRICE_INVALID")
    BigDecimal price;
    @NotEmpty(message = "PRODUCT_BRAND_INVALID")
    String brand;
    List<String> categoryIds;
}
