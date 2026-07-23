package com.laptopshop.productservice.service;

import com.laptopshop.productservice.dto.request.ProductCreationRequest;
import com.laptopshop.productservice.dto.request.ProductUpdateRequest;
import com.laptopshop.productservice.dto.response.FileResponse;
import com.laptopshop.productservice.dto.response.ProductResponse;
import com.laptopshop.productservice.entity.Category;
import com.laptopshop.productservice.entity.Product;
import com.laptopshop.productservice.exception.AppException;
import com.laptopshop.productservice.exception.ErrorCode;
import com.laptopshop.productservice.mapper.ProductMapper;
import com.laptopshop.productservice.repository.CategoryRepository;
import com.laptopshop.productservice.repository.ProductRepository;
import com.laptopshop.productservice.repository.httpClient.FileClient;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
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
    ProductMapper mapper;
    FileClient fileClient;

    public ProductResponse create(MultipartFile[] files, ProductCreationRequest request) {
        var fileResponses = fileClient.uploads(files);
        var imgUrls = fileResponses.getResult().stream().map(FileResponse::getUrl).toList();
        log.info("Image urls : {}", imgUrls);
        Product product = mapper.toProduct(request);
        var categories = categoryRepository.findAllById(request.getCategoryIds())
                .stream().map(Category::getId).collect(Collectors.toSet());
        product.setCategoryIds(categories);
        product.setImgUrls(imgUrls);
        return mapper.toResponse(productRepository.save(product));
    }

    public ProductResponse update(ProductUpdateRequest request) {
        Product product = productRepository.findById(request.getId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        product.setName(request.getName());
        product.setSpecs(request.getSpecs());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setBrand(request.getBrand());
        var categories = categoryRepository.findAllById(request.getCategoryIds())
                .stream().map(Category::getId).collect(Collectors.toSet());
        product.setCategoryIds(categories);
        product.setCategoryIds(categories);
        return mapper.toResponse(productRepository.save(product));
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
