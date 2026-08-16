package com.laptopshop.notificationservice.exception;

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
    UPDATE_TYPE_INVALID(1025, "Update type must not empty", HttpStatus.BAD_REQUEST),
    DESCRIPTION_INVALID(1026, "Description must not empty", HttpStatus.BAD_REQUEST),
    UPDATE_TYPE_NOT_FOUND(1027, "Update type not found", HttpStatus.NOT_FOUND),
    FAIL_TO_SEND_OUT_OF_STOCK_MESSAGE(1028, "Fail to send out of stock message to kafka", HttpStatus.INTERNAL_SERVER_ERROR),
    FAIL_TO_SEND_RESTOCK_MESSAGE(1029, "Fail to send restock message to kafka", HttpStatus.INTERNAL_SERVER_ERROR),
    FAIL_TO_REVERT_STOCK(1030, "Fail to revert stock", HttpStatus.INTERNAL_SERVER_ERROR),
    ;

    int code;
    String message;
    HttpStatus status;

}
