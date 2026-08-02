package com.laptopshop.productservice.service;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Component;

@Component
public class CacheService {
    @CacheEvict(value = "products", allEntries = true)
    public void invalidateCache() {
    }
}
