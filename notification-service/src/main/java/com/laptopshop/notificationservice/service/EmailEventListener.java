package com.laptopshop.notificationservice.service;

import com.laptopshop.event.dto.OrderEvent;
import com.laptopshop.notificationservice.dto.request.OrderInfo;
import com.laptopshop.notificationservice.dto.request.Recipient;
import com.laptopshop.notificationservice.dto.request.SendEmailRequest;
import com.laptopshop.notificationservice.repository.EmailClient;
import feign.FeignException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class EmailEventListener {
    EmailClient emailClient;

    @NonFinal
    @Value("${app.brevo-key}")
    String api_key;

    @KafkaListener(topics = "order-created")
    public void orderNotificationEvent(OrderEvent event) {
        log.info("Order event received: {}", event);
        try {
            NumberFormat vndFormat = NumberFormat.getCurrencyInstance(Locale.forLanguageTag("vi-VN"));
            OrderInfo orderInfo = OrderInfo.builder()
                    .orderId(event.getId())
                    .recipientName(event.getRecipientName())
                    .shippingAddress(event.getShippingAddress())
                    .paymentMethod(event.getPaymentMethod())
                    .totalAmount(vndFormat.format(event.getTotalAmount()))
                    .build();
            List<Recipient> recipients = List.of(Recipient.builder()
                    .name("test")
                    .email(event.getEmail())
                    .build());
            emailClient.sendEmail(api_key, SendEmailRequest.builder()
                    .to(recipients)
                    .params(orderInfo)
                    .templateId(2)
                    .build());
        } catch (FeignException e) {
            throw new RuntimeException(e);
        }
    }
}
