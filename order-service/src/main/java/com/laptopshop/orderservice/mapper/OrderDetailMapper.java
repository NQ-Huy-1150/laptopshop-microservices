package com.laptopshop.orderservice.mapper;

import com.laptopshop.orderservice.dto.response.OrderDetailResponse;
import com.laptopshop.orderservice.entity.OrderDetail;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderDetailMapper {
    OrderDetailResponse toOrderDetailResponse(OrderDetail orderDetail);
}
