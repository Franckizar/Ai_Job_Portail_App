package com.example.security.user.Nurse;

import com.example.security.user.User;
// import com.example.security.user.Appointment.Appointment;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "Technician")
public class Technician {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    private String department;
    private String licenseNumber;
    private String shift;
    private String contactNumber;
    private String professionalEmail;
    private String photoUrl;
    private String officeNumber;
    private Integer yearsOfExperience;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String languagesSpoken;

    @Builder.Default
    private Boolean active = true;

    // @OneToMany(mappedBy = "nurse", fetch = FetchType.LAZY)
    // private List<Appointment> appointments;

    public String getFullName() {
        return user != null ? user.getFirstname() + " " + user.getLastname() : null;
    }

    public String getEmail() {
        return user != null ? user.getEmail() : null;
    }
}
