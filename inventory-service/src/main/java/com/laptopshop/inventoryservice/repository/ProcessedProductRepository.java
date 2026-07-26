package com.laptopshop.inventoryservice.repository;

import com.laptopshop.inventoryservice.entity.ProcessedProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProcessedProductRepository extends JpaRepository<ProcessedProduct, String> {
}
