package com.laptopshop.orderservice.service;

import com.laptopshop.orderservice.dto.request.AddProductRequest;
import com.laptopshop.orderservice.dto.request.CartDetailUpdateRequest;
import com.laptopshop.orderservice.dto.response.CartResponse;
import com.laptopshop.orderservice.entity.Cart;
import com.laptopshop.orderservice.entity.CartDetail;
import com.laptopshop.orderservice.enums.Status;
import com.laptopshop.orderservice.exception.AppException;
import com.laptopshop.orderservice.mapper.CartMapper;
import com.laptopshop.orderservice.repository.CartRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CartService {
    CartRepository cartRepository;
    CartDetailService cartDetailService;
    CartMapper cartMapper;

    @Transactional
    public CartResponse addProductToCart(AddProductRequest request) {
        Cart cart = new Cart();
        List<CartDetail> cartDetails = new ArrayList<>();
        var userId = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Cart> optional = cartRepository
                .findFirstByStatusAndUserIdOrderByUpdatedAtDesc(Status.PENDING.name(), userId);
        if (optional.isPresent()) {
            cart = optional.get();
            cartDetails = cart.getCartDetails();
        } else {
            cart.setId(UUID.randomUUID().toString());
            cart.setUserId(userId);
            cart.setStatus(Status.PENDING.name());
            cart.setCreatedAt(LocalDateTime.now());
        }
        Cart finalCart = cart;
        try {
            List<CartDetail> finalCartDetails = cartDetails;
            request.getCartDetails().forEach(cartDetail -> {
                for (CartDetail currentCartDetail : finalCartDetails) {
                    if (currentCartDetail.getProductId().equals(cartDetail.getProductId())) {
                        cartDetailService.updateCartDetail(CartDetailUpdateRequest.builder()
                                .id(currentCartDetail.getId())
                                .quantity(currentCartDetail.getQuantity() + cartDetail.getQuantity())
                                .build(), false);
                        return;
                    }
                }
                var data = cartDetailService.create(cartDetail, finalCart);
                finalCartDetails.add(data);
            });
        } catch (AppException e) {
            log.error("Error while creating cart details", e);
            throw e;
        }
        cart.setCartDetails(cartDetails);
        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
        return cartMapper.toResponse(cart);
    }

    public List<CartResponse> getAllCart() {
        return cartRepository.findAll().stream().map(cartMapper::toResponse).toList();
    }
}
