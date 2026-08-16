package com.laptopshop.notificationservice.repository;

import com.laptopshop.notificationservice.entity.ProcessedOrder;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProcessedOrderRepository extends MongoRepository<ProcessedOrder, String> {
}
