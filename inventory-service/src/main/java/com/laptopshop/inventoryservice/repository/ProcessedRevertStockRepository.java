package com.laptopshop.inventoryservice.repository;

import com.laptopshop.inventoryservice.entity.ProcessedRevertStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProcessedRevertStockRepository extends JpaRepository<ProcessedRevertStock, String> {
}
