package com.example.security.Other.Subscription;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.security.user.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Integer> {
    
    List<Subscription> findByUserId(Integer userId);
    
    // Fixed method name to match new field
    Optional<Subscription> findByUserIdAndSubscriptionStatus(Integer userId, Subscription.SubscriptionStatus subscriptionStatus);
//    List<Subscription> findByUser(User user);

    // Optional<Subscription> findByUserAndSubscriptionStatus(User user, Subscription.SubscriptionStatus subscriptionStatus);

    
    // Fixed query to use new field name
    @Query("SELECT s FROM Subscription s WHERE s.endDate < :now AND s.subscriptionStatus = 'ACTIVE'")
    List<Subscription> findExpiredSubscriptions(LocalDateTime now);
    
    Optional<Subscription> findByTransactionId(String transactionId);
}
