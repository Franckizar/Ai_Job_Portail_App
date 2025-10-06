package com.example.security.Other.Job;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnterpriseApplicationDTO {
    private Integer id;
    private Integer jobSeekerId;
    private Integer technicianId;
    private String candidateName;
    private String jobTitle;
    private String status;
    private LocalDateTime applicationDate;
    private Integer matchScore;
    private String experience;
    private List<String> skills;
}