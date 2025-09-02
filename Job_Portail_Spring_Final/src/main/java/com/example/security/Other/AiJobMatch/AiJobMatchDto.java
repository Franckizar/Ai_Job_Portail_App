// ```java
package com.example.security.Other.AiJobMatch;

import com.example.security.Other.Job.JobResponse;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AiJobMatchDto {
    private Integer matchId;
    private Integer userId;
    private JobResponse job;
    private BigDecimal matchScore;
    private String keywordsMatched;
    private LocalDateTime generatedAt;
}