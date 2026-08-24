package com.laptopshop.profileservice.exception;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ErrorCode {
    USER_NOT_FOUND(1000, "User not found", HttpStatus.NOT_FOUND),
    INFO_NOT_MATCH(1001, "Username or password not correct", HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED(1002, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    ROLE_NOT_FOUND(1003, "Role not found", HttpStatus.NOT_FOUND),
    PERMISSION_NOT_FOUND(1004, "Permission not found", HttpStatus.NOT_FOUND),
    FIRST_NAME_NOT_VALID(1005, "FirstName must not empty ", HttpStatus.BAD_REQUEST),
    LAST_NAME_NOT_VALID(1006, "LastName must not empty ", HttpStatus.BAD_REQUEST),
    EMAIL_ALREADY_EXISTED(1007, "Email already existed ", HttpStatus.BAD_REQUEST),
    EMAIL_NOT_VALID(1008, "Email address not valid, it must contain @ and a . ", HttpStatus.BAD_REQUEST),
    ADDRESS_NOT_VALID(1010, "Address must not empty ", HttpStatus.BAD_REQUEST),
    PASSWORD_NOT_VALID(1011, "Password must at least {min} characters ", HttpStatus.BAD_REQUEST),
    USERNAME_NOT_VALID(1012, "Username must at least {min} characters", HttpStatus.BAD_REQUEST),
    USER_ID_NOT_VALID(1013, "User id must not empty", HttpStatus.BAD_REQUEST),
    INVALID_KEY(1014, "ErrorCode not existed", HttpStatus.BAD_REQUEST),
    PHONE_NUMBER_NOT_VALID(1015, "PhoneNumber must be {min} characters", HttpStatus.BAD_REQUEST),
    INVALID_DOB(1016, "Invalid date of birth", HttpStatus.BAD_REQUEST),
    ACCESS_DENIED(1017, "You dont have permission to access this content", HttpStatus.FORBIDDEN),
    JWT_PARSE_ERROR(1018, "Invalid JWT token", HttpStatus.BAD_REQUEST),
    FAIL_TO_REFRESH_TOKEN(1019, "Fail to refresh token", HttpStatus.BAD_REQUEST),
    FAIL_TO_RETRIEVE_CLIENT_TOKEN(1020, "Fail to get client access token", HttpStatus.BAD_REQUEST),
    FAIL_TO_CREATE_USER(1021, "Fail to create user", HttpStatus.BAD_REQUEST),
    FAIL_TO_RETRIEVE_USER_TOKEN(1022, "Fail to get user token", HttpStatus.BAD_REQUEST),
    FAIL_TO_EXTRACT_USER_ID_FROM_KEYCLOAK_RESPONSE(1023, "Fail to extract user id from keycloak", HttpStatus.BAD_REQUEST),
    FAIL_TO_RETRIEVE_USER_CREDENTIAL(1023, "Fail to get user credential from request", HttpStatus.BAD_REQUEST),
    FAIL_TO_SEND_REQUEST_TO_KEYCLOAK(1024, "Fail to send request to keycloak", HttpStatus.BAD_REQUEST),
    USERNAME_ALREADY_EXISTED(1024, "Username already existed ", HttpStatus.BAD_REQUEST),
    ;

    int code;
    String message;
    HttpStatus status;

}
