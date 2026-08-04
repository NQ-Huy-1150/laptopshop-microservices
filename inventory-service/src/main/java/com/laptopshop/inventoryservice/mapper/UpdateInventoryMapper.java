package com.laptopshop.inventoryservice.mapper;

import com.laptopshop.inventoryservice.dto.request.UpdateStockRequest;
import com.laptopshop.inventoryservice.entity.UpdateInventory;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UpdateInventoryMapper {
    UpdateInventory toUpdateInventory(UpdateStockRequest updateStockRequest);
}
