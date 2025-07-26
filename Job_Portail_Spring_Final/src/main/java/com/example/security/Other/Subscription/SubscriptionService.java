package com.example.security.Other.Subscription;

import com.example.security.UserRepository;
import com.example.security.user.User;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    @Transactional
    public Subscription createSubscription(Integer userId, User.SubscriptionPlanType planType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Cancel existing active subscription
        subscriptionRepository.findByUserIdAndSubscriptionStatus(userId, Subscription.SubscriptionStatus.ACTIVE)
                .ifPresent(existing -> {
                    existing.setSubscriptionStatus(Subscription.SubscriptionStatus.CANCELLED); // Fixed method name
                    subscriptionRepository.save(existing);
                });

        LocalDateTime now = LocalDateTime.now();
        Subscription subscription = Subscription.builder()
                .user(user)
                .planType(planType)
                .startDate(now)
                .endDate(now.plusMonths(1))
                .amount(planType.getMonthlyPrice())
                .subscriptionStatus(Subscription.SubscriptionStatus.PENDING) // Fixed field name
                .build();

        return subscriptionRepository.save(subscription);
    }

    @Transactional
    public void activateSubscription(String transactionId) {
        Subscription subscription = subscriptionRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new IllegalArgumentException("Subscription not found"));

        subscription.setSubscriptionStatus(Subscription.SubscriptionStatus.ACTIVE); // Fixed method name
        subscriptionRepository.save(subscription);

        // Update user subscription flags
        User user = subscription.getUser();
        resetUserSubscriptionFlags(user);
        
        switch (subscription.getPlanType()) {
            case STANDARD -> user.setIsStandardSubscribed(true);
            case PREMIUM -> user.setIsPremiumSubscribed(true);
            default -> user.setIsFreeSubscribed(true);
        }
        
        user.setCurrentPlan(subscription.getPlanType());
        user.setSubscriptionExpiresAt(subscription.getEndDate());
        userRepository.save(user);
    }

    private void resetUserSubscriptionFlags(User user) {
        user.setIsFreeSubscribed(false);
        user.setIsStandardSubscribed(false);
        user.setIsPremiumSubscribed(false);
    }

    @Transactional
    public void expireSubscriptions() {
        List<Subscription> expiredSubscriptions = subscriptionRepository
                .findExpiredSubscriptions(LocalDateTime.now());

        for (Subscription subscription : expiredSubscriptions) {
            subscription.setSubscriptionStatus(Subscription.SubscriptionStatus.EXPIRED); // Fixed method name
            subscriptionRepository.save(subscription);

            // Revert user to FREE plan
            User user = subscription.getUser();
            resetUserSubscriptionFlags(user);
            user.setIsFreeSubscribed(true);
            user.setCurrentPlan(User.SubscriptionPlanType.FREE);
            user.setSubscriptionExpiresAt(null);
            userRepository.save(user);
        }
    }

    public List<Subscription> getUserSubscriptions(Integer userId) {
        return subscriptionRepository.findByUserId(userId);
    }

    public boolean canUserApply(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        User.SubscriptionPlanType currentPlan = user.getCurrentPlan();
        if (currentPlan.getApplicationLimit() == -1) {
            return true; // Unlimited
        }
        return true; // For now, just return true
    }
}
