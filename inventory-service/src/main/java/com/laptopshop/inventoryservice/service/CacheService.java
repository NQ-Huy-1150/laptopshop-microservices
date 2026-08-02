package com.laptopshop.inventoryservice.service;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Component;

@Component
public class CacheService {
    @CacheEvict(value = "inventories", allEntries = true)
    public void invalidateCache() {

    }
}
