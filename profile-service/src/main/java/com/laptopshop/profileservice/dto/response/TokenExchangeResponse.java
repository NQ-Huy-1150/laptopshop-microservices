package com.laptopshop.profileservice.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class TokenExchangeResponse {
    String access_token;
    long expires_in;
    long refresh_expires_in;
    String token_type;
    String id_token;
    String scope;
}
