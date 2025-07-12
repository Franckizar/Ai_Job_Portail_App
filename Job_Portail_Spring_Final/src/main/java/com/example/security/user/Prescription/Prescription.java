package com.example.security.user.Prescription;

import com.example.security.user.Patient.PatientProfile;
import com.example.security.user.Doctor.DoctorProfile;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "prescriptions")
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Many prescriptions can be for one patient
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", referencedColumnName = "id")
    private PatientProfile patient;

    // Many prescriptions can be written by one doctor
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", referencedColumnName = "id")
    private DoctorProfile doctor;

    private LocalDate datePrescribed;
    private String medicationName;
    private String dosage;
    private String frequency;
    private String duration;
    private String notes;
    private String status; // e.g., 'active', 'completed'
}
