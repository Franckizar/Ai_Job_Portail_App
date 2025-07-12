package com.example.security.user.Appointment;

import com.example.security.user.Patient.PatientProfile;
import com.example.security.user.Service.Service;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.example.security.user.Doctor.DoctorProfile;
import com.example.security.user.MedicalRecord.MedicalRecord;
import com.example.security.user.Nurse.NurseProfile;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "appointments")
public class Appointment {

    public enum AppointmentStatus {
        PENDING, CONFIRMED, CANCELLED, COMPLETED, RESCHEDULED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", referencedColumnName = "id")
    @JsonIgnore
    private PatientProfile patient;

    @ManyToOne(fetch = FetchType.LAZY)
     @JsonIgnore
    @JoinColumn(name = "doctor_id", referencedColumnName = "id")
    private DoctorProfile doctor;

    @ManyToOne(fetch = FetchType.LAZY)
     @JsonIgnore
    @JoinColumn(name = "nurse_id", referencedColumnName = "id")
    private NurseProfile nurse;

    @OneToOne(mappedBy = "appointment", fetch = FetchType.LAZY)
    private MedicalRecord medicalRecord;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String reason;
    private String appointmentType;
    
   @Enumerated(EnumType.STRING)
    @Builder.Default
    private AppointmentStatus status = AppointmentStatus.PENDING;
    
    private String notes;
    private String bookingMethod;
    private String bookedBy;


    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "service_id", referencedColumnName = "id")
    // @JsonIgnore
    // private Service service;
}
