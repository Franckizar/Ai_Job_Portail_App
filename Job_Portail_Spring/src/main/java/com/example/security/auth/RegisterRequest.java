package com.example.security.auth;

import com.example.security.user.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String firstname;
    private String lastname;
    private String email;
    private String password;
    private Role role; // Add role attribute

      // Admin-specific attributes (optional)
    private String adminCode;
    private String accessLevel;


       private String favoriteColor; // <-- add this
    private Integer luckyNumber;
}
