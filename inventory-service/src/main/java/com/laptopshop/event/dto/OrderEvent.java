package com.laptopshop.event.dto;

import com.laptopshop.inventoryservice.dto.response.OrderDetailResponse;
import jakarta.persistence.OneToMany;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderEvent {
    String id;
    String status;
    String userId;
    BigDecimal totalAmount;
    String paymentMethod;
    List<OrderDetailResponse> orderDetails;
}
