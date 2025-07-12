package com.example.security.user.Patient;

import com.example.security.user.User;
// import com.example.security.user.Appointment.Appointment;
import com.example.security.user.Doctor.DoctorProfile;
// import com.example.security.user.Invoice.Invoice;
// import com.example.security.user.MedicalRecord.MedicalRecord;
// import com.example.security.user.Prescription.Prescription;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "patient_profiles")
public class PatientProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", referencedColumnName = "id")
    @JsonIgnore
    private DoctorProfile doctor;

    private LocalDate dateOfBirth;
    private String gender;
    private String phoneNumber;
    private String address;
    private String emergencyContact;
    private String bloodType;
    
    @Column(columnDefinition = "TEXT")
    private String allergies;
    
    private String occupation;
    private String maritalStatus;

    @Column(columnDefinition = "TEXT")
    private String currentMedications;

    @Column(columnDefinition = "TEXT")
    private String chronicConditions;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private String photoUrl;

    @Builder.Default
    private Boolean active = true;

    // @OneToMany(mappedBy = "patient", fetch = FetchType.LAZY)
    // @JsonIgnore
    // private List<Appointment> appointments;

    // @OneToMany(mappedBy = "patient", fetch = FetchType.LAZY)
    // private List<Invoice> invoices;

    // @OneToMany(mappedBy = "patient", fetch = FetchType.LAZY)
    // private List<Prescription> prescriptions;

    // @OneToMany(mappedBy = "patient", fetch = FetchType.LAZY)
    // private List<MedicalRecord> medicalRecords;

    public String getFullName() {
        return user != null ? user.getFirstname() + " " + user.getLastname() : null;
    }

    public String getEmail() {
        return user != null ? user.getEmail() : null;
    }
}
