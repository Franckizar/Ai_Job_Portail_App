package com.example.security.Other.Subscription;

import com.example.security.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/auth/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final SubscriptionRepository subscriptionRepository;

    @PostMapping("/create")
    public ResponseEntity<Subscription> createSubscription(
            @RequestParam Integer userId,
            @RequestParam User.SubscriptionPlanType planType) {
        
        Subscription subscription = subscriptionService.createSubscription(userId, planType);
        return ResponseEntity.ok(subscription);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Subscription>> getUserSubscriptions(@PathVariable Integer userId) {
        List<Subscription> subscriptions = subscriptionService.getUserSubscriptions(userId);
        return ResponseEntity.ok(subscriptions);
    }

    @GetMapping("/plans")
    public ResponseEntity<User.SubscriptionPlanType[]> getAvailablePlans() {
        return ResponseEntity.ok(User.SubscriptionPlanType.values());
    }

//  @PostMapping("/activate/{transactionId}")
// public ResponseEntity<String> activateSubscription(@PathVariable String transactionId) {
//     Subscription subscription = subscriptionRepository.findByTransactionId(transactionId);
//     if (subscription == null) {
//         return ResponseEntity.badRequest().body("Subscription not found");
//     }

//     subscriptionService.activateSubscription(subscription);
//     return ResponseEntity.ok("Subscription activated successfully");
// }


    @PostMapping("/expire-check")
    public ResponseEntity<String> checkExpiredSubscriptions() {
        subscriptionService.expireSubscriptions();
        return ResponseEntity.ok("Expired subscriptions processed");
    }

    @GetMapping("/can-apply/{userId}")
    public ResponseEntity<Boolean> canUserApply(@PathVariable Integer userId) {
        boolean canApply = subscriptionService.canUserApply(userId);
        return ResponseEntity.ok(canApply);
    }

     @GetMapping("/total-amount")
    public ResponseEntity<Double> getTotalPaymentsAmount() {
        return ResponseEntity.ok(subscriptionService.getTotalPaymentsAmount());
    }
}
