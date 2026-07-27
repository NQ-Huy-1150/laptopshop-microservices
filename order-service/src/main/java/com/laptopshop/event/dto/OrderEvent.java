package com.laptopshop.event.dto;

import com.laptopshop.orderservice.dto.response.OrderDetailResponse;
import jakarta.persistence.OneToMany;
import lombok.*;
import lombok.experimental.FieldDefaults;

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
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    @OneToMany(mappedBy = "order", orphanRemoval = true)
    List<OrderDetailResponse> orderDetails;
}
