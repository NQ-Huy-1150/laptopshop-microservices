package com.laptopshop.orderservice.exception;

import com.laptopshop.orderservice.dto.response.ApiResponse;
import jakarta.validation.ConstraintViolation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.nio.file.AccessDeniedException;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    private static final String MIN_ATTRIBUTE = "min";
    private static final String VALUE_ATTRIBUTE = "value";

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

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<?> MethodArgumentNotValidExceptionHandler(MethodArgumentNotValidException e) {
        Map<String, String> errors = new HashMap<>();
        e.getBindingResult().getAllErrors().forEach(
                error -> {
                    String fieldName = ((FieldError) error).getField();
                    String enumKey = error.getDefaultMessage();
                    ErrorCode errorCode = ErrorCode.INVALID_KEY;
                    var constraintViolation = error.unwrap(ConstraintViolation.class);
                    var attributes = constraintViolation.getConstraintDescriptor().getAttributes();
                    log.info("attributes : {}", attributes);
                    try {
                        errorCode = ErrorCode.valueOf(enumKey);

                    } catch (IllegalArgumentException ex) {

                    }
                    errors.put(fieldName, bindingAttributes(errorCode.getMessage(), attributes));
                }
        );
        return ResponseEntity.badRequest().body(
                ApiResponse.<Map<String, String>>builder()
                        .message("Validation failure")
                        .result(errors)
                        .build()
        );
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


    private String bindingAttributes(String message, Map<String, Object> attributes) {
        String minValue = "";
        if (attributes.containsKey(MIN_ATTRIBUTE)) {
            minValue = String.valueOf(attributes.get(MIN_ATTRIBUTE));
        } else if (attributes.containsKey(VALUE_ATTRIBUTE)) {
            minValue = String.valueOf(attributes.get(VALUE_ATTRIBUTE));
        }
        return message.replace("{" + MIN_ATTRIBUTE + "}", minValue);

    }
}
