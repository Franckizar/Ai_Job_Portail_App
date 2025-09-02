// ```java
package com.example.security.Other.AiJobMatch;

import com.example.security.Other.Job.JobResponse;
import com.example.security.Other.Job.JobService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/auth/ai-job-match")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AiJobMatchController {

    private static final Logger log = LoggerFactory.getLogger(AiJobMatchController.class);

    private final AiJobMatchService aiJobMatchService;
    private final JobService jobService;

    /**
     * Endpoint to trigger AI matching for all jobs for a given user and user type.
     * Example: POST /api/v1/auth/ai-job-match/match-and-save/123/jobseeker
     */
    @PostMapping("/match-and-save/{userId}/{userType}")
    public ResponseEntity<?> matchAndSaveAllJobs(
            @PathVariable Integer userId,
            @PathVariable String userType) {
        log.info("=== MATCH AND SAVE AI JOB MATCHES REQUEST START ===");
        log.info("Received POST request to match and save jobs for user ID: {}, userType: {}", userId, userType);

        try {
            List<AiJobMatch> matches = aiJobMatchService.matchAndSaveAllJobsForUser(userId, userType);
            List<AiJobMatchDto> dtos = matches.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
                    
            log.info("Successfully matched and saved {} jobs for user ID: {}", dtos.size(), userId);
            log.info("=== MATCH AND SAVE AI JOB MATCHES REQUEST END (SUCCESS) ===");
            return ResponseEntity.ok(dtos);
        } catch (IllegalArgumentException e) {
            log.warn("WARNING: Invalid request for job matching: {}", e.getMessage());
            log.info("=== MATCH AND SAVE AI JOB MATCHES REQUEST END (BAD REQUEST) ===");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("ERROR: Failed to match and save jobs for user ID: {}", userId, e);
            log.info("=== MATCH AND SAVE AI JOB MATCHES REQUEST END (ERROR) ===");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to match jobs: " + e.getMessage()));
        }
    }

    /**
     * Endpoint to fetch AI job matches for a specific user, excluding matches with score 0.
     */
    @GetMapping("/user/ai/{userId}")
    public ResponseEntity<?> getJobMatchesForUser(@PathVariable Integer userId) {
        log.info("=== GET AI JOB MATCHES REQUEST START ===");
        log.info("Received GET request for AI job matches for user ID: {}", userId);

        try {
            List<AiJobMatch> matches = aiJobMatchService.getJobMatchesForUser(userId);
            List<AiJobMatchDto> dtos = matches.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
            log.info("Successfully retrieved {} AI job matches for user ID: {}", dtos.size(), userId);
            log.info("=== GET AI JOB MATCHES REQUEST END (SUCCESS) ===");
            return ResponseEntity.ok(dtos);
        } catch (IllegalArgumentException e) {
            log.warn("WARNING: No job matches found for user ID: {}", userId);
            log.info("=== GET AI JOB MATCHES REQUEST END (NOT FOUND) ===");
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("ERROR: Failed to retrieve AI job matches for user ID: {}", userId, e);
            log.info("=== GET AI JOB MATCHES REQUEST END (ERROR) ===");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to retrieve job matches: " + e.getMessage()));
        }
    }

    private AiJobMatchDto convertToDto(AiJobMatch match) {
        AiJobMatchDto dto = new AiJobMatchDto();
        dto.setMatchId(match.getId() != null ? match.getId().intValue() : null);
        dto.setUserId(match.getUser() != null ? match.getUser().getId() : null);
        dto.setMatchScore(match.getMatchScore() != null ? match.getMatchScore() : BigDecimal.ZERO);
        dto.setKeywordsMatched(match.getKeywordsMatched());
        dto.setGeneratedAt(match.getGeneratedAt());
        
        if (match.getJob() != null) {
            JobResponse jobResponse = jobService.getJobById(match.getJob().getId());
            dto.setJob(jobResponse);
        }
        
        return dto;
    }

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", true);
        errorResponse.put("message", message);
        errorResponse.put("timestamp", System.currentTimeMillis());
        return errorResponse;
    }
}