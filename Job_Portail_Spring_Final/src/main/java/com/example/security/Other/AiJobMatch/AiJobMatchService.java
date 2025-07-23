package com.example.security.Other.AiJobMatch;

import com.example.security.Other.CV.CV;
import com.example.security.Other.CV.CVService;
import com.example.security.Other.Job.Job;
import com.example.security.Other.Job.JobRepository;
import com.example.security.Other.Job.JobResponse;
import com.example.security.Other.Job.JobService;
import com.example.security.user.User;
import com.example.security.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.*;

@Service
@RestController
@RequestMapping("/api/v1/auth/ai-job-match")
@RequiredArgsConstructor
public class AiJobMatchService {

    private final AiJobMatchRepository aiJobMatchRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final CVService cvService;
    private final JobService jobService;
    private final RestTemplate restTemplate;

    // Ollama config
    private static final String OLLAMA_URL = "http://localhost:11434/api/generate";
    private static final String OLLAMA_MODEL = "Models"; // replace with your actual AI model name

    /**
     * POST endpoint to save match data from DTO
     */
    @PostMapping("/save")
    public ResponseEntity<?> saveMatch(@RequestBody AiJobMatchDto matchDto) {
        Optional<User> userOpt = userRepository.findById(matchDto.getUserId());
        Optional<Job> jobOpt = jobRepository.findById(matchDto.getJobId());

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        if (jobOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Job not found");
        }

        AiJobMatch match = AiJobMatch.builder()
                .user(userOpt.get())
                .job(jobOpt.get())
                .matchScore(matchDto.getMatchScore())
                .keywordsMatched(matchDto.getKeywordsMatched())
                .build();

        aiJobMatchRepository.save(match);
        return ResponseEntity.ok("Match saved");
    }

    /**
     * Matches all jobs with user's CV text, saves results, and returns saved matches.
     * Assumes jobService.getAllJobs() returns List<JobResponse>.
     */
    // @PostMapping("/match-and-save/{userId}/{userType}")
    public List<AiJobMatch> matchAndSaveAllJobsForUser(
            @PathVariable Integer userId,
            @PathVariable String userType) {

        // 1. Fetch CV text
        CV cv = cvService.getCVByUserId(userId, userType);
        String cvText = cv.getCvText();
        if (cvText == null || cvText.isEmpty()) {
            throw new IllegalArgumentException("User CV text is empty");
        }

        // 2. Get all job responses (DTOs)
        List<JobResponse> jobResponses = jobService.getAllJobs();

        List<AiJobMatch> savedMatches = new ArrayList<>();

        for (JobResponse jobResp : jobResponses) {
            // 3. Load corresponding Job entity to preserve integrity
            Job jobEntity = jobRepository.findById(jobResp.getId())
                    .orElse(null);
            if (jobEntity == null) {
                // Skip jobs not found in DB
                continue;
            }

            // 4. Call AI model to get a match score
            double score = callOllamaModel(cvText, jobResp);

            // 5. Obtain user from CV owner
            User user = (cv.getJobSeeker() != null)
                    ? cv.getJobSeeker().getUser()
                    : (cv.getTechnician() != null ? cv.getTechnician().getUser() : null);
            if (user == null) {
                throw new IllegalStateException("No User associated with CV");
            }

            // 6. Create and save AiJobMatch
            AiJobMatch match = AiJobMatch.builder()
                    .user(user)
                    .job(jobEntity)
                    .matchScore(BigDecimal.valueOf(score))
                    .keywordsMatched("") // optional if you have keywords
                    .build();

            aiJobMatchRepository.save(match);
            savedMatches.add(match);
        }

        return savedMatches;
    }

    /**
     * Calls the Ollama AI model REST API to get a match score between CV text and job offer details.
     */
    private double callOllamaModel(String cvText, JobResponse job) {
        String prompt = buildPrompt(cvText, job);

        Map<String, Object> body = new HashMap<>();
        body.put("model", OLLAMA_MODEL);
        body.put("prompt", prompt);
        body.put("stream", false);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(OLLAMA_URL, requestEntity, Map.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            String rawResponse = (String) response.getBody().get("response");
            if (rawResponse == null) {
                throw new RuntimeException("No AI response content");
            }
            rawResponse = rawResponse.trim();

            // Try to parse float score from raw response
            try {
                return Double.parseDouble(rawResponse);
            } catch (NumberFormatException e) {
                for (String token : rawResponse.split("\\s+")) {
                    try {
                        return Double.parseDouble(token);
                    } catch (NumberFormatException ignored) {}
                }
                throw new RuntimeException("Could not parse AI score from response: " + rawResponse);
            }
        } else {
            throw new RuntimeException("AI service HTTP error: " + response.getStatusCode());
        }
    }

    /**
     * Builds the textual prompt sent to the AI for scoring.
     */
 private String buildPrompt(String cvText, JobResponse job) {
    return String.format("""
            Evaluate how well this CV matches the following job offer. Return only a score (float) between 0 (no match) and 1 (perfect match).

            CV:
            %s

            Job Offer:
            Title: %s
            Company: %s
            Location: %s

            Score:
            """, cvText, job.getTitle(), job.getEmployerName(), job.getCity());
}

}
