package com.example.security.Other.Job;

import com.example.security.Other.Application.Application;
import com.example.security.Other.AiJobMatch.AiJobMatch;
import com.example.security.Other.JobSkill.JobSkill;
import com.example.security.user.Enterprise.Enterprise;
import com.example.security.user.PersonalEmployerProfile.PersonalEmployerProfile;
// import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;
import lombok.extern.slf4j.Slf4j;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "jobs")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enterprise_id", referencedColumnName = "id")
    @JsonIgnore
    private Enterprise enterprise;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private JobType type;

    @Column(name = "salary_min", precision = 10, scale = 2)
    private BigDecimal salaryMin;

    @Column(name = "salary_max", precision = 10, scale = 2)
    private BigDecimal salaryMax;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private JobStatus status = JobStatus.ACTIVE;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(name = "address_line1")
    private String addressLine1;

    @Column(name = "address_line2")
    private String addressLine2;

    private String city;

    private String state;
    private String employerName;

    @Column(name = "postal_code")
    private String postalCode;

    private String country;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @JsonIgnore
    private List<Application> applications = new ArrayList<>();

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @JsonIgnore
    private List<AiJobMatch> aiJobMatches = new ArrayList<>();

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    // @JsonBackReference
    // @JsonIgnore
    @JsonIgnore
    private List<JobSkill> jobSkills = new ArrayList<>();

        @ManyToOne
    @JoinColumn(name = "personal_employer_id")
    @JsonIgnore
    private PersonalEmployerProfile personalEmployer;


    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        log.info("Job pre-persist called, createdAt set to {}", createdAt);
    }

    @PreUpdate
    protected void onUpdate() {
        log.info("Job pre-update called for job id {}", id);
    }

    @PostLoad
    protected void onLoad() {
        log.info("Job loaded with id {}", id);
    }

    public enum JobType {
        FULL_TIME, PART_TIME, INTERNSHIP
    }

    public enum JobStatus {
        ACTIVE, CLOSED
    }
}
