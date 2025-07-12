package com.example.security.user.Nurse;

import lombok.Data;

@Data
public class NurseProfileRequest {
    private String department;
    private String licenseNumber;
    private String shift;
    private String contactNumber;
    private String professionalEmail;
    private String photoUrl;
    private String officeNumber;
    private Integer yearsOfExperience;
    private String bio;
    private String languagesSpoken;
    private Boolean active;
}
