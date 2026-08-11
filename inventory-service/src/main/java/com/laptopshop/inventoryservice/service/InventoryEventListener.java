package com.laptopshop.inventoryservice.service;

import com.laptopshop.event.dto.*;
import com.laptopshop.inventoryservice.dto.request.RevertStockRequest;
import com.laptopshop.inventoryservice.dto.request.StockIssueRequest;
import com.laptopshop.inventoryservice.entity.ProcessedProduct;
import com.laptopshop.inventoryservice.entity.ProcessedRevertStock;
import com.laptopshop.inventoryservice.entity.ProcessedStockIssue;
import com.laptopshop.inventoryservice.enums.Status;
import com.laptopshop.inventoryservice.exception.AppException;
import com.laptopshop.inventoryservice.exception.ErrorCode;
import com.laptopshop.inventoryservice.repository.InventoryRepository;
import com.laptopshop.inventoryservice.repository.ProcessedProductRepository;
import com.laptopshop.inventoryservice.repository.ProcessedRevertStockRepository;
import com.laptopshop.inventoryservice.repository.ProcessedStockIssueRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class InventoryEventListener {
    KafkaTemplate<String, Object> kafkaTemplate;
    InventoryService inventoryService;
    InventoryRepository inventoryRepository;
    InventoryEventProducer producer;
    ProcessedProductRepository processedProductRepository;
    ProcessedStockIssueRepository processedStockIssueRepository;
    ProcessedRevertStockRepository processedRevertStockRepository;

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
                    .handleAt(LocalDateTime.now())
                    .build();
            processedProductRepository.save(processedProduct);
            producer.sendAddStockEventStatus(AddStockResponse.builder()
                    .productId(addStockEvent.getProductId())
                    .isSuccess(true)
                    .build());
            log.info("Add Stock Event Success");
        } catch (RuntimeException e) {
            producer.sendAddStockEventStatus(AddStockResponse.builder()
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
        if (processedStockIssueRepository.existsById(orderEvent.getId())) {
            return;
        }
        try {
            orderEvent.getOrderDetails().forEach(orderDetail -> {
                inventoryService.stockIssue(StockIssueRequest.builder()
                        .productId(orderDetail.getProductId())
                        .quantity(orderDetail.getQuantity())
                        .build());
            });
            processedStockIssueRepository.save(new ProcessedStockIssue(
                    orderEvent.getId(), LocalDateTime.now()
            ));
            producer.sendStockIssueStatus(StockIssueResponse.builder()
                    .orderId(orderEvent.getId())
                    .isSuccess(true)
                    .build());
            log.info("Stock issue success");
        } catch (RuntimeException e) {
            producer.sendStockIssueStatus(StockIssueResponse.builder()
                    .orderId(orderEvent.getId())
                    .isSuccess(false)
                    .build());
            log.error("Failed to issue stock", e);
            throw e;
        }
    }

    @Transactional
    @KafkaListener(topics = "revert-stock")
    public void handleRevertStock(OrderEvent event) {
        log.info("Received Revert Stock Event : {}", event);
        if (processedRevertStockRepository.existsById(event.getId())) {
            return;
        }
        try {
            event.getOrderDetails().forEach(orderDetail -> {
                inventoryService.revertStock(RevertStockRequest.builder()
                        .productId(orderDetail.getProductId())
                        .quantity(orderDetail.getQuantity())
                        .build());
            });
            processedRevertStockRepository.save(new ProcessedRevertStock(event.getId(), LocalDateTime.now()));
        } catch (RuntimeException e) {
            throw new AppException(ErrorCode.FAIL_TO_REVERT_STOCK);
        }
    }

    @KafkaListener(topics = "delete-product-request")
    @Transactional
    public void deleteProductEvent(DeleteProductEvent deleteProductEvent) {
        log.info("Received Delete Product Event : {}", deleteProductEvent);
        if (deleteProductEvent.isStatus()) {
            var optional = inventoryRepository.findById(deleteProductEvent.getId());
            try {
                if (optional.isPresent()) {
                    var inventory = optional.get();
                    if (inventory.getStatus().equals(Status.ARCHIVED.name())) {
                        return;
                    }
                    inventory.setStatus(Status.ARCHIVED.name());
                    inventoryRepository.save(inventory);
                }
            } catch (RuntimeException e) {
                producer.sendDeleteInventoryEvent(DeleteProductEvent.builder()
                        .id(deleteProductEvent.getId())
                        .status(false)
                        .build());
                throw e;
            }
        }

    }

}
