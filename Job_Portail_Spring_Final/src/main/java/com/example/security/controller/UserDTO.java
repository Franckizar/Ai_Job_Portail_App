package com.example.security.controller;
import com.example.security.user.Admin.Admin;
import com.example.security.user.Enterprise.Enterprise;
import com.example.security.user.JobSeeker.JobSeeker;
import com.example.security.user.Technicien.Technician;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private boolean emailVerified;
    private LocalDateTime createdAt;
    
    // Profile IDs based on role
    private Long adminId;
    private Long technicianId;
    private Long jobSeekerId;
    private Long enterpriseId;
    
    // Role information
    private Set<String> roles;
    
    // Profile details (optional - include if needed)
    private Admin adminProfile;
    private Technician technicianProfile;
    private JobSeeker jobSeekerProfile;
    private Enterprise enterpriseProfile;

    }
