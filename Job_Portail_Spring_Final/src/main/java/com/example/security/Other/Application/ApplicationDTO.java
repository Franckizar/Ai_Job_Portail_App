package com.example.security.Other.Application;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

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
    private Integer jobId;

    // Additional fields for job seeker dashboard
    private Integer jobSeekerId;
    private Integer technicianId;
    private String jobTitle;
    private String companyName;
    private String jobLocation;
    private String jobType;
    private Double salaryMin;
    private Double salaryMax;

    // Constructor to convert Application entity to DTO
    public ApplicationDTO(Application application) {
        this.id = application.getId();
        this.resumeUrl = application.getResumeUrl();
        this.portfolioUrl = application.getPortfolioUrl();
        this.status = application.getStatus().name();
        this.appliedAt = application.getAppliedAt();
        this.coverLetter = application.getCoverLetter();
        this.jobId = application.getJob() != null ? application.getJob().getId() : null;

        // Set job seeker or technician ID
        if (application.getJobSeeker() != null) {
            this.jobSeekerId = application.getJobSeeker().getId();
        }
        if (application.getTechnician() != null) {
            this.technicianId = application.getTechnician().getId();
        }

        // Set job details
        if (application.getJob() != null) {
            this.jobTitle = application.getJob().getTitle();
            this.jobLocation = application.getJob().getCity() + ", " + application.getJob().getState();
            this.jobType = application.getJob().getType() != null ? application.getJob().getType().toString() : null;
            // BigDecimal to Double handling for salary fields
            this.salaryMin = (application.getJob().getSalaryMin() != null) ? application.getJob().getSalaryMin().doubleValue() : null;
            this.salaryMax = (application.getJob().getSalaryMax() != null) ? application.getJob().getSalaryMax().doubleValue() : null;

            // Set company name based on employer type
            if (application.getJob().getEnterprise() != null) {
                this.companyName = application.getJob().getEnterprise().getName();
            } else if (application.getJob().getPersonalEmployer() != null) {
                this.companyName = application.getJob().getPersonalEmployer().getUser().getFirstname() + " " +
                        application.getJob().getPersonalEmployer().getUser().getLastname();
            }
        }
    }
}
