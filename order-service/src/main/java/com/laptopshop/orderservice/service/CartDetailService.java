package com.laptopshop.orderservice.service;

import com.laptopshop.orderservice.dto.request.CartDetailCreationRequest;
import com.laptopshop.orderservice.dto.request.CartDetailUpdateRequest;
import com.laptopshop.orderservice.dto.request.ProductInfoRequest;
import com.laptopshop.orderservice.dto.response.ApiResponse;
import com.laptopshop.orderservice.dto.response.ProductInfoResponse;
import com.laptopshop.orderservice.entity.Cart;
import com.laptopshop.orderservice.entity.CartDetail;
import com.laptopshop.orderservice.exception.AppException;
import com.laptopshop.orderservice.exception.ErrorCode;
import com.laptopshop.orderservice.repository.CartDetailRepository;
import com.laptopshop.orderservice.repository.httpClient.ProductClient;
import feign.FeignException;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CartDetailService {
    CartDetailRepository cartDetailRepository;
    ProductClient productClient;

    @Transactional
    public CartDetail create(CartDetailCreationRequest request, Cart cart) {
        ApiResponse<ProductInfoResponse> data = null;
        try {
            data = productClient.getProductInfo(ProductInfoRequest.builder()
                    .id(request.getProductId())
                    .build());
        } catch (FeignException e) {
            log.error("FeignException: Cant get data from product service, {}", e.getMessage());
            throw new AppException(ErrorCode.CANT_GET_PRODUCT_INFO);
        }
        CartDetail cartDetail = CartDetail.builder()
                .productId(data.getResult().getId())
                .price(data.getResult().getPrice())
                .quantity(request.getQuantity())
                .cart(cart)
                .build();

        cartDetail = cartDetailRepository.save(cartDetail);
        log.info("Cart detail has been saved successfully");
        return cartDetail;
    }

    @Transactional
    public void updateCartDetail(CartDetailUpdateRequest request) {
        var cartDetail = cartDetailRepository.findById(request.getId())
                .orElseThrow(() -> new AppException(ErrorCode.CART_DETAIL_NOT_FOUND));
        var userId = SecurityContextHolder.getContext().getAuthentication().getName();
        if (cartDetail.getCart().getUserId().equals(userId)) {
            cartDetail.setQuantity(request.getQuantity());
        } else throw new AppException(ErrorCode.CART_DETAIL_NOT_FOUND);
        cartDetailRepository.save(cartDetail);
    }

    @Transactional
    public void deleteCartDetail(String id) {
        CartDetail cartDetail = cartDetailRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CART_DETAIL_NOT_FOUND));
        cartDetailRepository.delete(cartDetail);
    }
}
