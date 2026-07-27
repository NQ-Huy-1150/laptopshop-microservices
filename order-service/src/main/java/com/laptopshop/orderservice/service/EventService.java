package com.laptopshop.orderservice.service;

import com.laptopshop.event.dto.OrderEvent;
import com.laptopshop.event.dto.StockIssueResponse;
import com.laptopshop.orderservice.entity.Order;
import com.laptopshop.orderservice.enums.Status;
import com.laptopshop.orderservice.exception.AppException;
import com.laptopshop.orderservice.exception.ErrorCode;
import com.laptopshop.orderservice.repository.OrderRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.KafkaException;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class EventService {
    OrderService orderService;
    OrderRepository orderRepository;
    KafkaTemplate<String, Object> kafkaTemplate;

    public void submitOrder(OrderEvent event) {
        try {
            kafkaTemplate.send("order-created", event);
            log.info("Sending add stock event to Kafka");
        } catch (KafkaException e) {
            log.error("Error while sending message : {}", e.getMessage());
        }
    }

    @Transactional
    public OrderEvent handleCreateOrder() {
        OrderEvent event = null;
        try {
            event = orderService.create();
            submitOrder(event);
            return event;
        } catch (RuntimeException e) {
            log.error("Failed to create order : ", e);
            throw e;
        }
    }

    @KafkaListener(topics = "stock-issue-status")
    @Transactional
    public void modifyOrderStatus(StockIssueResponse response) {
        log.info("Received stock-issue-status response status : {}", response.isSuccess());
        Order order = orderRepository.findById(response.getOrderId())
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        if (!order.getStatus().equals(Status.PENDING.name())) {
            return;
        }
        if (response.isSuccess()) {
            // do something here
        } else {
            order.setStatus(Status.FAILED.name());
        }
        orderRepository.save(order);
    }
}
