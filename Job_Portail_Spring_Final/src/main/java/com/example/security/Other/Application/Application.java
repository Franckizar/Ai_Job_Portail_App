package com.example.security.Other.Application;



import com.example.security.user.User;
// import com.example.security.Other.Job.Job;
import com.example.security.Other.Payment.Payment;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

import com.example.security.Other.Job.Job;;

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
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", referencedColumnName = "job_id")
    private Job job;

    @Column(name = "cover_letter", columnDefinition = "TEXT")
    private String coverLetter;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.SUBMITTED;

    @Column(name = "applied_at")
    private LocalDateTime appliedAt;

    // Relationships
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Payment> payments;

    @PrePersist
    protected void onCreate() {
        appliedAt = LocalDateTime.now();
    }

    public enum ApplicationStatus {
        SUBMITTED("submitted"),
        REVIEWED("reviewed"),
        SHORTLISTED("shortlisted"),
        REJECTED("rejected");

        private final String value;

        ApplicationStatus(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}
