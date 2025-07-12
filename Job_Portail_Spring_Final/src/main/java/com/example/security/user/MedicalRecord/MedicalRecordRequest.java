package com.example.security.user.MedicalRecord;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class MedicalRecordRequest {
    private Integer doctorId;
    private Integer appointmentId; // Optional
    private LocalDate recordDate;
    private String type;
    private String details;
    private LocalDate followUpDate;
    private String chiefComplaint;
    private String medicalHistory;
    private String allergies;
    private String examinationNotes;
    private String xrayFindings;
    private String diagnosis;
    private String treatmentPlan;
    private String proceduresDone;
    private LocalDateTime lastUpdated;
    private String dentalHealthSummary;
    private LocalDate nextCheckupDate;
    private String oralHygieneInstructions;
}
