package com.laptopshop.productservice.service;

import com.laptopshop.productservice.dto.request.CategoryCreationRequest;
import com.laptopshop.productservice.dto.request.CategoryUpdateRequest;
import com.laptopshop.productservice.dto.response.CategoryResponse;
import com.laptopshop.productservice.entity.Category;
import com.laptopshop.productservice.exception.AppException;
import com.laptopshop.productservice.exception.ErrorCode;
import com.laptopshop.productservice.mapper.CategoryMapper;
import com.laptopshop.productservice.repository.CategoryRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CategoryService {
    CategoryRepository categoryRepository;
    CategoryMapper categoryMapper;

    public CategoryResponse createCategory(CategoryCreationRequest request) {
        Category category = categoryMapper.toCategory(request);
        category = categoryRepository.save(category);
        return categoryMapper.toResponse(category);
    }

    public CategoryResponse updateCategory(CategoryUpdateRequest request) {
        Category category = categoryRepository.findById(request.getName())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        category.setDescription(request.getDescription());
        category = categoryRepository.save(category);
        return categoryMapper.toResponse(category);
    }

    public void deleteCategory(String id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        categoryRepository.deleteById(id);
    }

    public List<CategoryResponse> getCategories() {
        return categoryRepository.findAll().stream().map(categoryMapper::toResponse).toList();
    }
}
