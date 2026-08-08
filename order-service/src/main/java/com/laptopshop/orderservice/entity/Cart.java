package com.laptopshop.orderservice.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@Entity
@Table(name = "carts")
public class Cart {
    @Id
    String id;
    String status;
    String userId;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    @OneToMany(mappedBy = "cart", orphanRemoval = true, cascade = CascadeType.ALL)
    List<CartDetail> cartDetails;

}
