package com.example.security.Other.AiJobMatch;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<List<AiJobMatch>> matchAndSaveAllJobs(
            @PathVariable Integer userId,
            @PathVariable String userType) {

        try {
            List<AiJobMatch> matches = aiJobMatchService.matchAndSaveAllJobsForUser(userId, userType);
            return ResponseEntity.ok(matches);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(null);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(null);
        }
    }
}
