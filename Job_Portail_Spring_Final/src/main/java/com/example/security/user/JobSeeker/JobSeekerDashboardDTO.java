package com.example.security.user.JobSeeker;

import com.example.security.Other.Application.ApplicationDTO;
import com.example.security.Other.Job.JobResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobSeekerDashboardDTO {
    private JobSeekerProfile profile;
    private List<ApplicationDTO> applications;
    private int totalApplications;
    private int pendingApplications;
    private int acceptedApplications;
    private int rejectedApplications;
    private List<JobResponse> recommendedJobs;
}