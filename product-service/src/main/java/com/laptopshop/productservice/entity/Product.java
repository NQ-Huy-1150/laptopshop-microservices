package com.laptopshop.productservice.entity;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Document(collection = "products")
public class Product {
    @Id
    String id;
    String name;
    String specs;
    String description;
    BigDecimal price;
    String brand;
    List<String> imgUrls;
    Set<String> categoryIds;
}
