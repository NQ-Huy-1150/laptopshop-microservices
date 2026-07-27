package com.laptopshop.inventoryservice.service;

import com.laptopshop.event.dto.AddStockEvent;
import com.laptopshop.event.dto.AddStockResponse;
import com.laptopshop.event.dto.OrderEvent;
import com.laptopshop.event.dto.StockIssueResponse;
import com.laptopshop.inventoryservice.dto.request.StockIssueRequest;
import com.laptopshop.inventoryservice.entity.ProcessedProduct;
import com.laptopshop.inventoryservice.repository.ProcessedProductRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class EventService {
    KafkaTemplate<String, Object> kafkaTemplate;
    InventoryService inventoryService;
    ProcessedProductRepository processedProductRepository;

    @KafkaListener(topics = "add-stock-request")
    @Transactional
    public void addStockEvent(AddStockEvent addStockEvent) {
        log.info("Received Add Stock Request");
        if (processedProductRepository.existsById(addStockEvent.getProductId())) {
            return;
        }
        try {
            inventoryService.createStock(addStockEvent);
            ProcessedProduct processedProduct = ProcessedProduct.builder()
                    .productId(addStockEvent.getProductId())
                    .handleAt(Instant.now())
                    .build();
            processedProductRepository.save(processedProduct);
            sendAddStockEventStatus(AddStockResponse.builder()
                    .productId(addStockEvent.getProductId())
                    .isSuccess(true)
                    .build());
            log.info("Add Stock Event Success");
        } catch (RuntimeException e) {
            sendAddStockEventStatus(AddStockResponse.builder()
                    .productId(addStockEvent.getProductId())
                    .isSuccess(false)
                    .build());
            log.error("Error adding stock event", e);
            throw e;
        }

    }

    @KafkaListener(topics = "order-created")
    @Transactional
    public void handleOrderEvent(OrderEvent orderEvent) {
        log.info("Received Order Event : {}", orderEvent);
        try {
            orderEvent.getOrderDetails().forEach(orderDetail -> {
                inventoryService.stockIssue(StockIssueRequest.builder()
                        .productId(orderDetail.getProductId())
                        .quantity(orderDetail.getQuantity())
                        .build());
            });
            sendStockIssueStatus(StockIssueResponse.builder()
                    .orderId(orderEvent.getId())
                    .isSuccess(true)
                    .build());
            log.info("Stock issue success");
        } catch (RuntimeException e) {
            sendStockIssueStatus(StockIssueResponse.builder()
                    .orderId(orderEvent.getId())
                    .isSuccess(false)
                    .build());
            log.error("Failed to issue stock", e);
            throw e;
        }
    }

    public void sendStockIssueStatus(StockIssueResponse response) {
        kafkaTemplate.send("stock-issue-status", response);
    }

    public void sendAddStockEventStatus(AddStockResponse response) {
        kafkaTemplate.send("add-stock-response", response);
    }
}
