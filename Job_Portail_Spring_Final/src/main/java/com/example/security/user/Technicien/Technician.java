    package com.example.security.user.Technicien;

    import com.example.security.user.User;
    import jakarta.persistence.*;
    import lombok.*;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @Entity
    @Table(name = "technician_profiles")
    public class Technician {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Integer id;

        @OneToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "user_id", referencedColumnName = "id", unique = true, nullable = false)
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
        @Column(nullable = false)
        private Boolean active;

        // example extra fields for TechnicianResponse
        private String technicianLevel;
        private String certifications;

        public String getFullName() {
            return user != null ? user.getFirstname() + " " + user.getLastname() : null;
        }

        public String getEmail() {
            return user != null ? user.getEmail() : null;
        }
    }
