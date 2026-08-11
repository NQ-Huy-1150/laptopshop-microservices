package com.laptopshop.transactionservice.repository;

import com.laptopshop.transactionservice.entity.ProcessedOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProcessedOrderRepository extends JpaRepository<ProcessedOrder, String> {
}
