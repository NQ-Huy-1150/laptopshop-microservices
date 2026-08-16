package com.laptopshop.notificationservice.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderInfo {
    String orderId;
    String totalAmount;
    String paymentMethod;
    String recipientName;
    String shippingAddress;
}
