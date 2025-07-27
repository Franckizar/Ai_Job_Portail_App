package com.example.security.Other.Subscription;

import com.example.security.UserRepository;
import com.example.security.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserSubscriptionService {

    private final UserRepository userRepository;

    public void setSubscriptionFlags(User user, String planType) {
        User.SubscriptionPlanType plan;

        try {
            plan = User.SubscriptionPlanType.valueOf(planType.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid plan type: " + planType);
        }

        // Reset all flags
        user.setIsFreeSubscribed(false);
        user.setIsStandardSubscribed(false);
        user.setIsPremiumSubscribed(false);

        // Set only the current flag
        switch (plan) {
            case STANDARD -> user.setIsStandardSubscribed(true);
            case PREMIUM -> user.setIsPremiumSubscribed(true);
            default -> user.setIsFreeSubscribed(true);
        }

        user.setCurrentPlan(plan);
        userRepository.save(user);
    }
}
