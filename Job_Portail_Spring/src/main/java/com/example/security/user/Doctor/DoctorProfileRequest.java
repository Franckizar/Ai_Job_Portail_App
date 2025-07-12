package com.example.security.user.Doctor;

import lombok.Data;

@Data
public class DoctorProfileRequest {
    private String specialization;
    private String licenseNumber;
    private String hospitalAffiliation;
    private Integer yearsOfExperience;
    private String contactNumber;
    private String professionalEmail;
    private String photoUrl;
    private String officeNumber;
    private String bio;
    private String languagesSpoken;
    private String availability;
    private Double rating;
    private Boolean active;
}
