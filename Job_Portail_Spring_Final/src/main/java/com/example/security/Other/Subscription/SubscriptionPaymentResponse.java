package com.example.security.Other.Subscription;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionPaymentResponse {
    private boolean success;
    private Integer subscriptionId; // Changed from Long to Integer
    private String transactionId;
    private Double amount;
    private String message;
  
}
