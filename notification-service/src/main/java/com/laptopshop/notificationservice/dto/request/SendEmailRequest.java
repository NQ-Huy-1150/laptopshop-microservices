package com.laptopshop.notificationservice.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SendEmailRequest {
    Sender sender;
    List<Recipient> to;
    long templateId;
    OrderInfo params;
}
