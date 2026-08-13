package com.laptopshop.transactionservice.service;

import com.laptopshop.event.dto.OrderEvent;
import com.laptopshop.event.dto.TransactionEvent;
import com.laptopshop.transactionservice.dto.response.TransactionMgmtResponse;
import com.laptopshop.transactionservice.entity.TransactionMgmt;
import com.laptopshop.transactionservice.enums.PaymentMethod;
import com.laptopshop.transactionservice.enums.Status;
import com.laptopshop.transactionservice.repository.TransactionMgmtRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.TimeZone;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class TransactionService {
    TransactionMgmtRepository transactionMgmtRepository;
    TransactionEventProducer producer;

    public static String md5(String message) {
        String digest = null;
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] hash = md.digest(message.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(2 * hash.length);
            for (byte b : hash) {
                sb.append(String.format("%02x", b & 0xff));
            }
            digest = sb.toString();
        } catch (NoSuchAlgorithmException ex) {
            digest = "";
        }
        return digest;
    }

    public TransactionMgmtResponse createVNPAYTransaction(OrderEvent event) {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_TmnCode = "LAPTOP_SHOP";
        String vnp_Locale = "vn";
        String vnp_CurrCode = "VND";
        String vnp_BankCode = "VNPAYQR";
        String vnp_OrderType = "130000";
        String vnp_ReturnUrl = "http://localhost:5173/";
        String vnp_OrderInfo = "THANH TOAN HOA DON " + event.getId();
        String vnp_SecureHash = md5(vnp_OrderInfo);
        String vnp_TxnRef = event.getId();
        BigDecimal vnp_Amount = event.getTotalAmount();
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        String vnp_IpAddr;
        // temp
        return null;
    }

    @Transactional
    public void createCODTransaction(OrderEvent event) {
        TransactionMgmt transactionMgmt = TransactionMgmt.builder()
                .totalAmount(event.getTotalAmount())
                .orderId(event.getId())
                .status(Status.WAITING_FOR_COD_PAYMENT.name())
                .paymentMethod(PaymentMethod.COD.name())
                .userId(event.getUserId())
                .build();
        transactionMgmt = transactionMgmtRepository.save(transactionMgmt);
        producer.transactionEventResponse(TransactionEvent.builder()
                .orderId(event.getId())
                .transactionId(transactionMgmt.getId())
                .isSuccess(true)
                .build());
    }
}
