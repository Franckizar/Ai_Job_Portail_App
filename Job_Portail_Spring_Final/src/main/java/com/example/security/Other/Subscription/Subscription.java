// 1. FIXED Subscription.java - Remove conflicting setStatus method
package com.example.security.Other.Subscription;

import com.example.security.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "subscriptions")
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private User.SubscriptionPlanType planType;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "subscription_status") // Renamed column to avoid conflicts
    @Builder.Default
    private SubscriptionStatus subscriptionStatus = SubscriptionStatus.PENDING; // Renamed field

    private Double amount;
    private String transactionId;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum SubscriptionStatus {
        ACTIVE, EXPIRED, CANCELLED, PENDING
    }

    // Custom getter and setter to avoid confusion
    public SubscriptionStatus getSubscriptionStatus() {
        return subscriptionStatus;
    }

    public void setSubscriptionStatus(SubscriptionStatus subscriptionStatus) {
        this.subscriptionStatus = subscriptionStatus;
    }

    public Integer getUserId() {
    return user != null ? user.getId() : null;
}
}