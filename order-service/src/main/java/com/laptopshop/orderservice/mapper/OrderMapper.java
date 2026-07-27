package com.laptopshop.orderservice.mapper;

import com.laptopshop.event.dto.OrderEvent;
import com.laptopshop.orderservice.entity.Order;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    OrderEvent toOrderEvent(Order order);
}
