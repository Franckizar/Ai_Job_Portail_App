// 10. Subscription.java
package com.example.security.Other.Subscription;

import com.example.security.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "subscriptions")
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "subscription_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "service_type")
    private ServiceType serviceType;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private SubscriptionStatus status = SubscriptionStatus.ACTIVE;

    @Column(name = "priority_level")
    private Integer priorityLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    public enum ServiceType {
        ELECTRICITY("electricity"),
        PRIORITY("priority"),
        FEATURED("featured");

        private final String value;

        ServiceType(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }

    public enum SubscriptionStatus {
        ACTIVE("active"),
        EXPIRED("expired"),
        CANCELLED("cancelled");

        private final String value;

        SubscriptionStatus(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }

    public enum PaymentStatus {
        PAID("paid"),
        PENDING("pending"),
        FAILED("failed");

        private final String value;

        PaymentStatus(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}
