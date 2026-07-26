package com.laptopshop.inventoryservice.exception;

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
    PRODUCT_ID_INVALID(1019, "Product id must not empty", HttpStatus.BAD_REQUEST),
    PRODUCT_ID_NPE(1020, "Product id must not be null", HttpStatus.BAD_REQUEST),
    QUANTITY_INVALID(1021, "Quantity must be at least {min}", HttpStatus.BAD_REQUEST),
    NEGATIVE_STOCK(1022, "Stock not enough for this issue request", HttpStatus.BAD_REQUEST),
    STOCK_ISSUE_FAILURE(1023, "Get error while handle this request", HttpStatus.INTERNAL_SERVER_ERROR),
    PRODUCT_NOT_FOUND(1024, "Product not found", HttpStatus.NOT_FOUND),
    ;

    int code;
    String message;
    HttpStatus status;

}
