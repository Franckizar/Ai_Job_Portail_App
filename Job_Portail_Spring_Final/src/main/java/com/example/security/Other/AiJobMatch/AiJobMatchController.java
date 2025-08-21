package com.example.security.Other.AiJobMatch;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/auth/ai-job-match")
@RequiredArgsConstructor
public class AiJobMatchController {

    private final AiJobMatchService aiJobMatchService;

    /**
     * Endpoint to trigger AI matching for all jobs for a given user and user type.
     * 
     * Example:
     * POST /api/v1/auth/ai-job-match/match-and-save/123/jobseeker
     */
    @PostMapping("/match-and-save/{userId}/{userType}")
    public ResponseEntity<List<AiJobMatchDto>> matchAndSaveAllJobs(
            @PathVariable Integer userId,
            @PathVariable String userType) {

        try {
            List<AiJobMatch> matches = aiJobMatchService.matchAndSaveAllJobsForUser(userId, userType);
            
            // Convert entities to DTOs
            List<AiJobMatchDto> dtos = matches.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
                    
            return ResponseEntity.ok(dtos);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    // Helper method to convert AiJobMatch to AiJobMatchDto
    private AiJobMatchDto convertToDto(AiJobMatch match) {
        AiJobMatchDto dto = new AiJobMatchDto();
        
        // Set basic fields
        dto.setMatchId(match.getId() != null ? match.getId().intValue() : null);
        dto.setGeneratedAt(match.getGeneratedAt());
        dto.setKeywordsMatched(match.getKeywordsMatched());
        
        // Handle match score
        if (match.getMatchScore() != null) {
            dto.setMatchScore(match.getMatchScore());
        } else {
            dto.setMatchScore(BigDecimal.ZERO);
        }
        
        // Extract job ID (using getId() instead of getJobId())
        if (match.getJob() != null && match.getJob().getId() != null) {
            dto.setJobId(match.getJob().getId());
        }
        
        // Extract user ID
        if (match.getUser() != null && match.getUser().getId() != null) {
            dto.setUserId(match.getUser().getId().intValue());
        }
        
        return dto;
    }
}