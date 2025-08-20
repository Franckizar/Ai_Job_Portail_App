package com.example.security.Other.Application;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationDTO {
    private Integer id;
    private String resumeUrl;
    private String portfolioUrl;
    private String status;
    private LocalDateTime appliedAt;
    private String coverLetter;
    private Integer jobId; // Add this field

    // Constructor to convert Application entity to DTO
    public ApplicationDTO(Application application) {
        this.id = application.getId();
        this.resumeUrl = application.getResumeUrl();
        this.portfolioUrl = application.getPortfolioUrl();
        this.status = application.getStatus().name();
        this.appliedAt = application.getAppliedAt();
        this.coverLetter = application.getCoverLetter();
        this.jobId = application.getJob() != null ? application.getJob().getId() : null;
    }

    // getters and setters ...
}
