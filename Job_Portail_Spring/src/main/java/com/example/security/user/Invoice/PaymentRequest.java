package com.example.security.user.Invoice;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentRequest {
    private String phoneNumber;
    private String paymentMethod; // "mobile_money", "credit_card"
    private String description;
    
    // For credit card payments (if needed in future)
    private String cardNumber;
    private String cardHolderName;
    private String expiryDate;
    private String cvv;
}