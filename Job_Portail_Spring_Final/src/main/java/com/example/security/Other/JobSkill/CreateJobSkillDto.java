package com.example.security.Other.JobSkill;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
// DTO to receive skill info (id + required flag)
public class CreateJobSkillDto {
    private Integer skillId;
    private Boolean required;
    // getters/setters
}

// DTO for job creation request
