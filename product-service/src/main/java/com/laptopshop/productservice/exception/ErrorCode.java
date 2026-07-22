package com.laptopshop.productservice.exception;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ErrorCode {
    UNAUTHENTICATED(1002, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    INVALID_KEY(1014, "ErrorCode not existed", HttpStatus.BAD_REQUEST),
    ACCESS_DENIED(1017, "You dont have permission to access this content", HttpStatus.FORBIDDEN),
    JWT_PARSE_ERROR(1018, "Invalid JWT token", HttpStatus.BAD_REQUEST),
    CATEGORY_NOT_FOUND(1019, "Category not found", HttpStatus.NOT_FOUND),
    CATEGORY_ALREADY_EXISTED(1020, "Category already existed", HttpStatus.BAD_REQUEST),
    CATEGORY_NAME_INVALID(1021, "Category name can not be empty", HttpStatus.BAD_REQUEST),
    CATEGORY_DESCRIPTION_INVALID(1022, "Category description can not be empty", HttpStatus.BAD_REQUEST),
    PRODUCT_NOT_FOUND(1023, "Product not found", HttpStatus.NOT_FOUND),
    PRODUCT_NAME_INVALID(1024, "Product name can not be empty", HttpStatus.BAD_REQUEST),
    PRODUCT_BRAND_INVALID(1025, "Product brand can not be empty", HttpStatus.BAD_REQUEST),
    PRODUCT_SPECS_INVALID(1026, "Product specs can not be empty", HttpStatus.BAD_REQUEST),
    PRODUCT_DESCRIPTION_INVALID(1027, "Product description can not be empty", HttpStatus.BAD_REQUEST),
    PRODUCT_PRICE_INVALID(1028, "Product price must greater or equal 0", HttpStatus.BAD_REQUEST),
    PRODUCT_ID_INVALID(1029, "Product id can not be empty", HttpStatus.BAD_REQUEST),
    ;

    int code;
    String message;
    HttpStatus status;

}
