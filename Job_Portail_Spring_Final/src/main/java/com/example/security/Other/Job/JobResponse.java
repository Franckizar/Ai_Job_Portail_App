package com.example.security.Other.Job;

import lombok.Data;

import java.util.List;

@Data
public class JobResponse {
    private Integer id;
    private String title;
    private String description;
    private Job.JobType type;
    private Integer salaryMin;
    private Integer salaryMax;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private String addressLine1;
    private String addressLine2;
    private String employerName;
    private Integer enterpriseId;
    private Integer personalEmployerId;
    private JobCategoryDto category;
    private List<JobSkillDto> skills;
    private Job.JobStatus status;
    private String createdAt; // formatted as string for frontend

    @Data
    public static class JobCategoryDto {
        private Integer id;
        private String name;
        private String description;
    }
    // Lombok @Data provides getter/setter automatically

    @Data
    public static class JobSkillDto {
        private Integer skillId;
        private String skillName;
        private Boolean required;
    }

    // Remove or delete the unimplemented getEmployerName() method
}
