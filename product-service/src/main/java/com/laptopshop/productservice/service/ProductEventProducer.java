package com.laptopshop.productservice.service;

import com.laptopshop.event.dto.AddStockEvent;
import com.laptopshop.event.dto.DeleteProductEvent;
import com.laptopshop.productservice.dto.response.ProductResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductEventProducer {
    KafkaTemplate<String, Object> kafkaTemplate;

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

    public void deleteProductEvent(DeleteProductEvent event) {
        try {
            kafkaTemplate.send("delete-product-request", event);
            log.info("Sending delete event to Kafka");
        } catch (Exception e) {
            log.error("Error while sending delete event : {}", e.getMessage());
        }
    }
}

