package com.example.security.user.Invoice;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentUpdateRequest {
    private String transactionId;
    private LocalDate paymentDate;
    private String paymentMethod;
    private String status;
}