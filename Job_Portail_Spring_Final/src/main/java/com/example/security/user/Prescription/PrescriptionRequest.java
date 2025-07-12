package com.example.security.user.Prescription;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PrescriptionRequest {
    private Integer doctorId;
    private LocalDate datePrescribed;
    private String medicationName;
    private String dosage;
    private String frequency;
    private String duration;
    private String notes;
    private String status;
}
