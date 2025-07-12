package com.example.security.auth;

import com.example.security.config.JwtService;
import com.example.security.config.EmailService;
import com.example.security.user.*;
import com.example.security.user.adminthings.AdminProfileRequest;
import com.example.security.user.adminthings.AdminProfileService;

import io.jsonwebtoken.lang.Arrays;

import com.example.security.PasswordResetTokenRepository;
import com.example.security.UserRepository;
import lombok.RequiredArgsConstructor;

import org.hibernate.Hibernate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;
    private final AdminProfileService adminProfileService;

    public AuthenticationResponse register(RegisterRequest request) {
        boolean isFirstUser = userRepository.count() == 0;

        User user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .tokenVersion(0)
                .build();

        if (isFirstUser) {
            user.addRole(Role.ADMIN);
        } else {
            user.addRole(Role.UNKNOWN);
        }

        user.incrementTokenVersion();
        userRepository.save(user);

        // Create admin profile for first user
        if (isFirstUser) {
            AdminProfileRequest adminProfileRequest = new AdminProfileRequest(
                    request.getFavoriteColor(),
                    request.getLuckyNumber(),
                    true,
                    "Initial system administrator"
            );
            adminProfileService.registerOrUpdateAdminProfile(user.getId(), adminProfileRequest);
        }

        String jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.incrementTokenVersion();
        userRepository.save(user);

        String jwtToken = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public String initiatePasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusHours(1))
                .build();

        passwordResetTokenRepository.save(resetToken);

        String resetLink = "https://wambs-clinic.onrender.com/api/v1/auth/reset-password?token=" + token;
        emailService.sendPasswordResetEmail(email, resetLink);

        return "Reset email sent";
    }

    public String finalizePasswordReset(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            passwordResetTokenRepository.delete(resetToken);
            throw new RuntimeException("Token expired");
        }

        User user = resetToken.getUser();
        user.incrementTokenVersion();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        passwordResetTokenRepository.delete(resetToken);

        return "Password updated successfully";
    }

    public void logout(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.logout();
        userRepository.save(user);
    }

public List<User> getAllUnknownUsers() {
    return userRepository.findAll().stream()
        .filter(user -> {
            if (user.getRoles() == null || user.getRoles().isEmpty()) {
                return true; // Consider users with no roles as UNKNOWN
            }
            return user.getRoles().stream()
                .anyMatch(role -> role.equalsIgnoreCase(Role.UNKNOWN.name()));
        })
        .collect(Collectors.toList());
}

}
