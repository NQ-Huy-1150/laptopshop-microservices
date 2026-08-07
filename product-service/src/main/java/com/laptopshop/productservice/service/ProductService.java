package com.laptopshop.productservice.service;

import com.laptopshop.event.dto.DeleteProductEvent;
import com.laptopshop.productservice.dto.request.ProductCreationRequest;
import com.laptopshop.productservice.dto.request.ProductInfoRequest;
import com.laptopshop.productservice.dto.request.ProductUpdateRequest;
import com.laptopshop.productservice.dto.response.*;
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
import org.apache.commons.lang3.ArrayUtils;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.kafka.KafkaException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
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
    ProductEventProducer productEventProducer;
    ProductMapper mapper;
    FileClient fileClient;
    CacheService cacheService;

    @PreAuthorize("hasRole('ADMIN')")
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
        try {
            productEventProducer.sendEventMessage(productResponse);
        } catch (KafkaException e) {
            throw new AppException(ErrorCode.FAIL_TO_SEND_MESSAGE_TO_KAFKA);
        }
        cacheService.invalidateCache();
        return productResponse;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ProductResponse update(MultipartFile[] files, ProductUpdateRequest request) {
        //verify product
        Product product = productRepository.findById(request.getId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        ApiResponse<List<FileResponse>> fileResponses = null;
        if (ArrayUtils.isNotEmpty(files)) {
            try {
                fileResponses = fileClient.uploads(files);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
            var imgUrls = fileResponses.getResult().stream().map(FileResponse::getUrl).toList();
            var mainImg = fileResponses.getResult().stream().filter(file -> file.getUrl().contains("main")).findFirst();
            // set images
            if (!CollectionUtils.isEmpty(imgUrls)) {
                product.setImages(imgUrls);
            }
            // set main image
            if (mainImg.isPresent()) {
                product.setMainImage(mainImg.get().getUrl());
            }
        }

        product.setName(request.getName());
        product.setSpecs(request.getSpecs());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        // get brand
        var brand = brandRepository.findById(request.getBrand()).orElseThrow(()
                -> new AppException(ErrorCode.BRAND_NOT_FOUND));
        product.setBrandId(brand.getId());
        // get categories
        var categories = categoryRepository.findAllById(request.getCategoryIds())
                .stream().map(Category::getId).collect(Collectors.toSet());
        product.setCategoryIds(categories);
        product = productRepository.save(product);
        cacheService.invalidateCache();
        return mapper.toResponse(product);
    }

    public ProductInfoResponse getInfo(ProductInfoRequest request) {
        var data = productRepository.findById(request.getId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        return ProductInfoResponse.builder()
                .id(data.getId())
                .price(data.getPrice())
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public void delete(String id) {
        var product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        product.setStatus(Status.DELETED.name());
        productRepository.save(product);
        productEventProducer.deleteProductEvent(DeleteProductEvent.builder()
                .id(id)
                .status(true)
                .build());
        cacheService.invalidateCache();
    }

    @Cacheable(value = "products", key = "'all'")
    public List<ProductResponse> findAll() {
        return productRepository.findAll()
                .stream().map(mapper::toResponse).collect(Collectors.toList());
    }

    public PageResponse<ProductResponse> fetchAll(int page, int size, boolean isDesc) {
        Sort sort = isDesc ? Sort.by("price").descending()
                : Sort.by("price").ascending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        var pageData = productRepository.findAll(pageable);
        return PageResponse.<ProductResponse>builder()
                .currentPage(page)
                .pageSize(pageData.getSize())
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(pageData.getContent().stream().map(mapper::toResponse).collect(Collectors.toList()))
                .build();
    }

    public ProductResponse fetchById(String id) {
        var product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        return mapper.toResponse(product);
    }
}
