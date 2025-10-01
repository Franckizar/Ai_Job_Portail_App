package com.example.security.Other.Job;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Builder;
import lombok.Data;

// EnterpriseStatsDTO.java
@Data
@Builder
public class EnterpriseStatsDTO {
    private Long activeJobs;
    private Long totalApplications;
    private Long interviewsScheduled;
    private Long hiredThisMonth;
    private Long profileViews;
    private Integer responseRate;
    private LocalDate premiumUntil;
}
