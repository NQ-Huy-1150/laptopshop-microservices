package com.laptopshop.orderservice.service;

import com.laptopshop.event.dto.OrderEvent;
import com.laptopshop.event.dto.TransactionEvent;
import com.laptopshop.orderservice.dto.request.OrderCreationRequest;
import com.laptopshop.orderservice.dto.response.OrderResponse;
import com.laptopshop.orderservice.dto.response.PageResponse;
import com.laptopshop.orderservice.entity.Cart;
import com.laptopshop.orderservice.entity.Order;
import com.laptopshop.orderservice.entity.OrderDetail;
import com.laptopshop.orderservice.enums.Status;
import com.laptopshop.orderservice.exception.AppException;
import com.laptopshop.orderservice.exception.ErrorCode;
import com.laptopshop.orderservice.mapper.OrderMapper;
import com.laptopshop.orderservice.repository.CartRepository;
import com.laptopshop.orderservice.repository.OrderRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.kafka.KafkaException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class OrderService {
    OrderRepository orderRepository;
    CartRepository cartRepository;
    OrderDetailService orderDetailService;
    OrderMapper orderMapper;
    OrderEventProducer producer;

    @Transactional
    public OrderEvent create(OrderCreationRequest request) {
        var userId = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Cart> optional = cartRepository
                .findFirstByStatusAndUserIdOrderByUpdatedAtDesc(Status.PENDING.name(), userId);
        if (optional.isEmpty()) {
            throw new AppException(ErrorCode.CURRENT_CART_NOT_FOUND);
        }
        Cart cart = optional.get();

        Order order = Order.builder()
                .id(UUID.randomUUID().toString())
                .userId(userId)
                .status(Status.PENDING.name())
                .stockIssueStatus(Status.PENDING.name())
                .transactionStatus(Status.PENDING.name())
                .totalAmount(request.getTotalAmount())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .note(request.getOrderNote())
                .build();
        List<OrderDetail> data = null;
        try {
            data = orderDetailService.create(order, cart.getCartDetails());
        } catch (AppException e) {
            log.error("Error while create order detail :{}", e.getMessage());
            throw e;
        }
        cart.setStatus(Status.CONFIRMED.name());
        cartRepository.save(cart);
        order.setOrderDetails(data);
        order = orderRepository.save(order);
        var event = orderMapper.toOrderEvent(order);
        event.setPaymentMethod(request.getPaymentMethod());
        event.setTotalAmount(request.getTotalAmount());
        event.setRecipientName(request.getRecipientName());
        event.setShippingAddress(request.getShippingAddress());
        event.setEmail(request.getEmail());
        try {
            producer.submitOrder(event);
        } catch (KafkaException e) {
            throw new AppException(ErrorCode.FAIL_TO_CREATE_ORDER);
        }
        return event;
    }

    @Transactional
    public void tryFinalizeOrder(String orderId) {
        var order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        if (!order.getStatus().equals(Status.PENDING.name())) {
            return;
        }
        if (order.getTransactionStatus().equals(Status.SUCCESS.name())
                && order.getStockIssueStatus().equals(Status.SUCCESS.name())) {
            order.setStatus(Status.CONFIRMED.name());
            orderRepository.save(order);
        } else if (order.getStockIssueStatus().equals(Status.FAILED.name())
                && order.getTransactionStatus().equals(Status.SUCCESS.name())) {
            producer.handleStockIssueFailed(TransactionEvent.builder()
                    .transactionId(order.getTransactionId())
                    .isSuccess(false)
                    .build());
            order.setStatus(Status.FAILED.name());
        } else if (order.getTransactionStatus().equals(Status.FAILED.name())
                && order.getStockIssueStatus().equals(Status.SUCCESS.name())) {

            producer.handleRevertStock(orderMapper.toOrderEvent(order));
            order.setStatus(Status.FAILED.name());

        } else if (order.getTransactionStatus().equals(Status.FAILED.name())
                && order.getStockIssueStatus().equals(Status.FAILED.name())) {
            order.setStatus(Status.FAILED.name());
        }
        orderRepository.save(order);
    }

    public PageResponse<OrderResponse> fetchAllOrderByCurrentUser(int page, int size) {
        var userId = SecurityContextHolder.getContext().getAuthentication().getName();
        Sort sort = Sort.by("createdAt").ascending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        var data = orderRepository.findAllByUserId(userId, pageable);
        return PageResponse.<OrderResponse>builder()
                .currentPage(page)
                .pageSize(data.getSize())
                .totalElements(data.getTotalElements())
                .data(data.getContent().stream().map(orderMapper::toResponse).toList())
                .build();
    }
}
