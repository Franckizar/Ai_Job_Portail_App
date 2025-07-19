package com.example.security.Other.Application;

import com.example.security.Other.Job.Job;
import com.example.security.user.JobSeeker.JobSeeker;
import com.example.security.user.Technicien.Technician;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    // @JsonIgnore
    private Job job;  // Job now Puses Integer id

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_seeker_id")
    @JsonIgnore
    private JobSeeker jobSeeker;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "technician_id")
    @JsonIgnore
    private Technician technician;

    @Column(name = "resume_url")
    private String resumeUrl;

    @Column(name = "portfolio_url")
    private String portfolioUrl;

    @Column(name = "cover_letter", columnDefinition = "TEXT")
    private String CoverLetter;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.SUBMITTED;

    @Column(name = "applied_at")
    private LocalDateTime appliedAt;

    @PrePersist
    public void prePersist() {
        if (appliedAt == null) appliedAt = LocalDateTime.now();
    }

    public enum ApplicationStatus {
        SUBMITTED, REVIEWED, SHORTLISTED, REJECTED, ACCEPTED
    }


    
}


