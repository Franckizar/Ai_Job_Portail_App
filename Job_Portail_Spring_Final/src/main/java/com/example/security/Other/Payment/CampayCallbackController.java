package com.example.security.Other.Payment;

import com.example.security.Other.Subscription.Subscription;
import com.example.security.Other.Subscription.SubscriptionRepository;
import com.example.security.Other.Subscription.SubscriptionService;
import lombok.RequiredArgsConstructor;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class CampayCallbackController {

    private final PaymentRepository paymentRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionService subscriptionService;

    @GetMapping("/api/v1/auth/campay/callback")
    public ResponseEntity<String> handleCampayCallback(
            @RequestParam(required = false, defaultValue = "") String status,
            @RequestParam(required = false, defaultValue = "") String reference,
            @RequestParam(required = false, defaultValue = "") String amount,
            @RequestParam(required = false, defaultValue = "") String currency,
            @RequestParam(required = false, defaultValue = "") String operator,
            @RequestParam(required = false, defaultValue = "") String code,
            @RequestParam(required = false, defaultValue = "") String operator_reference,
            @RequestParam(required = false, defaultValue = "") String signature,
            @RequestParam(required = false, defaultValue = "") String endpoint,
            @RequestParam(required = false, defaultValue = "") String external_reference,
            @RequestParam(required = false, defaultValue = "") String external_user,
            @RequestParam(required = false, defaultValue = "") String extra_first_name,
            @RequestParam(required = false, defaultValue = "") String extra_last_name,
            @RequestParam(required = false, defaultValue = "") String extra_email,
            @RequestParam(required = false, defaultValue = "") String phone_number
    ) {
        System.out.println("=== CAMPAY CALLBACK RECEIVED ===");
        System.out.println("Status: " + status);
        System.out.println("Reference: " + reference);
        System.out.println("External Reference: " + external_reference);
        System.out.println("Amount: " + amount);
        System.out.println("================================");

        // Validate required parameters
        if (status.isEmpty() || reference.isEmpty() || external_reference.isEmpty()) {
            System.err.println("❌ Missing required parameters: status=" + status + 
                             ", reference=" + reference + ", external_reference=" + external_reference);
            return ResponseEntity.badRequest().body("Missing required parameters");
        }

        try {
            if (external_reference.startsWith("SUB-")) {
                handleSubscriptionCallback(status, reference, external_reference);
            } else if (external_reference.startsWith("INV-")) {
                System.out.println("Processing invoice callback: " + external_reference);
                // Your existing invoice callback logic here
            }

            return ResponseEntity.ok("Callback processed successfully");

        } catch (Exception e) {
            System.err.println("Callback processing error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok("Callback received but processing failed");
        }
    }

    private void handleSubscriptionCallback(String status, String reference, String externalReference) {
        try {
            System.out.println("🔄 Processing subscription callback...");
            
            Integer subscriptionId = Integer.parseInt(externalReference.replace("SUB-", ""));
            System.out.println("📋 Subscription ID: " + subscriptionId);
            
            Subscription subscription = subscriptionRepository.findById(subscriptionId)
                    .orElseThrow(() -> new IllegalArgumentException("Subscription not found with ID: " + subscriptionId));

            System.out.println("👤 Found subscription for user: " + subscription.getUser().getId());

            // Find and update payment record - with explicit type checking
            Optional<Payment> paymentOptional = paymentRepository.findByTransactionId(reference);
            paymentOptional.ifPresentOrElse(paymentRecord -> {
                System.out.println("💳 Found payment record with transaction ID: " + reference);
                System.out.println("💳 Payment record type: " + paymentRecord.getClass().getSimpleName());
                
                if ("SUCCESSFUL".equalsIgnoreCase(status)) {
                    // SUCCESS - Update payment and activate subscription
                    paymentRecord.setStatus(Payment.PaymentStatus.COMPLETED);
                    paymentRepository.save(paymentRecord);
                    
                    subscription.setTransactionId(reference);
                    subscription.setSubscriptionStatus(Subscription.SubscriptionStatus.ACTIVE);
                    subscriptionRepository.save(subscription);
                    
                    // Activate subscription through service
                    subscriptionService.activateSubscription(reference);
                    
                    System.out.println("✅ SUCCESS: Subscription activated for user " + subscription.getUser().getId());
                    
                } else {
                    // FAILURE - Update payment and cancel subscription
                    paymentRecord.setStatus(Payment.PaymentStatus.FAILED);
                    paymentRepository.save(paymentRecord);
                    
                    subscription.setSubscriptionStatus(Subscription.SubscriptionStatus.CANCELLED);
                    subscriptionRepository.save(subscription);
                    
                    System.out.println("❌ FAILED: Subscription payment failed for user " + subscription.getUser().getId());
                }
                
            }, () -> {
                // Payment record not found - just update subscription
                System.out.println("⚠️ Payment record not found for transaction: " + reference);
                
                if ("SUCCESSFUL".equalsIgnoreCase(status)) {
                    subscription.setTransactionId(reference);
                    subscription.setSubscriptionStatus(Subscription.SubscriptionStatus.ACTIVE);
                    subscriptionRepository.save(subscription);
                    subscriptionService.activateSubscription(reference);
                    System.out.println("✅ Subscription activated without payment record");
                } else {
                    subscription.setSubscriptionStatus(Subscription.SubscriptionStatus.CANCELLED);
                    subscriptionRepository.save(subscription);
                    System.out.println("❌ Subscription cancelled without payment record");
                }
            });

        } catch (NumberFormatException e) {
            System.err.println("❌ Invalid subscription ID format: " + externalReference);
        } catch (Exception e) {
            System.err.println("❌ Error processing subscription callback: " + e.getMessage());
            e.printStackTrace();
        }
    }

}