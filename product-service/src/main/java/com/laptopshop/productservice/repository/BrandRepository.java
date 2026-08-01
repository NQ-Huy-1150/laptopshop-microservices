package com.laptopshop.productservice.repository;

import com.laptopshop.productservice.entity.Brand;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BrandRepository extends MongoRepository<Brand, String> {
}
