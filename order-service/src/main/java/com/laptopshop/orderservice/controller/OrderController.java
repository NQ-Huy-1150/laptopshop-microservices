package com.laptopshop.orderservice.controller;

import com.laptopshop.event.dto.OrderEvent;
import com.laptopshop.orderservice.dto.request.OrderCreationRequest;
import com.laptopshop.orderservice.dto.response.ApiResponse;
import com.laptopshop.orderservice.service.OrderService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/orders")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderController {
    OrderService orderService;

    @PostMapping
    ApiResponse<OrderEvent> create(@RequestBody OrderCreationRequest request) {
        return ApiResponse.<OrderEvent>builder()
                .result(orderService.create(request))
                .build();
    }
}
