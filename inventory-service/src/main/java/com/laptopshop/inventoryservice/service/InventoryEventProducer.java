package com.laptopshop.inventoryservice.service;

import com.laptopshop.event.dto.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.KafkaException;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class InventoryEventProducer {
    KafkaTemplate<String, Object> kafkaTemplate;

    public void sendStockIssueStatus(StockIssueResponse response) {
        kafkaTemplate.send("stock-issue-status", response);
    }

    public void sendAddStockEventStatus(AddStockResponse response) {
        kafkaTemplate.send("add-stock-response", response);
    }

    public void sendOutOfStockEvent(OutOfStockResponse response) {
        try {
            kafkaTemplate.send("out-of-stock-response", response);
            log.info("Sending out of stock response");
        } catch (KafkaException e) {
            throw new RuntimeException(e);
        }

    }

    public void sendReStockEvent(RestockEvent response) {
        try {
            kafkaTemplate.send("restock-event", response);
            log.info("Sending restock event");
        } catch (KafkaException e) {
            throw new RuntimeException(e);
        }
    }

    public void sendDeleteInventoryEvent(DeleteProductEvent event) {
        try {
            kafkaTemplate.send("delete-inventory-response", event);
            log.info("Sending delete inventory response");
        } catch (KafkaException e) {
            throw new RuntimeException(e);
        }
    }
}
