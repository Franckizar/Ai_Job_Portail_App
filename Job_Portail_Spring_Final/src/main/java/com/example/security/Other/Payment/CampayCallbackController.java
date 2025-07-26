package com.example.security.Other.Payment;

import com.example.security.Other.Subscription.Subscription;
import com.example.security.Other.Subscription.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth/campay/callback")
@RequiredArgsConstructor
public class CampayCallbackController {

    private final PaymentRepository paymentRepository;
    private final SubscriptionRepository subscriptionRepository;

    @GetMapping
    public ResponseEntity<String> handleCallback(
            @RequestParam("status") String status,
            @RequestParam("reference") String reference,
            @RequestParam("external_reference") String externalReference
    ) {
        // Validate external_reference format
        if (!externalReference.startsWith("SUB-")) {
            return ResponseEntity.badRequest().body("Invalid external_reference format");
        }

        // Parse subscription ID
        Integer subscriptionId;
        try {
            subscriptionId = Integer.parseInt(externalReference.replace("SUB-", ""));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid subscription ID");
        }

        // Find subscription
        Optional<Subscription> subscriptionOpt = subscriptionRepository.findById(subscriptionId);
        if (subscriptionOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Subscription not found");
        }

        Subscription subscription = subscriptionOpt.get();
        Integer userId = subscription.getUserId(); // <-- must exist in your entity

        // Find payment using subscriptionId and userId
        Optional<Payment> paymentOpt = paymentRepository.findBySubscriptionIdAndUserId(subscriptionId, userId);
        if (paymentOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Payment not found");
        }

        Payment payment = paymentOpt.get();

        // Update payment + subscription status
        if ("SUCCESSFUL".equalsIgnoreCase(status)) {
            payment.setStatus(Payment.PaymentStatus.COMPLETED); // Enum required
            subscription.setSubscriptionStatus(Subscription.SubscriptionStatus.ACTIVE);
        } else {
            payment.setStatus(Payment.PaymentStatus.FAILED);
            subscription.setSubscriptionStatus(Subscription.SubscriptionStatus.CANCELLED);
        }

        paymentRepository.save(payment);
        subscriptionRepository.save(subscription);

        return ResponseEntity.ok("✅ Callback handled successfully");
    }
}
