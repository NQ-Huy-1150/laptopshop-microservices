package com.laptopshop.inventoryservice.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "update_inventory")
public class UpdateInventory {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String productId;
    long quantity;
    String updateType;
    LocalDateTime updatedAt;
    String description;
}
