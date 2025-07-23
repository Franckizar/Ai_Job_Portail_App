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
import java.time.LocalDateTime;
import java.util.*;
@Service
@RequiredArgsConstructor
public class AiJobMatchService {

    private final AiJobMatchRepository aiJobMatchRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final CVService cvService;
    private final JobService jobService;
    private final RestTemplate restTemplate;

    private static final String OLLAMA_URL = "http://localhost:11434/api/generate";
    private static final String OLLAMA_MODEL = "Models"; // replace with your actual AI model name

    /**
     * Matches all jobs with user's CV, creates or updates AiJobMatch records.
     */
    public List<AiJobMatch> matchAndSaveAllJobsForUser(Integer userId, String userType) {
        CV cv = cvService.getCVByUserId(userId, userType);
        if (cv.getCvText() == null || cv.getCvText().isEmpty()) {
            throw new IllegalArgumentException("User CV text is empty");
        }

        List<JobResponse> jobResponses = jobService.getAllJobs();
        List<AiJobMatch> savedMatches = new ArrayList<>();

        User user = extractUserFromCV(cv);
        if (user == null) {
            throw new IllegalStateException("No User associated with CV");
        }

        for (JobResponse jobResp : jobResponses) {
            Job jobEntity = jobRepository.findById(jobResp.getId()).orElse(null);
            if (jobEntity == null) {
                continue;  // skip missing jobs in DB
            }

            double score = callOllamaModel(cv.getCvText(), jobResp);

            // Check if match exists for this user and job
            Optional<AiJobMatch> existingMatchOpt = aiJobMatchRepository.findByUserAndJob(user, jobEntity);
            AiJobMatch match;
            if (existingMatchOpt.isPresent()) {
                // Update existing match
                match = existingMatchOpt.get();
                match.setMatchScore(BigDecimal.valueOf(score));
                match.setGeneratedAt(LocalDateTime.now());
                // Optionally update keywords
                match.setKeywordsMatched(""); 
            } else {
                // Create new match
                match = AiJobMatch.builder()
                        .user(user)
                        .job(jobEntity)
                        .matchScore(BigDecimal.valueOf(score))
                        .keywordsMatched("")
                        .build();
            }

            aiJobMatchRepository.save(match);
            savedMatches.add(match);
        }
        return savedMatches;
    }

    private User extractUserFromCV(CV cv) {
        if (cv.getJobSeeker() != null) {
            return cv.getJobSeeker().getUser();
        } else if (cv.getTechnician() != null) {
            return cv.getTechnician().getUser();
        }
        return null;
    }

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

    private String buildPrompt(String cvText, JobResponse job) {
        return String.format("""
                Evaluate how well this CV matches the following job offer. Return only a score (float) between 0 and 1.

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
