package com.example.security.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.security.auth.Authentication.AuthenticationService;
import com.example.security.user.User;

@RestController
@RequestMapping("/api/v1/sharedPlus")
public class HelloController {

    @Autowired
    private AuthenticationService authenticationService;

    // Secure endpoint: expects JWT in Authorization header + email in body
    @PostMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestBody Map<String, String> body,
                                            @RequestHeader("Authorization") String authHeader) {
        try {
            System.out.println("Received request to /me with Authorization: " + authHeader);

            String emailFromBody = body.get("email");
            if (emailFromBody == null || emailFromBody.isEmpty()) {
                System.out.println("Email is missing from request body");
                return ResponseEntity.badRequest().body("Email must be provided");
            }

            System.out.println("Looking up user by email: " + emailFromBody);
            User user = authenticationService.getUserByEmail(emailFromBody);

            if (user == null) {
                System.out.println("User not found for email: " + emailFromBody);
                return ResponseEntity.status(404).body("User not found");
            }

            System.out.println("User found: " + user.getEmail() + " | ID: " + user.getId());
            return ResponseEntity.ok(user);

        } catch (Exception e) {
            System.out.println("Exception in /me endpoint: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(401).body("Unauthorized or invalid token");
        }
    }
    @PostMapping("/verify-user")
    public ResponseEntity<?> verify_user(@RequestBody Map<String, String> body,
                                            @RequestHeader("Authorization") String authHeader) {
        try {
            System.out.println("Received request to /me with Authorization: " + authHeader);

            String emailFromBody = body.get("email");
            if (emailFromBody == null || emailFromBody.isEmpty()) {
                System.out.println("Email is missing from request body");
                return ResponseEntity.badRequest().body("Email must be provided");
            }

            System.out.println("Looking up user by email: " + emailFromBody);
            User user = authenticationService.getUserByEmail(emailFromBody);

            if (user == null) {
                System.out.println("User not found for email: " + emailFromBody);
                return ResponseEntity.status(404).body("User not found");
            }

            System.out.println("User found: " + user.getEmail() + " | ID: " + user.getId());
            return ResponseEntity.ok(user);

        } catch (Exception e) {
            System.out.println("Exception in /me endpoint: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(401).body("Unauthorized or invalid token");
        }
    }
//     @PostMapping("/verify-user")
//     public ResponseEntity<?> verifyUser(@RequestBody Map<String, String> body) {
//     String emailFromBody = body.get("email");
//     if (emailFromBody == null || emailFromBody.isEmpty()) {
//         return ResponseEntity.badRequest().body("Email must be provided in the request body");
//     }

//     User user = authenticationService.getUserByEmail(emailFromBody);
//     if (user == null) {
//         return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
//     }

//     // Return user info (you may want to customize to avoid returning passwords etc.)
//     return ResponseEntity.ok(user);
// }

}
