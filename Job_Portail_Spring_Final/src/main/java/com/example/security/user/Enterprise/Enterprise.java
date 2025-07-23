package com.example.security.user.Enterprise;

import java.util.List;

import com.example.security.Other.Job.Job;
import com.example.security.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "enterprise_profiles")
public class Enterprise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String industry;
    private String description;
    private String website;
    private String logoUrl;

    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String postalCode;
    private String country;

    private Double latitude;
    private Double longitude;

    @OneToMany(mappedBy = "enterprise", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    // @Builder.Default
    private List<Job> jobs;


    @OneToOne
    @JsonIgnore
    @JoinColumn(name = "user_id", referencedColumnName = "id", unique = true)
    private User user;
}
