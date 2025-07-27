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

    @PostMapping("/callback")
    public ResponseEntity<String> handleCallback(@RequestParam Map<String, String> params) {
        // 🖨️ Log all callback parameters
        System.out.println("🔔 Campay Callback Received:");
        for (Map.Entry<String, String> entry : params.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }

        String status = params.get("status");
        String externalReference = params.get("external_reference"); // e.g. SUB-6
        String transactionId = params.get("reference"); // Campay transaction ID

        if (externalReference == null || !externalReference.startsWith("SUB-")) {
            System.out.println("❌ Invalid external reference");
            return ResponseEntity.badRequest().body("Invalid external reference");
        }

        Integer subscriptionId;
        try {
            subscriptionId = Integer.parseInt(externalReference.replace("SUB-", ""));
        } catch (NumberFormatException e) {
            System.out.println("❌ Failed to parse subscription ID");
            return ResponseEntity.badRequest().body("Invalid subscription ID format");
        }

        Subscription subscription = subscriptionRepository.findById(subscriptionId).orElse(null);

        if (subscription == null) {
            System.out.println("❌ Subscription not found for ID: " + subscriptionId);
            return ResponseEntity.badRequest().body("Subscription not found");
        }

        // Store the transaction ID
        subscription.setTransactionId(transactionId);

        if ("SUCCESSFUL".equalsIgnoreCase(status)) {
            // Activate subscription and update user flags
            subscription.setSubscriptionStatus(Subscription.SubscriptionStatus.ACTIVE);
            subscriptionRepository.save(subscription);

            System.out.println("✅ Subscription marked ACTIVE");
            subscriptionService.activateSubscription(transactionId);

            return ResponseEntity.ok("Subscription activated and user updated.");
        } else {
            subscription.setSubscriptionStatus(Subscription.SubscriptionStatus.CANCELLED);
            subscriptionRepository.save(subscription);

            System.out.println("⚠️ Subscription marked CANCELLED");

            return ResponseEntity.ok("Subscription cancelled.");
        }
    }
}
