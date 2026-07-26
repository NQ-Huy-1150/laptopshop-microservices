package com.laptopshop.orderservice.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartResponse {
    String id;
    String status;
    String userId;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    List<CartDetailResponse> cartDetails;
}
