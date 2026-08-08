package com.laptopshop.orderservice.controller;

import com.laptopshop.orderservice.dto.request.CartDetailUpdateRequest;
import com.laptopshop.orderservice.dto.response.ApiResponse;
import com.laptopshop.orderservice.dto.response.CartDetailResponse;
import com.laptopshop.orderservice.service.CartDetailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/details")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartDetailController {
    CartDetailService cartDetailService;

    @PutMapping
    public ApiResponse<CartDetailResponse> updateCartDetail(
            @RequestBody CartDetailUpdateRequest request) {
        cartDetailService.updateCartDetail(request, true);
        return ApiResponse.<CartDetailResponse>builder().build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> deleteCartDetail(@PathVariable String id) {
        cartDetailService.deleteCartDetail(id);
        return ApiResponse.builder()
                .code(200)
                .message("Cart detail deleted successfully")
                .build();
    }
}
