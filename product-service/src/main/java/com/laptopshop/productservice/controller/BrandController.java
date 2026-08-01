package com.laptopshop.productservice.controller;

import com.laptopshop.productservice.dto.request.BrandCreationRequest;
import com.laptopshop.productservice.dto.response.ApiResponse;
import com.laptopshop.productservice.dto.response.BrandResponse;
import com.laptopshop.productservice.service.BrandService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/brands")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BrandController {
    BrandService brandService;

    @PostMapping
    ApiResponse<BrandResponse> create(@RequestBody BrandCreationRequest request) {
        return ApiResponse.<BrandResponse>builder()
                .result(brandService.createBrand(request))
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<?> delete(@PathVariable String id) {
        brandService.deleteBrand(id);
        return ApiResponse.builder().build();
    }

    @GetMapping
    ApiResponse<List<BrandResponse>> findAll() {
        return ApiResponse.<List<BrandResponse>>builder()
                .result(brandService.findAllBrands())
                .build();
    }
}
