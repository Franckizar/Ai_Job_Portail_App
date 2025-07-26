
package com.example.security.Other.Payment;

import com.example.security.user.User;
import com.example.security.UserRepository;
import com.example.security.Other.Subscription.Subscription;
import com.example.security.Other.Subscription.SubscriptionPaymentResponse;
import com.example.security.Other.Subscription.SubscriptionRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SubscriptionPaymentService {

    private final SubscriptionRepository subscriptionRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;

    @Value("${campay.api.url:https://demo.campay.net/api/collect/}")
    private String campayApiUrl;

    @Value("${campay.api.token:9f80ec928d13add9b75537127b5cc95e11e83058}")
    private String campayApiToken;

    @Transactional
    public SubscriptionPaymentResponse processSubscriptionPayment(
            Integer userId, 
            User.SubscriptionPlanType planType, 
            String phoneNumber) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Subscription subscription = createPendingSubscription(user, planType);

        try {
            Map<String, Object> campayRequest = new HashMap<>();
            campayRequest.put("amount", planType.getMonthlyPrice().toString());
            campayRequest.put("from", "+237" + phoneNumber);
            campayRequest.put("description", "Subscription: " + planType.getDescription());
            campayRequest.put("external_reference", "SUB-" + subscription.getId());
            campayRequest.put("currency", "XAF");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Token " + campayApiToken);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(campayRequest, headers);

            ResponseEntity<Map> campayResponse = restTemplate.exchange(
                    campayApiUrl,
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            Map<String, Object> responseBody = campayResponse.getBody();

            if (campayResponse.getStatusCode() == HttpStatus.OK && 
                responseBody != null && responseBody.get("id") != null) {

                String transactionId = responseBody.get("id").toString();
                subscription.setTransactionId(transactionId);
                subscriptionRepository.save(subscription);

                createPaymentRecord(user, subscription, transactionId);

                return SubscriptionPaymentResponse.builder()
                        .success(true)
                        .subscriptionId(subscription.getId())
                        .transactionId(transactionId)
                        .amount(planType.getMonthlyPrice())
                        .message("Payment initiated successfully")
                        .build();

            } else {
                subscription.setSubscriptionStatus(Subscription.SubscriptionStatus.CANCELLED); // Fixed method name
                subscriptionRepository.save(subscription);

                return SubscriptionPaymentResponse.builder()
                        .success(false)
                        .subscriptionId(subscription.getId())
                        .message("Payment failed to initiate")
                        .build();
            }

        } catch (Exception e) {
            subscription.setSubscriptionStatus(Subscription.SubscriptionStatus.CANCELLED); // Fixed method name
            subscriptionRepository.save(subscription);

            return SubscriptionPaymentResponse.builder()
                    .success(false)
                    .subscriptionId(subscription.getId())
                    .message("Payment error: " + e.getMessage())
                    .build();
        }
    }

    private Subscription createPendingSubscription(User user, User.SubscriptionPlanType planType) {
        LocalDateTime now = LocalDateTime.now();
        return subscriptionRepository.save(Subscription.builder()
                .user(user)
                .planType(planType)
                .startDate(now)
                .endDate(now.plusMonths(1))
                .amount(planType.getMonthlyPrice())
                .subscriptionStatus(Subscription.SubscriptionStatus.PENDING) // Fixed field name
                .build());
    }

    private void createPaymentRecord(User user, Subscription subscription, String transactionId) {
        Payment payment = Payment.builder()
                .user(user)
                .subscription(subscription)
                .transactionId(transactionId)
                .amount(subscription.getAmount())
                .paymentType(Payment.PaymentType.SUBSCRIPTION)
                .status(Payment.PaymentStatus.PENDING) // This is correct - Payment entity uses Payment.PaymentStatus
                .createdAt(LocalDateTime.now())
                .build();

        paymentRepository.save(payment);
    }
}
