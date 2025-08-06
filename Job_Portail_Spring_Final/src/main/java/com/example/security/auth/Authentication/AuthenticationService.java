package com.example.security.auth.Authentication;

import com.example.security.PasswordResetTokenRepository;
import com.example.security.UserRepository;
import com.example.security.auth.AuthenticationRequest;
import com.example.security.auth.AuthenticationResponse;
import com.example.security.auth.RegisterRequest;
import com.example.security.config.EmailService;
import com.example.security.config.JwtService;
import com.example.security.user.*;
import com.example.security.user.Admin.AdminRequest;
import com.example.security.user.Admin.AdminService;
import com.example.security.user.Enterprise.EnterpriseRequest;
import com.example.security.user.Enterprise.EnterpriseService;
import com.example.security.user.JobSeeker.JobSeekerRequest;
import com.example.security.user.JobSeeker.JobSeekerService;
import com.example.security.user.PersonalEmployerProfile.PersonalEmployerRequest;
import com.example.security.user.PersonalEmployerProfile.PersonalEmployerService;
import com.example.security.user.Technicien.TechnicianRequest;
import com.example.security.user.Technicien.TechnicianService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

// import org.apache.el.stream.Optional;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
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

    private final AdminService adminService;
    private final JobSeekerService jobSeekerService;
    private final TechnicianService technicianService;
    private final EnterpriseService enterpriseService;
    private final PersonalEmployerService personalEmployerService;
    

   @Transactional
public AuthenticationResponse register(RegisterRequest request) {
    boolean isFirstUser = userRepository.count() == 0;

    // ✅ Prevent multiple admin users
    if (request.getRole() == Role.ADMIN && !isFirstUser) {
        long existingAdmins = userRepository.countByRole(Role.ADMIN);
        if (existingAdmins > 0) {
            throw new IllegalStateException("An admin already exists. Only one admin is allowed.");
        }
    }

    // ✅ Create and save user
    User user = User.builder()
            .firstname(request.getFirstname())
            .lastname(request.getLastname())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .tokenVersion(0)
            .build();

    Role assignedRole = (isFirstUser) ? Role.ADMIN : (request.getRole() != null ? request.getRole() : Role.UNKNOWN);
    user.addRole(assignedRole);
    user.incrementTokenVersion();
    userRepository.save(user);

    // ✅ Handle profile creation per role
    switch (assignedRole) {
        case ADMIN -> {
            AdminRequest adminRequest = new AdminRequest(
                    request.getFavoriteColor(),
                    request.getLuckyNumber(),
                    true,
                    "Registered as Admin"
            );
            adminService.registerOrUpdateAdminProfile(user.getId(), adminRequest);
        }

        case JOB_SEEKER -> {
            JobSeekerRequest jobSeekerRequest = JobSeekerRequest.builder()
                    .fullName(request.getFullName())
                    .bio(request.getBio())
                    .resumeUrl(request.getResumeUrl())
                    .profileImageUrl(request.getProfileImageUrl())
                    .build();
            jobSeekerService.create(user.getId(), jobSeekerRequest); 
        }

        case TECHNICIAN -> {
            TechnicianRequest technicianRequest = TechnicianRequest.builder()
                    .department(request.getDepartment())
                    .licenseNumber(request.getLicenseNumber())
                    .shift(request.getShift())
                    .contactNumber(request.getContactNumber())
                    .professionalEmail(request.getProfessionalEmail())
                    .photoUrl(request.getPhotoUrl())
                    .officeNumber(request.getOfficeNumber())
                    .yearsOfExperience(request.getYearsOfExperience())
                    .bio(request.getBio())
                    .languagesSpoken(request.getLanguagesSpoken())
                    .active(request.getActive() != null ? request.getActive() : true)
                    .technicianLevel(request.getTechnicianLevel())
                    .certifications(request.getCertifications())
                    .build();
            technicianService.create(user.getId(), technicianRequest);
        }
        
        case ENTERPRISE -> {
            EnterpriseRequest enterpriseRequest = EnterpriseRequest.builder()
                    .name(request.getCompanyName())
                    .industry(request.getIndustry())
                    .description(request.getDescription())
                    .website(request.getWebsite())
                    .logoUrl(request.getLogoUrl())
                    .addressLine1(request.getAddressLine1())
                    .addressLine2(request.getAddressLine2())
                    .city(request.getCity())
                    .state(request.getState())
                    .postalCode(request.getPostalCode())
                    .country(request.getCountry())
                    .latitude(request.getLatitude())
                    .longitude(request.getLongitude())
                    .build();
            enterpriseService.create(user, enterpriseRequest);
        }

     case PERSONAL_EMPLOYER -> {
    PersonalEmployerRequest perRequest = PersonalEmployerRequest.builder()
        .displayName(
            (request.getDisplayName() != null && !request.getDisplayName().isBlank()) 
            ? request.getDisplayName() 
            : user.getFirstname() + " " + user.getLastname()
        )
        .bio(request.getBio())
        .profileImageUrl(request.getProfileImageUrl())
        .contactNumber(request.getContactNumber())
        .addressLine1(request.getAddressLine1())
        .addressLine2(request.getAddressLine2())
        .city(request.getCity())
        .state(request.getState())
        .postalCode(request.getPostalCode())
        .country(request.getCountry())
        .latitude(request.getLatitude())
        .longitude(request.getLongitude())
        .build();

    personalEmployerService.create(user, perRequest);
}


        default -> {} // no additional handling for UNKNOWN
    }

    // ✅ Generate JWT token
    String jwtToken = jwtService.generateToken(user);
    return AuthenticationResponse.builder().token(jwtToken).build();
}


    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(), request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.incrementTokenVersion();
        userRepository.save(user);

        String jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder().token(jwtToken).build();
    }
//////////////////////////////////////////////////////////////
   public String initiatePasswordReset(String email) {
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    // Check for existing token
  Optional<PasswordResetToken> existingTokenOpt = passwordResetTokenRepository.findByUserId(user.getId());

String token = UUID.randomUUID().toString();

if (existingTokenOpt.isPresent()) {
    PasswordResetToken existingToken = existingTokenOpt.get();
    existingToken.setToken(token);
    existingToken.setExpiryDate(LocalDateTime.now().plusHours(1));
    passwordResetTokenRepository.save(existingToken);
} else {
    PasswordResetToken resetToken = PasswordResetToken.builder()
            .token(token)
            .user(user)
            .expiryDate(LocalDateTime.now().plusHours(1))
            .build();
    passwordResetTokenRepository.save(resetToken);
}

String resetLink = "https://modest-integral-ibex.ngrok-free.app/Job_portail/Home/test?token=" + token;

// String resetLink = "https://yourdomain.com/reset-password?token=" + token;
emailService.sendPasswordResetEmail(email, resetLink);

return "Reset email sent";
   }

//////////////////////////////////////////////////////////////////////
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
                .filter(user -> user.getRoles() == null || user.getRoles().contains(Role.UNKNOWN))
                .collect(Collectors.toList());
    }


    public User getUserByEmail(String email) {
    return userRepository.findByEmail(email)
        .orElse(null);
}

}
