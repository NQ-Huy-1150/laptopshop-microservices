package com.laptopshop.fileservice.exception;

import com.laptopshop.fileservice.dto.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.nio.file.AccessDeniedException;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    @ExceptionHandler(value = RuntimeException.class)
    ResponseEntity<?> runtimeExceptionHandler(RuntimeException e) {
        return ResponseEntity.badRequest().body("UNCATALOGUED ERROR : " + e.getMessage());
    }

    @ExceptionHandler(value = AppException.class)
    ResponseEntity<?> appExceptionHandle(AppException e) {
        ApiResponse<String> response = new ApiResponse<>();
        ErrorCode errorCode = e.getErrorCode();
        response.setCode(errorCode.getCode());
        response.setMessage(errorCode.getMessage());
        return ResponseEntity.status(errorCode.getStatus())
                .body(response);
    }

    @ExceptionHandler(value = AccessDeniedException.class)
    ResponseEntity<?> accessDeniedExceptionHandler(AccessDeniedException e) {
        ApiResponse<String> response = new ApiResponse<>();
        ErrorCode errorCode = ErrorCode.ACCESS_DENIED;
        response.setCode(errorCode.getCode());
        response.setMessage(errorCode.getMessage());
        return ResponseEntity.status(errorCode.getStatus())
                .body(response);
    }

}
