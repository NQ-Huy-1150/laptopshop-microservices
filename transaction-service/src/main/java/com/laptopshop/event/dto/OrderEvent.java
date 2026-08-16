package com.laptopshop.event.dto;

import com.laptopshop.transactionservice.dto.response.OrderDetailResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
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
    String recipientName;
    String shippingAddress;
    List<OrderDetailResponse> orderDetails;
}
