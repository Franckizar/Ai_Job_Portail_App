package com.example.security.Other.Job;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Builder;
import lombok.Data;



// EnterpriseApplicationDTO.java  
@Data
@Builder
public class EnterpriseApplicationDTO {
    private Integer id;
    private String candidateName;
    private String jobTitle;
    private String status;
    private LocalDateTime applicationDate;
    private Integer matchScore;
    private String experience;
    private List<String> skills;
}

