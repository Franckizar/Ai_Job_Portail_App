package com.example.security.Other.Rating;

import com.example.security.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ratings")
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // The user who is giving the rating
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rater_id", nullable = false)
    @JsonIgnore
    private User rater;

    // The user who is being rated (JobSeeker or Technician)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rated_user_id", nullable = false)
    @JsonIgnore
    private User ratedUser;

    // Rating value (1-5 stars)
    @Column(nullable = false)
    private Integer rating;

    // Optional comment/review
    @Column(columnDefinition = "TEXT")
    private String comment;

    // Category of rating (WORK_QUALITY, COMMUNICATION, PROFESSIONALISM, etc.)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RatingCategory category;

    // Type of user being rated
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RatedUserType ratedUserType;

    @Builder.Default
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Prevent duplicate ratings from same rater to same user for same category
    @PrePersist
    @PreUpdate
    public void updateTimestamp() {
        this.updatedAt = LocalDateTime.now();
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    public enum RatingCategory {
        WORK_QUALITY("Work Quality"),
        COMMUNICATION("Communication"),
        PROFESSIONALISM("Professionalism"),
        PUNCTUALITY("Punctuality"),
        TECHNICAL_SKILLS("Technical Skills"),
        OVERALL("Overall Experience");

        private final String displayName;

        RatingCategory(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    public enum RatedUserType {
        JOB_SEEKER,
        TECHNICIAN
    }

    // Helper methods
    public String getRaterName() {
        return rater != null ? rater.getFirstname() + " " + rater.getLastname() : "Anonymous";
    }

    public String getRatedUserName() {
        return ratedUser != null ? ratedUser.getFirstname() + " " + ratedUser.getLastname() : "Unknown";
    }

    public String getRaterEmail() {
        return rater != null ? rater.getEmail() : null;
    }

    public String getRatedUserEmail() {
        return ratedUser != null ? ratedUser.getEmail() : null;
    }
}