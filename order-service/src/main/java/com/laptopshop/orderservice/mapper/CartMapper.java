package com.laptopshop.orderservice.mapper;

import com.laptopshop.orderservice.dto.response.CartResponse;
import com.laptopshop.orderservice.entity.Cart;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CartMapper {
    CartResponse toResponse(Cart cart);
}
