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

    public void sendApplicationAcceptanceEmail(String toEmail, String applicantName, String jobTitle, String companyName, Integer applicationId) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("takamarthur3@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Congratulations! Your Application Has Been Accepted - " + jobTitle);
        
        String emailBody = String.format(
            "Dear %s,\n\n" +
            "Congratulations! We are delighted to inform you that your application has been ACCEPTED.\n\n" +
            "Application Details:\n" +
            "- Position: %s\n" +
            "- Company: %s\n" +
            "- Application ID: #%d\n" +
            "- Status Updated: %s\n\n" +
            "What's Next?\n" +
            "Our HR team will contact you within the next 2-3 business days to discuss the next steps in the hiring process. " +
            "This may include scheduling interviews, discussing salary expectations, or providing additional information about the role.\n\n" +
            "Please ensure your contact information is up to date and be prepared to respond promptly to our communications.\n\n" +
            "We are excited about the possibility of having you join our team and look forward to working with you!\n\n" +
            "Congratulations once again!\n\n" +
            "Best regards,\n" +
            "The Hiring Team\n" +
            "%s\n" +
            "Job Portal System",
            applicantName,
            jobTitle,
            companyName,
            applicationId,
            java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' HH:mm")),
            companyName
        );
        
        message.setText(emailBody);
        javaMailSender.send(message);
    }

    public void sendApplicationRejectionEmail(String toEmail, String applicantName, String jobTitle, String companyName, Integer applicationId) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("takamarthur3@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Application Update - " + jobTitle);
        
        String emailBody = String.format(
            "Dear %s,\n\n" +
            "Thank you for your interest in the %s position at %s and for taking the time to apply.\n\n" +
            "Application Details:\n" +
            "- Position: %s\n" +
            "- Company: %s\n" +
            "- Application ID: #%d\n" +
            "- Status Updated: %s\n\n" +
            "After careful consideration, we have decided to move forward with other candidates whose qualifications more closely match our current needs.\n\n" +
            "This decision was not easy, as we received many qualified applications. We encourage you to continue exploring opportunities with us in the future, as we are always looking for talented individuals.\n\n" +
            "We wish you the best of luck in your job search and future career endeavors.\n\n" +
            "Thank you again for your interest in our company.\n\n" +
            "Best regards,\n" +
            "The Hiring Team\n" +
            "%s\n" +
            "Job Portal System",
            applicantName,
            jobTitle,
            companyName,
            jobTitle,
            companyName,
            applicationId,
            java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' HH:mm")),
            companyName
        );
        
        message.setText(emailBody);
        javaMailSender.send(message);
    }
}
