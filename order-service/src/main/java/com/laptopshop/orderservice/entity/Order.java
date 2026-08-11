package com.laptopshop.orderservice.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@Entity
@Table(name = "orders")
public class Order {
    @Id
    String id;
    String status;
    String stockIssueStatus;
    String transactionStatus;
    String transactionId;
    String userId;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    BigDecimal totalAmount;
    @OneToMany(mappedBy = "order", orphanRemoval = true)
    List<OrderDetail> orderDetails;
}
