package com.laptopshop.orderservice.controller;

import com.laptopshop.orderservice.dto.request.AddProductRequest;
import com.laptopshop.orderservice.dto.response.ApiResponse;
import com.laptopshop.orderservice.dto.response.CartResponse;
import com.laptopshop.orderservice.service.CartService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/carts")
public class CartController {
    CartService cartService;

    @PostMapping
    ApiResponse<CartResponse> create(@RequestBody AddProductRequest request) {
        return ApiResponse.<CartResponse>builder()
                .result(this.cartService.addProductToCart(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<CartResponse>> getAllCard() {
        return ApiResponse.<List<CartResponse>>builder()
                .result(cartService.getAllCart())
                .build();
    }
}
