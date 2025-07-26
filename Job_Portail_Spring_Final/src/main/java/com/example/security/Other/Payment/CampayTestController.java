package com.example.security.Other.Payment;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class CampayTestController {

    @GetMapping("/api/v1/auth/campay/callback/test")
    public ResponseEntity<String> testCallback(@RequestParam Map<String, String> allParams) {
        System.out.println("✅ Campay CALLBACK RECEIVED");
        allParams.forEach((key, value) -> {
            System.out.println("🔹 " + key + " : " + value);
        });
        return ResponseEntity.ok("✅ Callback received and printed in console");
    }
}
