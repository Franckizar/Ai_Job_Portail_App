package com.example.security.auth;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.security.user.User;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
        @RequestBody RegisterRequest request
    ) {
        System.out.println("[AuthenticationController] Received registration request for: " + request.getEmail());
        try {
            ResponseEntity<AuthenticationResponse> response = ResponseEntity.ok(
                authenticationService.register(request)
            );
            System.out.println("[AuthenticationController] Registration successful for: " + request.getEmail());
            return response;
        } catch (Exception e) {
            System.out.println("[AuthenticationController] Registration failed for " + request.getEmail() + ": " + e.getMessage());
            throw e;
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
        @RequestBody AuthenticationRequest request
    ) {
        System.out.println("[AuthenticationController] Received authentication request for: " + request.getEmail());
        try {
            ResponseEntity<AuthenticationResponse> response = ResponseEntity.ok(
                authenticationService.authenticate(request)
            );
            System.out.println("[AuthenticationController] Authentication successful for: " + request.getEmail());
            return response;
        } catch (Exception e) {
            System.out.println("[AuthenticationController] Authentication failed for " + request.getEmail() + ": " + e.getMessage());
            throw e;
        }
    }

    @GetMapping("/demo")
    public ResponseEntity<String> sayHello() {
        System.out.println("[AuthenticationController] Accessing demo endpoint");
        return ResponseEntity.ok("hello from unsecure endpoint");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        System.out.println("[AuthenticationController] Received password reset request for: " + email);
        try {
            String result = authenticationService.initiatePasswordReset(email);
            System.out.println("[AuthenticationController] Password reset initiated successfully for: " + email);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            System.out.println("[AuthenticationController] Password reset failed (client error) for " + email + ": " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.out.println("[AuthenticationController] Password reset failed (server error) for " + email + ": " + e.getMessage());
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
        @RequestParam String token,
        @RequestParam String newPassword
    ) {
        System.out.println("[AuthenticationController] Received password reset confirmation for token: " + token);
        try {
            String result = authenticationService.finalizePasswordReset(token, newPassword);
            System.out.println("[AuthenticationController] Password reset completed successfully for token: " + token);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            System.out.println("[AuthenticationController] Password reset confirmation failed for token " + token + ": " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // AuthenticationController.java
@PostMapping("/logout")
public ResponseEntity<?> logout(Authentication authentication) {
    System.out.println("[AuthenticationController] Received logout request");
    
    try {
        String email = authentication.getName();
        System.out.println("[AuthenticationController] Logging out user: " + email);
        
        authenticationService.logout(email);
        return ResponseEntity.ok("Logged out successfully");
    } catch (Exception e) {
        System.out.println("[AuthenticationController] Logout failed: " + e.getMessage());
        return ResponseEntity.status(401).body("Logout failed");
    }
}

@GetMapping("/users/unknown")
public List<User> getUsersWithUnknownRole() {
    return authenticationService.getAllUnknownUsers();
}

}
