package com.laptopshop.orderservice.service;

import com.laptopshop.event.dto.OrderEvent;
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

    @Transactional
    public OrderEvent create() {
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
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        List<OrderDetail> data = null;
        try {
            data = orderDetailService.create(order, cart.getCartDetails());
        } catch (AppException e) {
            log.error("Error while create order detail :{}", e.getMessage());
            throw e;
        }
        order.setOrderDetails(data);
        order = orderRepository.save(order);
        return orderMapper.toOrderEvent(order);
    }
}
