package com.example.security.user.Doctor;

import com.example.security.user.User;
// import com.example.security.user.Appointment.Appointment;
// import com.example.security.user.MedicalRecord.MedicalRecord;
import com.example.security.user.Patient.PatientProfile;
// import com.example.security.user.Prescription.Prescription;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "doctor_profiles")
public class DoctorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @OneToMany(mappedBy = "doctor", fetch = FetchType.LAZY)
    private List<PatientProfile> patients;

    private String specialization;
    private String licenseNumber;
    private String hospitalAffiliation;
    private Integer yearsOfExperience;
    private String contactNumber;
    private String professionalEmail;
    private String photoUrl;
    private String officeNumber;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String languagesSpoken;

    @Column(columnDefinition = "TEXT")
    private String availability;

    private Double rating;

    @Builder.Default
    private Boolean active = true;

    // @OneToMany(mappedBy = "doctor", fetch = FetchType.LAZY)
    // private List<Appointment> appointments;

    // @OneToMany(mappedBy = "doctor", fetch = FetchType.LAZY)
    // private List<Prescription> prescriptions;

    // @OneToMany(mappedBy = "doctor", fetch = FetchType.LAZY)
    // private List<MedicalRecord> medicalRecords;

    public String getFullName() {
        return user != null ? user.getFirstname() + " " + user.getLastname() : null;
    }

    public String getEmail() {
        return user != null ? user.getEmail() : null;
    }
}
