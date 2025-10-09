// package com.example.security.config;


// import org.springframework.mail.SimpleMailMessage;
// import org.springframework.mail.javamail.JavaMailSender;
// import org.springframework.stereotype.Service;


// import lombok.RequiredArgsConstructor;

// @Service
// @RequiredArgsConstructor
// public class EmailService {
//     private final JavaMailSender javaMailSender;
  
// public void sendPasswordResetEmail(String toEmail, String resetLink) {
//     SimpleMailMessage message = new SimpleMailMessage();
//     message.setTo(toEmail);
//     message.setSubject("Reset Your Password");
//     message.setText("Click this link: " + resetLink); // Correct: link in text
//     javaMailSender.send(message);
//   }
// }  


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
        message.setFrom("takamarthur3@gmail.com");  // <-- Explicitly set the From address here
        message.setTo(toEmail);
        message.setSubject("Reset Your Password");
        message.setText("Click this link: " + resetLink);
        javaMailSender.send(message);
    }

    public void sendApplicationConfirmationEmail(String toEmail, String applicantName, String jobTitle, String companyName, Integer applicationId) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("takamarthur3@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Application Submitted Successfully - " + jobTitle);
        
        String emailBody = String.format(
            "Dear %s,\n\n" +
            "Thank you for your interest in our company! We are pleased to confirm that your application has been successfully submitted.\n\n" +
            "Application Details:\n" +
            "- Position: %s\n" +
            "- Company: %s\n" +
            "- Application ID: #%d\n" +
            "- Submitted: %s\n\n" +
            "What happens next?\n" +
            "Our hiring team will review your application and get back to you within 5-7 business days. " +
            "If your qualifications match our requirements, we will contact you to schedule an interview.\n\n" +
            "In the meantime, you can track the status of your application by logging into your account on our job portal.\n\n" +
            "Thank you for considering us as your potential employer. We look forward to the possibility of working with you!\n\n" +
            "Best regards,\n" +
            "The Hiring Team\n" +
            "Job Portal System",
            applicantName,
            jobTitle,
            companyName,
            applicationId,
            java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' HH:mm"))
        );
        
        message.setText(emailBody);
        javaMailSender.send(message);
    }
}
