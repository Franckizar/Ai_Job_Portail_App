package com.example.security.Other.AiJobMatch;

// package com.example.security.ai;

import com.example.security.user.User;
// import com.example.security.Other.Job.Job;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.security.Other.Job.Job;;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ai_job_matches")
public class AiJobMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "match_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", referencedColumnName = "job_id")
    private Job job;

    @Column(name = "match_score", precision = 5, scale = 2)
    private BigDecimal matchScore;

    @Column(name = "keywords_matched", columnDefinition = "TEXT")
    private String keywordsMatched;

    @Column(name = "generated_at")
    private LocalDateTime generatedAt;

    @PrePersist
    protected void onCreate() {
        generatedAt = LocalDateTime.now();
    }
}
