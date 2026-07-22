package com.laptopshop.productservice.controller;

import com.laptopshop.productservice.dto.request.ProductCreationRequest;
import com.laptopshop.productservice.dto.request.ProductUpdateRequest;
import com.laptopshop.productservice.dto.response.ApiResponse;
import com.laptopshop.productservice.dto.response.ProductResponse;
import com.laptopshop.productservice.service.ProductService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductController {
    ProductService productService;

    @GetMapping
    ApiResponse<List<ProductResponse>> findAll() {
        return ApiResponse.<List<ProductResponse>>builder()
                .result(productService.findAll())
                .build();
    }

    @PostMapping
    ApiResponse<ProductResponse> create(
            @RequestBody @Valid ProductCreationRequest request
    ) {
        return ApiResponse.<ProductResponse>builder()
                .result(productService.create(request))
                .build();
    }

    @PutMapping
    ApiResponse<ProductResponse> update(@RequestBody @Valid ProductUpdateRequest request) {
        return ApiResponse.<ProductResponse>builder()
                .result(productService.update(request))
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<?> delete(@PathVariable String id) {
        productService.delete(id);
        return ApiResponse.builder()
                .code(200)
                .message("Product deleted successfully")
                .build();
    }

}
