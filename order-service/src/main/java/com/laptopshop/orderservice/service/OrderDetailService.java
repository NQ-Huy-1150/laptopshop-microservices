package com.laptopshop.orderservice.service;

import com.laptopshop.orderservice.entity.CartDetail;
import com.laptopshop.orderservice.entity.Order;
import com.laptopshop.orderservice.entity.OrderDetail;
import com.laptopshop.orderservice.repository.OrderDetailRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class OrderDetailService {
    OrderDetailRepository orderDetailRepository;

    @Transactional
    public List<OrderDetail> create(Order order, List<CartDetail> cartDetails) {
        List<OrderDetail> orderDetails = new ArrayList<>();
        cartDetails.forEach(cartDetail -> {
            OrderDetail orderDetail = OrderDetail.builder()
                    .order(order)
                    .productId(cartDetail.getProductId())
                    .quantity(cartDetail.getQuantity())
                    .price(cartDetail.getPrice())
                    .build();
            orderDetail = orderDetailRepository.save(orderDetail);
            orderDetails.add(orderDetail);
        });
        return orderDetails;
    }
}
