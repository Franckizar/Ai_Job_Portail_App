package com.example.security.user.JobSeeker;

import com.example.security.Other.CV.CV;
import com.example.security.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "job_seeker_profiles")
public class JobSeeker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String fullName;
    private String bio;
    private String resumeUrl;
    private String profileImageUrl;

    @OneToOne
    @JsonIgnore
    @JoinColumn(name = "user_id", referencedColumnName = "id", unique = true)
    private User user;

    @OneToOne
    @JoinColumn(name = "cv_id")
    private CV cv;

}
