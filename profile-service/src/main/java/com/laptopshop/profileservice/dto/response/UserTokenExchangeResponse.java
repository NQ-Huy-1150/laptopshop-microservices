package com.laptopshop.profileservice.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class UserTokenExchangeResponse {
    String access_token;
    long expires_in;
    long refresh_expires_in;
    String refresh_token;
    String token_type;
    String id_token;
    String scope;
}
