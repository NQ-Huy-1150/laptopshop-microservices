package com.laptopshop.profileservice.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class UserTokenExchangeRequest {
    String grant_type;
    String client_id;
    String client_secret;
    String scope;
    String username;
    String password;
}
