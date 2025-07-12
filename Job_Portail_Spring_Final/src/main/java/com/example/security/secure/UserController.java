package com.example.security.secure;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.security.auth.AuthenticationService;

// import com.example.security.auth.AuthenticationService;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    @Autowired  // Not compatible with 'final'!
    private AuthenticationService authenticationService; 
    @GetMapping("/hello_user")
    public ResponseEntity<String> sayHello(){
        return ResponseEntity.ok("hello from the secure user endpoint");
    }
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
}
