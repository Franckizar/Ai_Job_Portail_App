package com.example.security.Other.Payment;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    // Remove this if not used anymore
    // Optional<Payment> findByTransactionId(String reference);

    Optional<Payment> findBySubscriptionIdAndUserId(Integer subscriptionId, Integer userId);
    
    Optional<Payment> findByTransactionId(String transactionId);
}
