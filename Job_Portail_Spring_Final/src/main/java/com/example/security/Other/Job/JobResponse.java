package com.example.security.Other.Job;

import lombok.Data;

import java.util.List;

@Data
public class JobResponse {
    private Long id;
    private String title;
    private String description;
    private String type;
    private Integer salaryMin;
    private Integer salaryMax;
    private String city;
    private String country;
    private List<JobSkillDto> skills;

    @Data
    public static class JobSkillDto {
        private Long skillId;
        private String skillName;
        private Boolean required;
    }
}
