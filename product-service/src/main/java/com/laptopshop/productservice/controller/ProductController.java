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
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
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
            @RequestParam("files") MultipartFile[] files,
            @RequestPart("request") @Valid ProductCreationRequest request
    ) {
        log.info("number of files: {}", files.length);
        return ApiResponse.<ProductResponse>builder()
                .result(productService.create(files, request))
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
