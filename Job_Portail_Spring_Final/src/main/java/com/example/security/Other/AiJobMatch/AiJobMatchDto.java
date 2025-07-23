package com.example.security.Other.AiJobMatch;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AiJobMatchDto {
    private Integer userId;
    private Integer jobId;
    private BigDecimal matchScore;
    private String keywordsMatched; // Optional
}

