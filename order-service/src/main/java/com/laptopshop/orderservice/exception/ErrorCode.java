package com.laptopshop.orderservice.exception;

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
    CART_DETAIL_NOT_FOUND(1024, "Cart detail not found", HttpStatus.NOT_FOUND),
    CANT_GET_PRODUCT_INFO(1025, "cannot get product info", HttpStatus.BAD_REQUEST),
    CURRENT_CART_NOT_FOUND(1026, "Current cart not found", HttpStatus.NOT_FOUND),
    ORDER_NOT_FOUND(1027, "Order not found", HttpStatus.NOT_FOUND),
    ;

    int code;
    String message;
    HttpStatus status;

}
