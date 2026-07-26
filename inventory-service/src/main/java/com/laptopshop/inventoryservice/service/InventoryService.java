package com.laptopshop.inventoryservice.service;

import com.laptopshop.event.dto.AddStockEvent;
import com.laptopshop.inventoryservice.dto.request.StockIssueRequest;
import com.laptopshop.inventoryservice.dto.request.UpdateStockRequest;
import com.laptopshop.inventoryservice.dto.response.InventoryResponse;
import com.laptopshop.inventoryservice.dto.response.StockResponse;
import com.laptopshop.inventoryservice.entity.Inventory;
import com.laptopshop.inventoryservice.exception.AppException;
import com.laptopshop.inventoryservice.exception.ErrorCode;
import com.laptopshop.inventoryservice.mapper.InventoryMapper;
import com.laptopshop.inventoryservice.repository.InventoryRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class InventoryService {
    InventoryRepository inventoryRepository;
    InventoryMapper inventoryMapper;

    @Transactional
    public StockResponse createStock(AddStockEvent request) {
        Inventory inventory = inventoryMapper.toInventory(request);
        return inventoryMapper.toStockResponse(inventoryRepository.save(inventory));
    }

    @Transactional
    public InventoryResponse updateStock(UpdateStockRequest request) {
        Inventory inventory = inventoryRepository.findById(request.getProductId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        inventory.setStock(request.getQuantity());
        return inventoryMapper.toInventoryResponse(inventoryRepository.save(inventory));
    }

    private void revertStock(Inventory inventory, StockIssueRequest request) {

    }

    @Transactional
    public InventoryResponse stockIssue(StockIssueRequest request) {
        try {
            Inventory inventory = new Inventory();
            Optional<Inventory> optional = inventoryRepository.findById(request.getProductId());
            if (optional.isEmpty()) {
                throw new RuntimeException("Product not found");
            } else {
                inventory = optional.get();
                if (inventory.getStock() < request.getQuantity()) {
                    throw new AppException(ErrorCode.NEGATIVE_STOCK);
                }
                inventory.setStock(inventory.getStock() - request.getQuantity());
                inventory.setStockIssue(inventory.getStockIssue() + request.getQuantity());
                return inventoryMapper.toInventoryResponse(inventoryRepository.save(inventory));
            }
        } catch (RuntimeException e) {
            // send error status to product
            throw e;
        }
    }
}
