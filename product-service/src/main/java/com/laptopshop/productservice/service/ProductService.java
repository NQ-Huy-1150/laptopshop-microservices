package com.laptopshop.productservice.service;

import com.laptopshop.productservice.dto.request.ProductCreationRequest;
import com.laptopshop.productservice.dto.request.ProductInfoRequest;
import com.laptopshop.productservice.dto.request.ProductUpdateRequest;
import com.laptopshop.productservice.dto.response.ApiResponse;
import com.laptopshop.productservice.dto.response.FileResponse;
import com.laptopshop.productservice.dto.response.ProductInfoResponse;
import com.laptopshop.productservice.dto.response.ProductResponse;
import com.laptopshop.productservice.entity.Category;
import com.laptopshop.productservice.entity.Product;
import com.laptopshop.productservice.enums.Status;
import com.laptopshop.productservice.exception.AppException;
import com.laptopshop.productservice.exception.ErrorCode;
import com.laptopshop.productservice.mapper.ProductMapper;
import com.laptopshop.productservice.repository.BrandRepository;
import com.laptopshop.productservice.repository.CategoryRepository;
import com.laptopshop.productservice.repository.ProductRepository;
import com.laptopshop.productservice.repository.httpClient.FileClient;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ProductService {
    ProductRepository productRepository;
    CategoryRepository categoryRepository;
    BrandRepository brandRepository;
    ProductMapper mapper;
    FileClient fileClient;

    @Transactional
    public ProductResponse create(MultipartFile[] files, ProductCreationRequest request) {
        ApiResponse<List<FileResponse>> fileResponses = null;
        try {
            fileResponses = fileClient.uploads(files);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        var imgUrls = fileResponses.getResult().stream().map(FileResponse::getUrl).toList();
        var mainImg = fileResponses.getResult().stream().filter(file -> file.getUrl().contains("main")).findFirst();
        Product product = mapper.toProduct(request);
        // get brand
        var brand = brandRepository.findById(request.getBrand()).orElseThrow(()
                -> new AppException(ErrorCode.BRAND_NOT_FOUND));
        product.setBrandId(brand.getId());
        var categories = categoryRepository.findAllById(request.getCategoryIds())
                .stream().map(Category::getId).collect(Collectors.toSet());
        product.setCategoryIds(categories);
        product.setImages(imgUrls);
        // set main img
        mainImg.ifPresent(fileResponse -> product.setMainImage(fileResponse.getUrl()));
        // set product status for event handling
        product.setStatus(Status.PENDING.name());
        ProductResponse productResponse = mapper.toResponse(productRepository.save(product));
        productResponse.setQuantity(request.getQuantity());
        return productResponse;
    }

    public ProductResponse update(ProductUpdateRequest request) {
        Product product = productRepository.findById(request.getId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        product.setName(request.getName());
        product.setSpecs(request.getSpecs());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setBrandId(request.getBrand());
        var categories = categoryRepository.findAllById(request.getCategoryIds())
                .stream().map(Category::getId).collect(Collectors.toSet());
        product.setCategoryIds(categories);
        return mapper.toResponse(productRepository.save(product));
    }

    public ProductInfoResponse getInfo(ProductInfoRequest request) {
        var data = productRepository.findById(request.getId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        return ProductInfoResponse.builder()
                .id(data.getId())
                .price(data.getPrice())
                .build();
    }

    public void delete(String id) {
        productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        productRepository.deleteById(id);
    }

    public List<ProductResponse> findAll() {
        return productRepository.findAll()
                .stream().map(mapper::toResponse).collect(Collectors.toList());
    }
}
