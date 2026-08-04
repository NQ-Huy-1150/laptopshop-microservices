package com.laptopshop.productservice.service;

import com.laptopshop.event.dto.AddStockResponse;
import com.laptopshop.event.dto.DeleteProductEvent;
import com.laptopshop.event.dto.OutOfStockResponse;
import com.laptopshop.event.dto.RestockEvent;
import com.laptopshop.productservice.dto.request.ProductInfoRequest;
import com.laptopshop.productservice.dto.response.ProductInfoResponse;
import com.laptopshop.productservice.entity.Product;
import com.laptopshop.productservice.enums.Status;
import com.laptopshop.productservice.exception.AppException;
import com.laptopshop.productservice.exception.ErrorCode;
import com.laptopshop.productservice.repository.ProductRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductEventListener {
    KafkaTemplate<String, Object> kafkaTemplate;
    ProductRepository productRepository;

    @KafkaListener(topics = "add-stock-response")
    public void handleAddStockResponse(AddStockResponse response) {
        log.info("Received add stock response from Kafka");
        log.info("isSuccess={}", response.isSuccess());
        Product product = productRepository.findById(response.getProductId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        if (!product.getStatus().equals(Status.PENDING.name())) {
            return;
        }
        if (response.isSuccess()) {
            product.setStatus(Status.ACTIVE.name());
        } else {
            product.setStatus(Status.FAILED.name());
        }
        productRepository.save(product);
    }

    @KafkaListener(topics = "product-info-request")
    public void handleProductInfoRequest(ProductInfoRequest request) {
        log.info("Received product info with id : {}", request.getId());
        var product = productRepository.findById(request.getId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        ProductInfoResponse productInfoResponse = ProductInfoResponse.builder()
                .id(product.getId())
                .price(product.getPrice())
                .build();
        try {
            kafkaTemplate.send("product-info-response", productInfoResponse);
            log.info("Retrieved successfully");
        } catch (Exception e) {
            log.error("Error while response message : {}", e.getMessage());
        }
    }

    @KafkaListener(topics = "out-of-stock-response")
    public void handleOutOfStockEvent(OutOfStockResponse response) {
        log.info("Received out of stock response from Kafka");
        var product = productRepository.findById(response.getId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        if (product.getStatus().equals(Status.OUT_OF_STOCK.name())) {
            return;
        }
        product.setStatus(Status.OUT_OF_STOCK.name());
        productRepository.save(product);
    }

    @KafkaListener(topics = "delete-inventory-response")
    public void handleDeleteInventoryResponse(DeleteProductEvent event) {
        log.info("Received delete inventory response from Kafka : {}", event.isStatus());
        if (!event.isStatus()) {
            var product = productRepository.findById(event.getId())
                    .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
            if (!product.getStatus().equals(Status.DELETED.name())) {
            } else {
                product.setStatus(Status.ACTIVE.name());
                productRepository.save(product);
            }
        }
    }

    @KafkaListener(topics = "restock-event")
    public void handleRestockEvent(RestockEvent event) {
        log.info("Received restock event from Kafka : {}", event.isStatus());
        if (event.isStatus()) {
            var product = productRepository.findById(event.getId())
                    .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
            if (!product.getStatus().equals(Status.OUT_OF_STOCK.name())) {
                return;
            }
            product.setStatus(Status.ACTIVE.name());
            productRepository.save(product);
        }
    }
}
