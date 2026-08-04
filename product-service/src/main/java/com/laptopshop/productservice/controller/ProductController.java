package com.laptopshop.productservice.controller;

import com.laptopshop.productservice.dto.request.ProductCreationRequest;
import com.laptopshop.productservice.dto.request.ProductInfoRequest;
import com.laptopshop.productservice.dto.request.ProductUpdateRequest;
import com.laptopshop.productservice.dto.response.ApiResponse;
import com.laptopshop.productservice.dto.response.PageResponse;
import com.laptopshop.productservice.dto.response.ProductInfoResponse;
import com.laptopshop.productservice.dto.response.ProductResponse;
import com.laptopshop.productservice.service.ProductService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductController {
    ProductService productService;

//    @GetMapping
//    ApiResponse<List<ProductResponse>> findAll() {
//        log.info("Finding all products");
//        return ApiResponse.<List<ProductResponse>>builder()
//                .result(productService.findAll())
//                .build();
//    }

    @GetMapping
    ApiResponse<PageResponse<ProductResponse>> fetchAll(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size,
            @RequestParam(value = "isDesc", required = false, defaultValue = "false") boolean isDesc
    ) {
        log.info("Finding all products, page: {}, size: {}", page, size);
        return ApiResponse.<PageResponse<ProductResponse>>builder()
                .result(productService.fetchAll(page, size, isDesc))
                .build();
    }

    @PostMapping("/info")
    ApiResponse<ProductInfoResponse> getInfo(@RequestBody ProductInfoRequest productInfoRequest) {
        return ApiResponse.<ProductInfoResponse>builder()
                .result(productService.getInfo(productInfoRequest))
                .build();
    }

    @PostMapping
    ApiResponse<ProductResponse> create(
            @RequestPart("files") MultipartFile[] files,
            @RequestPart("request") @Valid ProductCreationRequest request
    ) {
        log.info("number of files: {}", files.length);
        log.info("brand : {}", request.getBrand());
        return ApiResponse.<ProductResponse>builder()
                .result(productService.create(files, request))
                .build();
    }

    @PutMapping
    ApiResponse<ProductResponse> update(
            @RequestPart(value = "files", required = false) MultipartFile[] files,
            @RequestPart("request") @Valid ProductUpdateRequest request) {
        return ApiResponse.<ProductResponse>builder()
                .result(productService.update(files, request))
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
