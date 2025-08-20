package com.example.security.user.PersonalEmployerProfile;

import com.example.security.Other.Job.Job;
import com.example.security.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "personal_employer_profiles")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class PersonalEmployerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String displayName;         // As user wants to show
    private String bio;                 // Short description, optional
    private String profileImageUrl;     // Avatar or photo
    private String contactNumber;       // Optional

    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String postalCode;
    private String country;

    private Double latitude;
    private Double longitude;

    @OneToMany(mappedBy = "personalEmployer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Job> jobs;

    @OneToOne
    @JsonIgnore
    @JoinColumn(name = "user_id", referencedColumnName = "id", unique = true)
    private User user;
}
