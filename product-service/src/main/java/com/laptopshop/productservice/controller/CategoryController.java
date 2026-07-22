package com.laptopshop.productservice.controller;

import com.laptopshop.productservice.dto.request.CategoryCreationRequest;
import com.laptopshop.productservice.dto.request.CategoryUpdateRequest;
import com.laptopshop.productservice.dto.response.ApiResponse;
import com.laptopshop.productservice.dto.response.CategoryResponse;
import com.laptopshop.productservice.service.CategoryService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryController {
    CategoryService categoryService;

    @PostMapping
    ApiResponse<CategoryResponse> create(@RequestBody @Valid CategoryCreationRequest request) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.createCategory(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<CategoryResponse>> getCategories() {
        return ApiResponse.<List<CategoryResponse>>builder()
                .result(categoryService.getCategories())
                .build();
    }

    @PutMapping
    ApiResponse<CategoryResponse> update(@RequestBody @Valid CategoryUpdateRequest request) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.updateCategory(request))
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<?> deleteCategory(@PathVariable String id) {
        categoryService.deleteCategory(id);
        return ApiResponse.builder()
                .code(200)
                .message("Category deleted successfully")
                .build();
    }
}
