package com.laptopshop.orderservice.service;

import com.laptopshop.event.dto.StockIssueResponse;
import com.laptopshop.event.dto.TransactionEvent;
import com.laptopshop.orderservice.entity.Order;
import com.laptopshop.orderservice.entity.ProcessedTransaction;
import com.laptopshop.orderservice.enums.Status;
import com.laptopshop.orderservice.exception.AppException;
import com.laptopshop.orderservice.exception.ErrorCode;
import com.laptopshop.orderservice.repository.OrderRepository;
import com.laptopshop.orderservice.repository.ProcessedTransactionRepository;
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
public class OrderEventListener {
    OrderRepository orderRepository;
    ProcessedTransactionRepository processedTransactionRepository;
    OrderEventProducer producer;
    OrderService orderService;

    @KafkaListener(topics = "stock-issue-status")
    @Transactional
    public void handleStockIssueStatus(StockIssueResponse response) {
        log.info("Received stock-issue-status response status : {}", response.isSuccess());
        Order order = orderRepository.findById(response.getOrderId())
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        if (!order.getStatus().equals(Status.PENDING.name())) {
            return;
        }
        if (response.isSuccess()) {
            order.setStockIssueStatus(Status.SUCCESS.name());

        } else {
            order.setStockIssueStatus(Status.FAILED.name());
        }
        orderRepository.save(order);
        orderService.tryFinalizeOrder(order.getId());
    }

    @Transactional
    @KafkaListener(topics = "transaction_event")
    public void handleTransactionEvent(TransactionEvent event) {
        var order = orderRepository.findById(event.getOrderId())
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        if (event.getTransactionId() != null && processedTransactionRepository.existsById(event.getTransactionId())) {
            return;
        }
        log.info("Received transaction event : {}", event);
        if (event.isSuccess()) {
            order.setTransactionStatus(Status.SUCCESS.name());
            order.setTransactionId(event.getTransactionId());
            processedTransactionRepository.save(new ProcessedTransaction(event.getTransactionId(),
                    event.getOrderId(), LocalDateTime.now()));
        } else {
            order.setTransactionStatus(Status.FAILED.name());
        }
        orderRepository.save(order);
        orderService.tryFinalizeOrder(order.getId());
    }

}
