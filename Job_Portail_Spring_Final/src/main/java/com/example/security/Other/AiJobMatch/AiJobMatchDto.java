package com.example.security.Other.AiJobMatch;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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
      private Integer matchId;
    private LocalDateTime generatedAt;
    // private Integer jobId;
    private String keywordsMatched;
    // private Double matchScore;
    // private Integer userId;
}

