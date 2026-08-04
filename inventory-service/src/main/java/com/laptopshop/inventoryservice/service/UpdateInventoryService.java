package com.laptopshop.inventoryservice.service;

import com.laptopshop.inventoryservice.dto.request.UpdateStockRequest;
import com.laptopshop.inventoryservice.entity.UpdateInventory;
import com.laptopshop.inventoryservice.mapper.UpdateInventoryMapper;
import com.laptopshop.inventoryservice.repository.UpdateInventoryRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Service
public class UpdateInventoryService {
    UpdateInventoryRepository updateInventoryRepository;
    UpdateInventoryMapper updateInventoryMapper;

    @Transactional
    public void addUpdateLog(UpdateStockRequest request) {
        UpdateInventory updateInventory = updateInventoryMapper.toUpdateInventory(request);
        updateInventoryRepository.save(updateInventory);
    }
}
