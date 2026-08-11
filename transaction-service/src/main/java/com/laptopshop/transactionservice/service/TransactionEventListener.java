package com.laptopshop.transactionservice.service;

import com.laptopshop.event.dto.OrderEvent;
import com.laptopshop.event.dto.TransactionEvent;
import com.laptopshop.transactionservice.entity.ProcessedOrder;
import com.laptopshop.transactionservice.enums.PaymentMethod;
import com.laptopshop.transactionservice.enums.Status;
import com.laptopshop.transactionservice.exception.AppException;
import com.laptopshop.transactionservice.exception.ErrorCode;
import com.laptopshop.transactionservice.repository.ProcessedOrderRepository;
import com.laptopshop.transactionservice.repository.ProcessedTransactionRepository;
import com.laptopshop.transactionservice.repository.TransactionMgmtRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class TransactionEventListener {
    ProcessedOrderRepository processedOrderRepository;
    TransactionService transactionService;
    TransactionEventProducer producer;
    ProcessedTransactionRepository processedTransactionRepository;
    TransactionMgmtRepository transactionMgmtRepository;

    @Transactional
    @KafkaListener(topics = "order-created")
    public void handleTransactionEvent(OrderEvent event) {
        log.info("Received transaction event from Kafka");
        if (processedOrderRepository.existsById(event.getId())) {
            return;
        }
        try {
            if (event.getPaymentMethod().equals(PaymentMethod.COD.name())) {
                transactionService.createCODTransaction(event);
            } else if (event.getPaymentMethod().equals(PaymentMethod.QR_CODE.name())) {
                // implement vnpay code here
            } else {
                log.error("Payment method not supported : {}", event.getPaymentMethod());
                producer.transactionEventResponse(TransactionEvent.builder()
                        .orderId(event.getId())
                        .isSuccess(false)
                        .build());
            }
            // save processed order
            processedOrderRepository.save(new ProcessedOrder(event.getId(), LocalDateTime.now()));
        } catch (AppException e) {
            log.info("Failed to make transaction", e);
            throw e;
        }
    }

    @Transactional
    @KafkaListener(topics = "stock-issue-error")
    public void handleCancelTransaction(TransactionEvent event) {
        log.info("Received cancel transaction event from Kafka");
        if (processedTransactionRepository.existsById(event.getTransactionId())) {
            return;
        }
        if (!event.isSuccess()) {
            var transactionMgmt = transactionMgmtRepository.findById(event.getTransactionId())
                    .orElseThrow(() -> new AppException(ErrorCode.TRANSACTION_NOT_FOUND));
            transactionMgmt.setStatus(Status.FAILED.name());
            transactionMgmtRepository.save(transactionMgmt);
        }
    }
}
