package com.laptopshop.productservice.service;

import com.laptopshop.productservice.dto.request.BrandCreationRequest;
import com.laptopshop.productservice.dto.response.BrandResponse;
import com.laptopshop.productservice.entity.Brand;
import com.laptopshop.productservice.exception.AppException;
import com.laptopshop.productservice.exception.ErrorCode;
import com.laptopshop.productservice.mapper.BrandMapper;
import com.laptopshop.productservice.repository.BrandRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class BrandService {
    BrandRepository brandRepository;
    BrandMapper brandMapper;

    @Transactional
    public BrandResponse createBrand(BrandCreationRequest request) {
        Brand brand = brandMapper.toBrand(request);
        return brandMapper.toBrandResponse(brandRepository.save(brand));
    }

    @Transactional
    public void deleteBrand(String id) {
        if (brandRepository.existsById(id)) {
            brandRepository.deleteById(id);
        } else throw new AppException(ErrorCode.BRAND_NOT_FOUND);
    }

    public List<BrandResponse> findAllBrands() {
        return brandRepository.findAll().stream().map(brandMapper::toBrandResponse).toList();
    }
}
