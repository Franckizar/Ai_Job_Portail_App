package com.example.security.Other.JobSkill;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public class JobSkillDto {
        private Integer skillId;
        private String skillName;
        private Boolean required;
    }
