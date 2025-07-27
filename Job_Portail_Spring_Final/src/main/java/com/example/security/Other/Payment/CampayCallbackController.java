package com.example.security.Other.Payment;

import com.example.security.Other.Subscription.Subscription;
import com.example.security.Other.Subscription.SubscriptionRepository;
import com.example.security.Other.Subscription.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth/campay")
@RequiredArgsConstructor
public class CampayCallbackController {

    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionService subscriptionService;

    @GetMapping("/callback")
    public ResponseEntity<String> handleGetCallback(@RequestParam Map<String, String> params) {
        System.out.println("✅ Campay Callback Received via GET:");
        params.forEach((key, value) -> System.out.println(key + " : " + value));

        String status = params.get("status"); // Example: SUCCESSFUL or FAILED
        String externalReference = params.get("external_reference"); // Example: SUB-6
        String transactionId = params.get("reference"); // Campay transaction ID

        if (externalReference == null || !externalReference.startsWith("SUB-")) {
            return ResponseEntity.badRequest().body("❌ Invalid external reference");
        }

        Integer subscriptionId;
        try {
            subscriptionId = Integer.parseInt(externalReference.replace("SUB-", ""));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("❌ Invalid subscription ID format");
        }

        Subscription subscription = subscriptionRepository.findById(subscriptionId).orElse(null);
        if (subscription == null) {
            return ResponseEntity.badRequest().body("❌ Subscription not found");
        }

        subscription.setTransactionId(transactionId);

        if ("SUCCESSFUL".equalsIgnoreCase(status)) {
            subscription.setSubscriptionStatus(Subscription.SubscriptionStatus.ACTIVE);
            subscriptionRepository.save(subscription);
            subscriptionService.activateSubscription(subscription);
            return ResponseEntity.ok("✅ Subscription activated");
        } else {
            subscription.setSubscriptionStatus(Subscription.SubscriptionStatus.CANCELLED);
            subscriptionRepository.save(subscription);
            return ResponseEntity.ok("⚠️ Subscription cancelled");
        }
    }
}
