package com.example.security.Other.Application;

import com.example.security.Other.Application.Application;
import com.example.security.Other.Job.Job;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class JobSeekerApplicationDTO {

    private Integer applicationId;
    private Integer jobId;
    private String jobTitle;
    private String companyName;      // from Enterprise or PersonalEmployer
    private String jobCity;
    private String jobCountry;
    private Application.ApplicationStatus status;
    private LocalDateTime appliedAt;

    private String resumeUrl;
    private String portfolioUrl;

    public JobSeekerApplicationDTO(Application application) {
        this.applicationId = application.getId();
        this.status = application.getStatus();
        this.appliedAt = application.getAppliedAt();           // ✅ use appliedAt
        this.resumeUrl = application.getResumeUrl();
        this.portfolioUrl = application.getPortfolioUrl();

        Job job = application.getJob();
        if (job != null) {
            this.jobId = job.getId();
            this.jobTitle = job.getTitle();
            this.jobCity = job.getCity();
            this.jobCountry = job.getCountry();

            // ✅ Choose company name based on the job's employer type
            if (job.getEnterprise() != null) {
                this.companyName = job.getEnterprise().getName();   // Adjust if field differs
            } else if (job.getPersonalEmployer() != null) {
                this.companyName = job.getPersonalEmployer().getDisplayName(); // ✅ use displayName
            } else {
                this.companyName = "N/A";
            }
        }
    }
}
