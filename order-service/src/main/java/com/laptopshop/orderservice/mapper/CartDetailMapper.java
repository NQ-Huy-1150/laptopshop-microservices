package com.laptopshop.orderservice.mapper;

import com.laptopshop.orderservice.dto.response.CartDetailResponse;
import com.laptopshop.orderservice.entity.CartDetail;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CartDetailMapper {
    CartDetailResponse toResponse(CartDetail cartDetail);
}
