package com.laptopshop.identityservice.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(exception = RuntimeException.class)
    ResponseEntity<?> runtimeExceptionHandler(RuntimeException e) {
        return ResponseEntity.badRequest().body("UNCATALOGUED ERROR : " + e.getMessage());
    }

    @ExceptionHandler(exception = AppException.class)
    ResponseEntity<?> appExceptionHandle(AppException e) {
        ErrorCode errorCode = e.getErrorCode();
        return ResponseEntity.status(errorCode.getStatus())
                .body(errorCode.getMessage());
    }
}
