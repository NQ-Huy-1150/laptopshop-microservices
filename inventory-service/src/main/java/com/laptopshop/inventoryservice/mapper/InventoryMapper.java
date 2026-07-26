package com.laptopshop.inventoryservice.mapper;

import com.laptopshop.event.dto.AddStockEvent;
import com.laptopshop.inventoryservice.dto.response.InventoryResponse;
import com.laptopshop.inventoryservice.dto.response.StockResponse;
import com.laptopshop.inventoryservice.entity.Inventory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InventoryMapper {
    @Mapping(target = "stock", source = "quantity")
    Inventory toInventory(AddStockEvent addStockRequest);

    StockResponse toStockResponse(Inventory inventory);

    InventoryResponse toInventoryResponse(Inventory inventory);
}
