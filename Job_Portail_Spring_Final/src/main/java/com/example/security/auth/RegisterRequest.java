package com.example.security.auth;

import com.example.security.user.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    private String firstname;
    private String lastname;
    private String email;
    private String password;
    private Role role;
    private String ProfileImageUrl;

    // Admin
    private String favoriteColor;
    private Integer luckyNumber;

    // Job Seeker
    private String fullName;
    private String bio;
    private String resumeUrl;

    // Enterprise
    private String companyName;
    private String industry;
    private String description;
    private String website;
    private String logoUrl;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private Double latitude;
    private Double longitude;

    private String department;
    private String licenseNumber;
    private String shift;
    private String contactNumber;
    private String professionalEmail;
    private String photoUrl;
    private String officeNumber;
    private Integer yearsOfExperience;
    // private String bio;
    private String languagesSpoken;
    private Boolean active;
    private String technicianLevel;
    private String certifications;
}
