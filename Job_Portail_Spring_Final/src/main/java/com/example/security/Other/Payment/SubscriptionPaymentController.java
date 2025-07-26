package com.example.security.Other.Payment;

import com.example.security.Other.Subscription.SubscriptionPaymentResponse;
import com.example.security.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth/subscription-payments")
@RequiredArgsConstructor
public class SubscriptionPaymentController {

    private final SubscriptionPaymentService subscriptionPaymentService;

    @PostMapping("/process")
    public ResponseEntity<SubscriptionPaymentResponse> processSubscriptionPayment(
            @RequestParam Integer userId,
            @RequestParam User.SubscriptionPlanType planType,
            @RequestParam String phoneNumber) {

        SubscriptionPaymentResponse response = subscriptionPaymentService
                .processSubscriptionPayment(userId, planType, phoneNumber);

        return ResponseEntity.ok(response);
    }
}