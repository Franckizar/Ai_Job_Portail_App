package com.example.security.config;


import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender javaMailSender;
  
public void sendPasswordResetEmail(String toEmail, String resetLink) {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setTo(toEmail);
    message.setSubject("Reset Your Password");
    message.setText("Click this link: " + resetLink); // Correct: link in text
    javaMailSender.send(message);
  }
}  


