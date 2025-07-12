package com.example.security.user.Invoice;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {
    private boolean success;
    private String message;
    private String transactionId;
    private String invoiceStatus;
    private String paymentMethod;
    private Double amount;
}