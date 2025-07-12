package com.example.security.user.MedicalRecord;

import com.example.security.user.Patient.PatientProfile;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.example.security.user.Doctor.DoctorProfile;
import com.example.security.user.Appointment.Appointment;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "medical_records")
public class MedicalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many records for one patient
    @ManyToOne(fetch = FetchType.LAZY)
     @JsonIgnore
    @JoinColumn(name = "patient_id", referencedColumnName = "id")
    private PatientProfile patient;

    // Many records by one doctor
    @ManyToOne(fetch = FetchType.LAZY)
     @JsonIgnore
    @JoinColumn(name = "doctor_id", referencedColumnName = "id")
    private DoctorProfile doctor;

    // Optional: One record per appointment (nullable)
    @OneToOne(fetch = FetchType.LAZY)
     @JsonIgnore
    @JoinColumn(name = "appointment_id", referencedColumnName = "id", nullable = true)
    private Appointment appointment;

    // Record meta fields
    private LocalDate recordDate;
    private String type; // e.g., 'diagnosis', 'treatment_note', 'referral'
    @Column(columnDefinition = "TEXT")
    private String details;
    private LocalDate followUpDate;

    // Additional fields for dental context
    @Column(columnDefinition = "TEXT")
    private String chiefComplaint;

    @Column(columnDefinition = "TEXT")
    private String medicalHistory;

    @Column(columnDefinition = "TEXT")
    private String allergies;

    @Column(columnDefinition = "TEXT")
    private String examinationNotes;

    @Column(columnDefinition = "TEXT")
    private String xrayFindings;

    @Column(columnDefinition = "TEXT")
    private String diagnosis;

    @Column(columnDefinition = "TEXT")
    private String treatmentPlan;

    @Column(columnDefinition = "TEXT")
    private String proceduresDone;

    private LocalDateTime lastUpdated;

    @Column(columnDefinition = "TEXT")
    private String dentalHealthSummary;

    private LocalDate nextCheckupDate;

    @Column(columnDefinition = "TEXT")
    private String oralHygieneInstructions;
}
