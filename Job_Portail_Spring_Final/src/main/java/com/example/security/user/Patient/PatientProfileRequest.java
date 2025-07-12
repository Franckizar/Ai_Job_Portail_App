package com.example.security.user.Patient;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PatientProfileRequest {
    private LocalDate dateOfBirth;
    private String gender;
    private String phoneNumber;
    private String address;
    private String emergencyContact;
    private String bloodType;
    private String allergies;
    private String occupation;
    private String maritalStatus;
    private String currentMedications;
    private String chronicConditions;
    private String notes;
    private String photoUrl;
    private Boolean active;
    private String fullName;
    private String email;
    
    private Integer doctorId;

}
