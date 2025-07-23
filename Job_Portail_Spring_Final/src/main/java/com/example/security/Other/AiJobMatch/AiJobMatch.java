package com.example.security.Other.AiJobMatch;

// package com.example.security.ai;

import com.example.security.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;

// import com.example.security.Other.Job.Job;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.security.Other.Job.Job;;
@Entity
@Table(name = "ai_job_matches",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "job_id"}))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiJobMatch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "match_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", referencedColumnName = "job_id", nullable = false)
    private Job job;

    @Column(name = "match_score", precision = 5, scale = 2)
    private BigDecimal matchScore;

    @Column(name = "keywords_matched", columnDefinition = "TEXT")
    private String keywordsMatched;

    @Column(name = "generated_at")
    private LocalDateTime generatedAt;

    @PrePersist
    @PreUpdate
    protected void onPersistOrUpdate() {
        generatedAt = LocalDateTime.now();
    }
}
