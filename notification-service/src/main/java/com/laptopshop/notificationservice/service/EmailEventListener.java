package com.laptopshop.notificationservice.service;

import com.laptopshop.event.dto.OrderEvent;
import com.laptopshop.notificationservice.dto.request.OrderInfo;
import com.laptopshop.notificationservice.dto.request.Recipient;
import com.laptopshop.notificationservice.dto.request.SendEmailRequest;
import com.laptopshop.notificationservice.entity.ProcessedOrder;
import com.laptopshop.notificationservice.repository.ProcessedOrderRepository;
import com.laptopshop.notificationservice.repository.httpClient.EmailClient;
import feign.FeignException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class EmailEventListener {
    EmailClient emailClient;
    ProcessedOrderRepository processedOrderRepository;

    @NonFinal
    @Value("${app.brevo-key}")
    String api_key;

    @Transactional
    @KafkaListener(topics = "order-created")
    public void orderNotificationEvent(OrderEvent event) {
        log.info("Order event received: {}", event);
        if (processedOrderRepository.existsById(event.getId())) {
            return;
        }
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
            processedOrderRepository.save(ProcessedOrder.builder()
                    .orderId(event.getId())
                    .handleAt(LocalDateTime.now())
                    .build());
        } catch (FeignException e) {
            throw new RuntimeException(e);
        }
    }
}
