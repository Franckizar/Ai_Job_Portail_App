package com.example.security.Other.Application;

import lombok.AllArgsConstructor;
import lombok.Builder;

// package com.example.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationRequest {
    private Integer jobId;
    private Integer jobSeekerId;     // optional
    private Integer technicianId;    // optional
    private String resumeUrl;
    private String CoverLetter;
    private String portfolioUrl;

}

