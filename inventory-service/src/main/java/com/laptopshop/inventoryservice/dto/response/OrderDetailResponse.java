package com.laptopshop.inventoryservice.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderDetailResponse {
    String id;
    String productId;
    long quantity;
    BigDecimal price;
}
