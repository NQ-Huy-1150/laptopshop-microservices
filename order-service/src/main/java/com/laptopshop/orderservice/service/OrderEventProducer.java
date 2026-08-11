package com.laptopshop.orderservice.service;

import com.laptopshop.event.dto.OrderEvent;
import com.laptopshop.event.dto.TransactionEvent;
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
public class OrderEventProducer {
    KafkaTemplate<String, Object> kafkaTemplate;

    public void submitOrder(OrderEvent event) {
        try {
            kafkaTemplate.send("order-created", event);
            log.info("Sending stock issue event to Kafka");
        } catch (KafkaException e) {
            log.error("Error while sending message : ", e);
            throw e;
        }
    }

    public void handleStockIssueFailed(TransactionEvent event) {
        try {
            kafkaTemplate.send("stock-issue-error", event);
        } catch (KafkaException e) {
            log.error("Error while sending message : ", e);
            throw e;
        }
    }

    public void handleRevertStock(OrderEvent event) {
        try {
            kafkaTemplate.send("revert-stock", event);
        } catch (KafkaException e) {
            log.error("Error while sending message : ", e);
            throw e;
        }
    }

}
