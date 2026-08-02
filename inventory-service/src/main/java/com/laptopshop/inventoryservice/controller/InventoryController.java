package com.laptopshop.inventoryservice.controller;

import com.laptopshop.event.dto.AddStockEvent;
import com.laptopshop.inventoryservice.dto.request.UpdateStockRequest;
import com.laptopshop.inventoryservice.dto.response.ApiResponse;
import com.laptopshop.inventoryservice.dto.response.InventoryResponse;
import com.laptopshop.inventoryservice.dto.response.StockResponse;
import com.laptopshop.inventoryservice.service.InventoryService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/management")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class InventoryController {
    InventoryService inventoryService;

    @PostMapping("/stocks")
    ApiResponse<StockResponse> addStock(@RequestBody @Valid AddStockEvent request) {
        return ApiResponse.<StockResponse>builder()
                .result(inventoryService.createStock(request))
                .build();
    }

    @PutMapping("/stocks")
    ApiResponse<InventoryResponse> updateStock(@RequestBody @Valid UpdateStockRequest request) {
        return ApiResponse.<InventoryResponse>builder()
                .result(inventoryService.updateStock(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<InventoryResponse>> fetchAllInventory() {
        return ApiResponse.<List<InventoryResponse>>builder()
                .result(inventoryService.fetchAllInventory())
                .build();
    }

}
