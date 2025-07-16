package com.example.security.secure;


// import java.time.Instant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
// import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.security.auth.Authentication.AuthenticationService;

// import com.example.security.auth.AuthenticationService;

// import com.example.security.auth.AuthenticationService;

@RestController
@RequestMapping("/api/v1/shared")
public class Admin_User_Controller {

    @Autowired  // Not compatible with 'final'!
    private AuthenticationService authenticationService; 
    @GetMapping("/hello_admin_user")
    public ResponseEntity<String> sayHello(){
        return ResponseEntity.ok("hello from the secure admin_user endpoint");
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


// for later when frontend will be ready
// @PostMapping("/refresh-token")
// public ResponseEntity<?> refreshToken(@CookieValue("refreshToken") String refreshToken) {
//     try {
//         // Verify refresh token validity and user association
//         RefreshToken storedToken = refreshTokenService.findByToken(refreshToken)
//             .orElseThrow(() -> new RuntimeException("Invalid refresh token"));
        
//         // Check if refresh token is revoked or expired
//         if (storedToken.isRevoked() || storedToken.getExpiryDate().isBefore(Instant.now())) {
//             throw new RuntimeException("Expired/revoked refresh token");
//         }

//         // Generate new access token
//         User user = storedToken.getUser();
//         String newAccessToken = jwtService.generateToken(user);
        
//         // Optionally rotate refresh token (security best practice)
//         RefreshToken newRefreshToken = refreshTokenService.rotateRefreshToken(storedToken);
        
//         return ResponseEntity.ok()
//             .header(HttpHeaders.SET_COOKIE, createRefreshTokenCookie(newRefreshToken).toString())
//             .body(new AccessTokenResponse(newAccessToken));
        
//     } catch (RuntimeException e) {
//         return ResponseEntity.status(401).body("Token refresh failed");
//     }
// }

}
