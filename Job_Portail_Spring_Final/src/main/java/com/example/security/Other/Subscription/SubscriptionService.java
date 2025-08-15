package com.example.security.Other.Subscription;

import com.example.security.user.User;
import com.example.security.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    /**
     * Creates a new subscription and immediately updates user table with the intended plan.
     * This ensures the plan is stored in both Subscription and User tables from the start.
     */
    @Transactional
    public Subscription createSubscription(Integer userId, User.SubscriptionPlanType planType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        // Cancel any existing active subscription for this user
        Optional<Subscription> existingSubscription = subscriptionRepository
                .findByUserAndSubscriptionStatus(user, Subscription.SubscriptionStatus.ACTIVE);
        
        if (existingSubscription.isPresent()) {
            Subscription existing = existingSubscription.get();
            existing.setSubscriptionStatus(Subscription.SubscriptionStatus.CANCELLED);
            subscriptionRepository.save(existing);
            log.info("Cancelled existing subscription {} for user {}", existing.getId(), userId);
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime endDate = now.plusMonths(1);
        
        // Create the subscription with PENDING status
        Subscription subscription = Subscription.builder()
                .user(user)
                .planType(planType) // Store plan in subscription for callback retrieval
                .startDate(now)
                .endDate(endDate)
                .amount(planType.getMonthlyPrice())
                .subscriptionStatus(Subscription.SubscriptionStatus.PENDING)
                .createdAt(now)
                .build();

        Subscription savedSubscription = subscriptionRepository.save(subscription);

        // IMMEDIATELY update the user table with the intended plan
        // This way, even during the pending payment period, the user has the plan info
        updateUserSubscriptionInfo(user, planType, endDate);
        
        log.info("Created pending subscription {} for user {} with plan {} - User table updated immediately", 
                savedSubscription.getId(), userId, planType);
        
        return savedSubscription;
    }

    /**
     * Activates a subscription based on successful payment callback.
     * The transactionId is stored in the subscription entity.
     */
public void activateSubscription(Subscription subscription) {
        User user = subscription.getUser();
        User.SubscriptionPlanType plan = subscription.getPlanType();

        // Reset all flags
        user.setIsFreeSubscribed(false);
        user.setIsStandardSubscribed(false);
        user.setIsPremiumSubscribed(false);

        // Activate appropriate plan
        switch (plan) {
            case PREMIUM -> user.setIsPremiumSubscribed(true);
            case STANDARD -> user.setIsStandardSubscribed(true);
            case FREE -> user.setIsFreeSubscribed(true);
        }

        // Set current plan and expiration
        user.setCurrentPlan(plan);
        user.setSubscriptionExpiresAt(subscription.getEndDate());

        // Save user
        userRepository.save(user);
    }

    public Optional<Subscription> getByExternalReference(String externalReference) {
        return subscriptionRepository.findByExternalReference(externalReference);
    }


    /**
     * Centralized method to update user table with subscription information.
     * Now calls specific plan update methods for cleaner logic.
     */
    private void updateUserSubscriptionInfo(User user, User.SubscriptionPlanType planType, LocalDateTime expiresAt) {
        Integer userId = user.getId();
        
        switch (planType) {
            case STANDARD -> {
                updateUserToStandard(userId);
                log.debug("Set STANDARD subscription flag for user {}", userId);
            }
            case PREMIUM -> {
                updateUserToPremium(userId);
                log.debug("Set PREMIUM subscription flag for user {}", userId);
            }
            case FREE -> {
                updateUserToFree(userId);
                log.debug("Set FREE subscription flag for user {}", userId);
            }
            default -> {
                updateUserToFree(userId);
                log.warn("Unknown plan type {}, defaulting to FREE for user {}", planType, userId);
            }
        }

        log.info("Updated user {} subscription info: plan={}, expires={}", userId, planType, expiresAt);
    }

    /**
     * Checks if user can apply for jobs based on their current subscription plan.
     * Reads directly from User table for quick access.
     */
    public boolean canUserApply(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        // Get current plan directly from user table (fast access)
        User.SubscriptionPlanType currentPlan = user.getCurrentPlan();
        if (currentPlan == null) {
            currentPlan = User.SubscriptionPlanType.FREE;
            updateUserToFree(userId); // Use specific method
        }

        // If unlimited applications (-1), always allow
        if (currentPlan.getApplicationLimit() == -1) {
            return true;
        }

        // TODO: Implement actual application counting logic
        // Count user's applications in current billing period vs limit
        
        log.debug("Application limit check for user {}: plan={}, limit={}", 
                userId, currentPlan, currentPlan.getApplicationLimit());
        
        return true; // Placeholder - implement actual counting logic
    }

    /**
     * Expires subscriptions that have passed their end date.
     * Updates both Subscription and User tables.
     */
    @Transactional
    public void expireSubscriptions() {
        log.info("Starting subscription expiration check");
        
        List<Subscription> expiredSubscriptions = subscriptionRepository
                .findExpiredSubscriptions(LocalDateTime.now());

        if (expiredSubscriptions.isEmpty()) {
            log.info("No expired subscriptions found");
            return;
        }

        for (Subscription subscription : expiredSubscriptions) {
            try {
                // Update subscription status
                subscription.setSubscriptionStatus(Subscription.SubscriptionStatus.EXPIRED);
                subscriptionRepository.save(subscription);

                // Update user back to FREE plan
                Integer userId = subscription.getUserId();
                if (userId != null) {
                    User user = userRepository.findById(userId).orElse(null);
                    if (user != null) {
                        updateUserSubscriptionInfo(user, User.SubscriptionPlanType.FREE, null);
                        log.info("Expired subscription {} for user {}, reset to FREE plan", 
                                subscription.getId(), userId);
                    }
                }
            } catch (Exception e) {
                log.error("Error expiring subscription {}: {}", subscription.getId(), e.getMessage(), e);
            }
        }
        
        log.info("Processed {} expired subscriptions", expiredSubscriptions.size());
    }

    /**
     * Retrieves all subscriptions for a user.
     */
    public List<Subscription> getUserSubscriptions(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return subscriptionRepository.findByUser(user);
    }

    /**
     * Gets the current active subscription for a user.
     */
    public Optional<Subscription> getCurrentActiveSubscription(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return subscriptionRepository.findByUserAndSubscriptionStatus(user, Subscription.SubscriptionStatus.ACTIVE);
    }

    /**
     * Creates a STANDARD subscription for a user.
     */
    @Transactional
    public Subscription createStandardSubscription(Integer userId) {
        return createSubscription(userId, User.SubscriptionPlanType.STANDARD);
    }

    /**
     * Creates a PREMIUM subscription for a user.
     */
    @Transactional
    public Subscription createPremiumSubscription(Integer userId) {
        return createSubscription(userId, User.SubscriptionPlanType.PREMIUM);
    }

    /**
     * Creates a FREE subscription for a user (for downgrades).
     */
    @Transactional
    public Subscription createFreeSubscription(Integer userId) {
        return createSubscription(userId, User.SubscriptionPlanType.FREE);
    }

    /**
     * Updates user to STANDARD subscription - sets only standard flag to true.
     */
    @Transactional
    public void updateUserToStandard(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        // Set only STANDARD to true, others to false
        user.setIsFreeSubscribed(false);
        user.setIsStandardSubscribed(true);
        user.setIsPremiumSubscribed(false);
        user.setCurrentPlan(User.SubscriptionPlanType.STANDARD);
        user.setSubscriptionExpiresAt(LocalDateTime.now().plusMonths(1));

        userRepository.save(user);
        log.info("Updated user {} to STANDARD subscription", userId);
    }

    /**
     * Updates user to PREMIUM subscription - sets only premium flag to true.
     */
    @Transactional
    public void updateUserToPremium(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        // Set only PREMIUM to true, others to false
        user.setIsFreeSubscribed(false);
        user.setIsStandardSubscribed(false);
        user.setIsPremiumSubscribed(true);
        user.setCurrentPlan(User.SubscriptionPlanType.PREMIUM);
        user.setSubscriptionExpiresAt(LocalDateTime.now().plusMonths(1));

        userRepository.save(user);
        log.info("Updated user {} to PREMIUM subscription", userId);
    }

    /**
     * Updates user to FREE subscription - sets only free flag to true.
     */
    @Transactional
    public void updateUserToFree(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        // Set only FREE to true, others to false
        user.setIsFreeSubscribed(true);
        user.setIsStandardSubscribed(false);
        user.setIsPremiumSubscribed(false);
        user.setCurrentPlan(User.SubscriptionPlanType.FREE);
        user.setSubscriptionExpiresAt(null); // Free doesn't expire

        userRepository.save(user);
        log.info("Updated user {} to FREE subscription", userId);
    }

     public double getTotalPaymentsAmount() {
        Double total = subscriptionRepository.getTotalPaymentsAmount();
        return total != null ? total : 0.0;
    }
}
