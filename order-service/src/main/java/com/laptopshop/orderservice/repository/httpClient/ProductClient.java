package com.laptopshop.orderservice.repository.httpClient;

import com.laptopshop.orderservice.configuration.AuthenticationRequestInterceptor;
import com.laptopshop.orderservice.dto.request.ProductInfoRequest;
import com.laptopshop.orderservice.dto.response.ApiResponse;
import com.laptopshop.orderservice.dto.response.ProductInfoResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "product-service", url = "${app.product-service}", configuration = AuthenticationRequestInterceptor.class)
public interface ProductClient {
    @PostMapping(value = "/product/products/info", produces = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<ProductInfoResponse> getProductInfo(@RequestBody ProductInfoRequest productInfoRequest);
}
