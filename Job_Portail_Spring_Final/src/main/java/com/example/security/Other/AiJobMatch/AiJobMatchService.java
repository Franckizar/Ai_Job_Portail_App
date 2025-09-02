// ```javacls
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class AiJobMatchService {

    private static final Logger log = LoggerFactory.getLogger(AiJobMatchService.class);

    private final AiJobMatchRepository aiJobMatchRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final CVService cvService;
    private final JobService jobService;
    private final RestTemplate restTemplate;

    private static final String OLLAMA_URL = "http://localhost:11434/api/generate";
    private static final String OLLAMA_MODEL = "Models"; // Replace with your actual AI model name

    /**
     * Matches all jobs with user's CV, creates or updates AiJobMatch records.
     */
    public List<AiJobMatch> matchAndSaveAllJobsForUser(Integer userId, String userType) {
        log.info("Matching jobs for user ID: {} with user type: {}", userId, userType);
        CV cv = cvService.getCVByUserId(userId, userType);
        if (cv.getCvText() == null || cv.getCvText().isEmpty()) {
            log.error("User CV text is empty for user ID: {}", userId);
            throw new IllegalArgumentException("User CV text is empty");
        }

        List<JobResponse> jobResponses = jobService.getAllJobs();
        List<AiJobMatch> savedMatches = new ArrayList<>();

        User user = extractUserFromCV(cv);
        if (user == null) {
            log.error("No User associated with CV for user ID: {}", userId);
            throw new IllegalStateException("No User associated with CV");
        }

        for (JobResponse jobResp : jobResponses) {
            Job jobEntity = jobRepository.findById(jobResp.getId()).orElse(null);
            if (jobEntity == null) {
                log.warn("Job not found in DB for job ID: {}", jobResp.getId());
                continue; // Skip missing jobs
            }

            double score = callOllamaModel(cv.getCvText(), jobResp);
            log.info("Generated match score: {} for job ID: {}", score, jobResp.getId());

            // Check if match exists for this user and job
            Optional<AiJobMatch> existingMatchOpt = aiJobMatchRepository.findByUserAndJob(user, jobEntity);
            AiJobMatch match;
            if (existingMatchOpt.isPresent()) {
                // Update existing match
                match = existingMatchOpt.get();
                match.setMatchScore(BigDecimal.valueOf(score));
                match.setGeneratedAt(LocalDateTime.now());
                match.setKeywordsMatched("");
                log.info("Updated existing match for user ID: {}, job ID: {}", userId, jobResp.getId());
            } else {
                // Create new match
                match = AiJobMatch.builder()
                        .user(user)
                        .job(jobEntity)
                        .matchScore(BigDecimal.valueOf(score))
                        .keywordsMatched("")
                        .build();
                log.info("Created new match for user ID: {}, job ID: {}", userId, jobResp.getId());
            }

            aiJobMatchRepository.save(match);
            savedMatches.add(match);
        }
        log.info("Saved {} job matches for user ID: {}", savedMatches.size(), userId);
        return savedMatches;
    }

    /**
     * Fetches AI job matches for a specific user, excluding matches with a score of 0.
     */
    @Transactional(readOnly = true)
    public List<AiJobMatch> getJobMatchesForUser(Integer userId) {
        log.info("Fetching AI job matches for user ID: {}", userId);
        
        if (userId == null) {
            log.error("User ID must be provided");
            throw new IllegalArgumentException("User ID must be provided");
        }

        List<AiJobMatch> matches = aiJobMatchRepository.findByUserIdAndMatchScoreGreaterThan(
            userId, BigDecimal.ZERO);

        if (matches.isEmpty()) {
            log.warn("No job matches found for user ID: {} with score greater than 0", userId);
            throw new IllegalArgumentException("No job matches found for user ID: " + userId);
        }

        log.info("Retrieved {} job matches for user ID: {}", matches.size(), userId);
        return matches;
    }

    private User extractUserFromCV(CV cv) {
        if (cv.getJobSeeker() != null) {
            log.info("Extracted user from JobSeeker CV");
            return cv.getJobSeeker().getUser();
        } else if (cv.getTechnician() != null) {
            log.info("Extracted user from Technician CV");
            return cv.getTechnician().getUser();
        }
        log.warn("No user associated with CV");
        return null;
    }

    private double callOllamaModel(String cvText, JobResponse job) {
        log.info("Calling Ollama model for CV matching with job ID: {}", job.getId());
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
                log.error("No AI response content");
                throw new RuntimeException("No AI response content");
            }
            rawResponse = rawResponse.trim();

            try {
                double score = Double.parseDouble(rawResponse);
                log.info("Parsed AI score: {}", score);
                return score;
            } catch (NumberFormatException e) {
                for (String token : rawResponse.split("\\s+")) {
                    try {
                        double score = Double.parseDouble(token);
                        log.info("Parsed AI score from token: {}", score);
                        return score;
                    } catch (NumberFormatException ignored) {}
                }
                log.error("Could not parse AI score from response: {}", rawResponse);
                throw new RuntimeException("Could not parse AI score from response: " + rawResponse);
            }
        } else {
            log.error("AI service HTTP error: {}", response.getStatusCode());
            throw new RuntimeException("AI service HTTP error: " + response.getStatusCode());
        }
    }

    private String buildPrompt(String cvText, JobResponse job) {
        String prompt = String.format("""
                Evaluate how well this CV matches the following job offer. Return only a score (float) between 0 and 1.

                CV:
                %s

                Job Offer:
                Title: %s
                Company: %s
                Location: %s

                Score:
                """, cvText, job.getTitle(), job.getEmployerName(), job.getCity());
        log.info("Built prompt for job ID: {}", job.getId());
        return prompt;
    }
}