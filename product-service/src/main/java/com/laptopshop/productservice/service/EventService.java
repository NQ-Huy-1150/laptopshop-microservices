package com.laptopshop.productservice.service;

import com.laptopshop.event.dto.AddStockEvent;
import com.laptopshop.event.dto.AddStockResponse;
import com.laptopshop.productservice.dto.request.ProductCreationRequest;
import com.laptopshop.productservice.dto.response.ProductResponse;
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
import org.springframework.web.multipart.MultipartFile;

@Component
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EventService {
    KafkaTemplate<String, Object> kafkaTemplate;
    ProductService productService;
    ProductRepository productRepository;

    public void sendEventMessage(ProductResponse response) {
        AddStockEvent addStockEvent = AddStockEvent.builder()
                .productId(response.getId())
                .quantity(response.getQuantity())
                .build();
        try {
            kafkaTemplate.send("add-stock-request", addStockEvent);
            log.info("Sending add stock event to Kafka");
        } catch (Exception e) {
            log.error("Error while sending message : {}", e.getMessage());
        }
    }

    public ProductResponse handleCreateEvent(MultipartFile[] files, ProductCreationRequest request) {
        var response = productService.create(files, request);
        sendEventMessage(response);
        return response;
    }

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
            product.setStatus(Status.SUCCESS.name());
        } else {
            product.setStatus(Status.FAILED.name());
        }
        productRepository.save(product);
    }
}
