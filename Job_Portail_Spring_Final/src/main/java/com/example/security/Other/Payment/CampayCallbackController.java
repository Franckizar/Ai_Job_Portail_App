    package com.example.security.Other.Payment;


    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.GetMapping;
    import org.springframework.web.bind.annotation.RequestParam;
    import org.springframework.web.bind.annotation.RestController;

    @RestController
    public class CampayCallbackController {

        @GetMapping("/api/v1/auth/campay/callback")
        public ResponseEntity<String> handleCampayCallback(
                @RequestParam String status,
                @RequestParam String reference,
                @RequestParam String amount,
                @RequestParam String currency,
                @RequestParam String operator,
                @RequestParam String code,
                @RequestParam String operator_reference,
                @RequestParam String signature,
                @RequestParam String endpoint,
                @RequestParam String external_reference,
                @RequestParam String external_user,
                @RequestParam String extra_first_name,
                @RequestParam String extra_last_name,
                @RequestParam String extra_email,
                @RequestParam String phone_number
        ) {
            // Simply print all received parameters
            System.out.println("Received Campay callback:");
            System.out.println("Status: " + status);
            System.out.println("Reference: " + reference);
            System.out.println("Amount: " + amount);
            System.out.println("Currency: " + currency);
            System.out.println("Operator: " + operator);
            System.out.println("Code: " + code);
            System.out.println("Operator Reference: " + operator_reference);
            System.out.println("Signature (not validated): " + signature);
            System.out.println("Endpoint: " + endpoint);
            System.out.println("External Reference: " + external_reference);
            System.out.println("External User: " + external_user);
            System.out.println("First Name: " + extra_first_name);
            System.out.println("Last Name: " + extra_last_name);
            System.out.println("Email: " + extra_email);
            System.out.println("Phone Number: " + phone_number);

            // Return 200 OK without validating anything
            return ResponseEntity.ok("Callback received (no validation)");
        }
    }
