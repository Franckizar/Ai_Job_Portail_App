package com.example.security.user.Technicien;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TechnicianRequest {
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
    private String technicianLevel;
    private String certifications;
}
