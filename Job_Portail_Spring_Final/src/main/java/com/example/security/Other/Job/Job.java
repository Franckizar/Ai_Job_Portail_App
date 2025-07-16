// 2. Job.java
package com.example.security.Other.Job;

import com.example.security.Other.AiJobMatch.AiJobMatch;
import com.example.security.Other.Application.Application;
import com.example.security.Other.JobSkill.JobSkill;
import com.example.security.user.Enterprise.Enterprise;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enterprise_id", referencedColumnName = "id")
    private Enterprise enterprise;

    private String title;
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

    @Column(name = "postal_code")
    private String postalCode;

    private String country;

    // Relationships
    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Application> applications;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AiJobMatch> aiJobMatches;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<JobSkill> jobSkills;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum JobType {
        FULL_TIME("full-time"),
        PART_TIME("part-time"),
        INTERNSHIP("internship");

        private final String value;

        JobType(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }

    public enum JobStatus {
        ACTIVE("active"),
        CLOSED("closed");

        private final String value;

        JobStatus(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}
