package com.laptopshop.transactionservice.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@Entity
@Table(name = "transactions")
public class TransactionMgmt {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String orderId;
    String userId;
    BigDecimal totalAmount;
    String status;
    String paymentMethod;
}
