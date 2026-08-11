package com.laptopshop.inventoryservice.repository;

import com.laptopshop.inventoryservice.entity.ProcessedStockIssue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProcessedStockIssueRepository extends JpaRepository<ProcessedStockIssue, String> {
}
