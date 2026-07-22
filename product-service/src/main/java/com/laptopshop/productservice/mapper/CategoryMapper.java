package com.laptopshop.productservice.mapper;

import com.laptopshop.productservice.dto.request.CategoryCreationRequest;
import com.laptopshop.productservice.dto.response.CategoryResponse;
import com.laptopshop.productservice.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    @Mapping(target = "id", source = "name")
    Category toCategory(CategoryCreationRequest categoryCreationRequest);

    CategoryResponse toResponse(Category category);
}
