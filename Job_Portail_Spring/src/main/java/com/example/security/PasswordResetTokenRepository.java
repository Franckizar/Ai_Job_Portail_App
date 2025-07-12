package com.example.security;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.security.user.PasswordResetToken;
import com.example.security.user.User;

import java.util.Optional;



public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    void deleteByUser(User user);
}