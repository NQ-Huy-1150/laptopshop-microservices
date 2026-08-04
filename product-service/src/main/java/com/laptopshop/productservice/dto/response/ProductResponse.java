package com.laptopshop.productservice.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductResponse {
    String id;
    String name;
    String specs;
    String description;
    BigDecimal price;
    long quantity;
    String brandId;
    String mainImage;
    String status;
    List<String> images;
    List<String> categoryIds;
}
