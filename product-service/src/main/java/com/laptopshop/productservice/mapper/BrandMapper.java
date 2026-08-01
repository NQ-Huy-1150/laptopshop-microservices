package com.laptopshop.productservice.mapper;

import com.laptopshop.productservice.dto.request.BrandCreationRequest;
import com.laptopshop.productservice.dto.response.BrandResponse;
import com.laptopshop.productservice.entity.Brand;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BrandMapper {
    Brand toBrand(BrandCreationRequest brandCreationRequest);

    BrandResponse toBrandResponse(Brand brand);
}
