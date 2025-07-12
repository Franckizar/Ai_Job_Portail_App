package com.example.security.user.Invoice;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentStatusResponse {
    private Integer invoiceId;
    private String status;
    private BigDecimal totalAmount;
    private String paymentMethod;
    private String transactionId;
    private LocalDate paymentDate;
    private LocalDate dateIssued;
    private LocalDate dueDate;
}