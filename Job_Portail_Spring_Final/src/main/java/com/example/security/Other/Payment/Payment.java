// Payment.java
package com.example.security.Other.Payment;

import com.example.security.Other.Subscription.Subscription;
import com.example.security.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String transactionId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    // @JsonIgnore
    private User user;

    private Double amount;

    @Enumerated(EnumType.STRING)

    private PaymentStatus status;

      public void setStatus(PaymentStatus status) {
        this.status = status;
    }
    
    // Add explicit getter method
    public PaymentStatus getStatus() {
        return status;
    }

    private LocalDateTime createdAt;

    public enum PaymentStatus {
        PENDING,
        COMPLETED,
        FAILED
    }
    @ManyToOne
@JoinColumn(name = "subscription_id")
private Subscription subscription;

@Enumerated(EnumType.STRING)
private PaymentType paymentType;

public enum PaymentType {
    SUBSCRIPTION, INVOICE, OTHER
}
}
