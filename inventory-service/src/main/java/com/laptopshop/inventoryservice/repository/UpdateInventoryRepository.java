package com.laptopshop.inventoryservice.repository;

import com.laptopshop.inventoryservice.entity.UpdateInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UpdateInventoryRepository extends JpaRepository<UpdateInventory, String> {
}
