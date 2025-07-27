// package com.example.security.Other.Subscription;

// import lombok.RequiredArgsConstructor;
// import org.springframework.http.ResponseEntity;
// import org.springframework.transaction.annotation.Transactional;
// import org.springframework.web.bind.annotation.*;

// import com.example.security.UserRepository;
// import com.example.security.user.User;

// @RestController
// @RequestMapping("/api/v1/auth/users")
// @RequiredArgsConstructor
// public class UserSubscriptionController {

//     private final UserRepository userRepository;

//     @PostMapping("/{userId}/update-subscription")
//     @Transactional
//     public ResponseEntity<String> updateSubscriptionFlags(
//             @PathVariable Integer userId,
//             @RequestParam String planType) {

//         User.SubscriptionPlanType plan;

//         try {
//             plan = User.SubscriptionPlanType.valueOf(planType.toUpperCase());
//         } catch (IllegalArgumentException e) {
//             return ResponseEntity.badRequest().body("Invalid plan type");
//         }

//         User user = userRepository.findById(userId)
//             .orElseThrow(() -> new IllegalArgumentException("User not found"));

//         // Reset all flags
//         user.setIsFreeSubscribed(false);
//         user.setIsStandardSubscribed(false);
//         user.setIsPremiumSubscribed(false);

//         // Set only the current plan flag
//         switch (plan) {
//             case STANDARD -> user.setIsStandardSubscribed(true);
//             case PREMIUM -> user.setIsPremiumSubscribed(true);
//             default -> user.setIsFreeSubscribed(true);
//         }

//         user.setCurrentPlan(plan);

//         userRepository.save(user);

//         return ResponseEntity.ok("User subscription flags updated successfully");
//     }
// }
