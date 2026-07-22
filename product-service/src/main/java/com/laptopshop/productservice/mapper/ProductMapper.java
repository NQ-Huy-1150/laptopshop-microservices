package com.laptopshop.productservice.mapper;

import com.laptopshop.productservice.dto.request.ProductCreationRequest;
import com.laptopshop.productservice.dto.response.ProductResponse;
import com.laptopshop.productservice.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    @Mapping(target = "categoryIds", ignore = true)
    Product toProduct(ProductCreationRequest productCreationRequest);

    ProductResponse toResponse(Product product);
}
