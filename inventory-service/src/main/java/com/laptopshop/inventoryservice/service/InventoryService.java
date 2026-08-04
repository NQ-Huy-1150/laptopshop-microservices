package com.laptopshop.inventoryservice.service;

import com.laptopshop.event.dto.AddStockEvent;
import com.laptopshop.event.dto.OutOfStockResponse;
import com.laptopshop.event.dto.RestockEvent;
import com.laptopshop.inventoryservice.dto.request.StockIssueRequest;
import com.laptopshop.inventoryservice.dto.request.UpdateStockRequest;
import com.laptopshop.inventoryservice.dto.response.InventoryResponse;
import com.laptopshop.inventoryservice.dto.response.StockResponse;
import com.laptopshop.inventoryservice.entity.Inventory;
import com.laptopshop.inventoryservice.enums.Status;
import com.laptopshop.inventoryservice.enums.UpdateType;
import com.laptopshop.inventoryservice.exception.AppException;
import com.laptopshop.inventoryservice.exception.ErrorCode;
import com.laptopshop.inventoryservice.mapper.InventoryMapper;
import com.laptopshop.inventoryservice.repository.InventoryRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class InventoryService {
    InventoryRepository inventoryRepository;
    UpdateInventoryService updateInventoryService;
    InventoryEventProducer producer;
    CacheService cacheService;
    InventoryMapper inventoryMapper;

    @Transactional
    public StockResponse createStock(AddStockEvent request) {
        Inventory inventory = inventoryMapper.toInventory(request);
        inventory.setStatus(Status.ACTIVE.name());
        inventory = inventoryRepository.save(inventory);
        cacheService.invalidateCache();
        return inventoryMapper.toStockResponse(inventory);
    }

    @Transactional
    public InventoryResponse updateStock(UpdateStockRequest request) {
        Inventory inventory = inventoryRepository.findById(request.getProductId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        try {
            updateInventoryService.addUpdateLog(request);
        } catch (RuntimeException e) {
            log.error("Failed to update inventory", e);
            throw e;
        }
        var updateMode = request.getUpdateType();
        // add
        if (updateMode.equals(UpdateType.ADD.name())) {
            try {
                inventory.setStock(inventory.getStock() + request.getQuantity());
                inventory = inventoryRepository.save(inventory);
                producer.sendReStockEvent(RestockEvent.builder()
                        .id(inventory.getProductId())
                        .status(true)
                        .build());
            } catch (Exception e) {
                throw new AppException(ErrorCode.FAIL_TO_SEND_RESTOCK_MESSAGE);
            }
            // subtract
        } else if (updateMode.equals(UpdateType.SUBTRACT.name())) {
            var newStock = inventory.getStock() - request.getQuantity();
            if (newStock <= 0) {
                inventory.setStock(0);
                try {
                    inventory = inventoryRepository.save(inventory);
                    producer.sendOutOfStockEvent(OutOfStockResponse.builder()
                            .id(request.getProductId())
                            .status(true)
                            .build());
                } catch (RuntimeException e) {
                    throw new AppException(ErrorCode.FAIL_TO_SEND_OUT_OF_STOCK_MESSAGE);
                }
            } else {
                inventory.setStock(newStock);
                inventory = inventoryRepository.save(inventory);
            }
            // absolute set
        } else if (updateMode.equals(UpdateType.OVERRIDE.name())) {
            inventory.setStock(request.getQuantity());
            inventory = inventoryRepository.save(inventory);
        } else {
            log.error("Invalid update mode : {}", updateMode);
            throw new AppException(ErrorCode.UPDATE_TYPE_NOT_FOUND);
        }
        cacheService.invalidateCache();
        return inventoryMapper.toInventoryResponse(inventory);
    }

    private void revertStock(Inventory inventory, StockIssueRequest request) {

    }

    @Transactional
    public InventoryResponse stockIssue(StockIssueRequest request) {
        Inventory inventory = new Inventory();
        Optional<Inventory> optional = inventoryRepository.findById(request.getProductId());
        if (optional.isEmpty()) {
            throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
        } else {
            inventory = optional.get();
            if (inventory.getStock() < request.getQuantity()) {
                throw new AppException(ErrorCode.NEGATIVE_STOCK);
            }
            var newStock = inventory.getStock() - request.getQuantity();
            if (newStock == 0) {
                inventory.setStock(0);
                producer.sendOutOfStockEvent(OutOfStockResponse.builder()
                        .id(request.getProductId())
                        .status(true)
                        .build());
            } else inventory.setStock(newStock);
            inventory.setStockIssue(inventory.getStockIssue() + request.getQuantity());
            inventory = inventoryRepository.save(inventory);
            cacheService.invalidateCache();
            return inventoryMapper.toInventoryResponse(inventory);
        }
    }

    @Cacheable(value = "inventories", key = "'all'")
    public List<InventoryResponse> fetchAllInventory() {
        return inventoryRepository.findAll().stream().map(inventoryMapper::toInventoryResponse).toList();
    }
}
