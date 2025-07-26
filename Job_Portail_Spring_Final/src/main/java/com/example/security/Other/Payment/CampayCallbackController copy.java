//     package com.example.security.Other.Payment;

//     import java.util.concurrent.Flow.Subscription;

// import org.springframework.http.ResponseEntity;
//     import org.springframework.web.bind.annotation.GetMapping;
//     import org.springframework.web.bind.annotation.RequestParam;
//     import org.springframework.web.bind.annotation.RestController;

// import com.example.security.Other.Subscription.SubscriptionRepository;
// import com.example.security.Other.Subscription.SubscriptionService;
// @RestController
// @RequiredArgsConstructor
// public class CampayCallbackController {

//     private final PaymentRepository paymentRepository;
//     private final SubscriptionRepository subscriptionRepository;
//     private final SubscriptionService subscriptionService;

//     @GetMapping("/api/v1/auth/campay/callback")
//     public ResponseEntity<String> handleCampayCallback(
//             @RequestParam String status,
//             @RequestParam String reference,
//             @RequestParam String amount,
//             @RequestParam String currency,
//             @RequestParam String operator,
//             @RequestParam String code,
//             @RequestParam String operator_reference,
//             @RequestParam String signature,
//             @RequestParam String endpoint,
//             @RequestParam String external_reference,
//             @RequestParam String external_user,
//             @RequestParam String extra_first_name,
//             @RequestParam String extra_last_name,
//             @RequestParam String extra_email,
//             @RequestParam String phone_number
//     ) {
//         System.out.println("Campay Callback - Status: " + status);
//         System.out.println("External Reference: " + external_reference);

//         try {
//             // Check if it's a subscription payment
//             if (external_reference.startsWith("SUB-")) {
//                 handleSubscriptionCallback(status, reference, external_reference);
//             } else if (external_reference.startsWith("INV-")) {
//                 // Handle invoice payment (existing logic)
//                 handleInvoiceCallback(status, reference, external_reference);
//             }

//             return ResponseEntity.ok("Callback processed successfully");

//         } catch (Exception e) {
//             System.err.println("Callback processing error: " + e.getMessage());
//             return ResponseEntity.ok("Callback received but processing failed");
//         }
//     }

//     private void handleSubscriptionCallback(String status, String reference, String externalReference) {
//         Long subscriptionId = Long.parseLong(externalReference.replace("SUB-", ""));
        
//         Subscription subscription = subscriptionRepository.findById(subscriptionId)
//                 .orElseThrow(() -> new IllegalArgumentException("Subscription not found"));

//         // Update payment record
//         paymentRepository.findByTransactionId(reference).ifPresent(payment -> {
//             if ("SUCCESSFUL".equalsIgnoreCase(status)) {
//                 payment.setStatus(Payment.PaymentStatus.COMPLETED);
//                 subscription.setTransactionId(reference);
//                 subscriptionService.activateSubscription(reference);
//             } else {
//                 payment.setStatus(Payment.PaymentStatus.FAILED);
//                 subscription.setStatus(Subscription.SubscriptionStatus.CANCELLED);
//             }
//             paymentRepository.save(payment);
//             subscriptionRepository.save(subscription);
//         });
//     }

//     private void handleInvoiceCallback(String status, String reference, String externalReference) {
//         // Your existing invoice callback logic here
//         System.out.println("Processing invoice callback: " + externalReference);
//     }
// }

