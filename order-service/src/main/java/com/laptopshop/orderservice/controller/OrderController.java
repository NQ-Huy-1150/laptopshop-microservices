package com.laptopshop.orderservice.controller;

import com.laptopshop.event.dto.OrderEvent;
import com.laptopshop.orderservice.dto.response.ApiResponse;
import com.laptopshop.orderservice.service.EventService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/orders")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderController {
    EventService eventService;

    @PostMapping
    ApiResponse<OrderEvent> create() {
        return ApiResponse.<OrderEvent>builder()
                .result(eventService.handleCreateOrder())
                .build();
    }
}
