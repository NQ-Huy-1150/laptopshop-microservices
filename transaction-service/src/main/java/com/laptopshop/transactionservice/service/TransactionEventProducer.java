package com.laptopshop.transactionservice.service;

import com.laptopshop.event.dto.TransactionEvent;
import com.laptopshop.transactionservice.exception.AppException;
import com.laptopshop.transactionservice.exception.ErrorCode;
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
public class TransactionEventProducer {
    KafkaTemplate<String, Object> kafkaTemplate;

    public void transactionEventResponse(TransactionEvent event) {
        try {
            kafkaTemplate.send("transaction_event", event);
            log.info("Sent transaction event to kafka successfully");
        } catch (KafkaException e) {
            log.error("Error while sending transaction event to kafka", e);
            throw new AppException(ErrorCode.FAIL_TO_SEND_MESSAGE_TO_KAFKA);
        }
    }
}
