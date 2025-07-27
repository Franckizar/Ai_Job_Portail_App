package com.example.security.Other.Subscription;

import com.example.security.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Integer> {

    // Find all subscriptions for a user
    List<Subscription> findByUser(User user);

    // Find a user's subscription by status (e.g. ACTIVE)
    Optional<Subscription> findByUserAndSubscriptionStatus(User user, Subscription.SubscriptionStatus subscriptionStatus);

    // Find expired subscriptions (where endDate is before now and status is ACTIVE)
    @Query("SELECT s FROM Subscription s WHERE s.endDate < :now AND s.subscriptionStatus = 'ACTIVE'")
    List<Subscription> findExpiredSubscriptions(LocalDateTime now);

    // Find subscription by transactionId
    Optional<Subscription> findByTransactionId(String transactionId);

   List<Subscription> findByUserOrderByCreatedAtDesc(User user);

   Optional<Subscription> findByExternalReference(String externalReference);
    
    // @Query("SELECT s FROM Subscription s WHERE s.endDate < :now AND s.su/bscriptionStatus = 'ACTIVE'")
    // List<Subscription> findExpiredSubscriptions(LocalDateTime now);
}
