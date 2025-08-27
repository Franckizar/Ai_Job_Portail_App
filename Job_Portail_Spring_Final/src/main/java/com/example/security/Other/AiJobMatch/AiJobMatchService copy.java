// package com.example.security.Other.AiJobMatch;

// import com.example.security.Other.CV.CV;
// import com.example.security.Other.CV.CVService;
// import com.example.security.Other.Job.Job;
// import com.example.security.Other.Job.JobResponse;
// import com.example.security.Other.Job.JobRepository;
// import com.example.security.Other.Job.JobService;
// import com.example.security.user.User;
// import com.example.security.UserRepository;
// import lombok.RequiredArgsConstructor;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.http.HttpEntity;
// import org.springframework.http.HttpHeaders;
// import org.springframework.http.MediaType;
// import org.springframework.http.ResponseEntity;
// import org.springframework.stereotype.Service;
// import org.springframework.web.client.RestTemplate;

// import java.math.BigDecimal;
// import java.time.LocalDateTime;
// import java.util.*;

// @Service
// @RequiredArgsConstructor
// public class AiJobMatchService {

//     private static final Logger logger = LoggerFactory.getLogger(AiJobMatchService.class);

//     private final AiJobMatchRepository aiJobMatchRepository;
//     private final UserRepository userRepository;
//     private final JobRepository jobRepository;
//     private final CVService cvService;
//     private final JobService jobService;
//     private final RestTemplate restTemplate;

//     @Value("${gemini.api.key:AIzaSyBOKFibn4Rbh54Fxzo8LKZ09pVboZsCHwU}")
//     private String geminiApiKey;

//     private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

//     /**
//      * Matches all jobs with user's CV, creates or updates AiJobMatch records.
//      */
//     public List<AiJobMatch> matchAndSaveAllJobsForUser(Integer userId, String userType) {
//         logger.info("Starting job matching for userId: {}, userType: {}", userId, userType);
//         CV cv = cvService.getCVByUserId(userId, userType);
//         if (cv == null || cv.getCvText() == null || cv.getCvText().isEmpty()) {
//             logger.error("User CV is null or empty for userId: {}", userId);
//             throw new IllegalArgumentException("User CV text is empty or CV not found");
//         }

//         List<JobResponse> jobResponses = jobService.getAllJobs();
//         if (jobResponses.isEmpty()) {
//             logger.warn("No jobs found for matching");
//             return new ArrayList<>();
//         }

//         List<AiJobMatch> savedMatches = new ArrayList<>();
//         User user = extractUserFromCV(cv);
//         if (user == null) {
//             logger.error("No User associated with CV for userId: {}", userId);
//             throw new IllegalStateException("No User associated with CV");
//         }

//         for (JobResponse jobResp : jobResponses) {
//             Job jobEntity = jobRepository.findById(jobResp.getId()).orElse(null);
//             if (jobEntity == null) {
//                 logger.warn("Job with ID {} not found in database, skipping", jobResp.getId());
//                 continue;
//             }

//             try {
//                 double score = callGeminiModel(cv.getCvText(), jobResp);
//                 Optional<AiJobMatch> existingMatchOpt = aiJobMatchRepository.findByUserAndJob(user, jobEntity);
//                 AiJobMatch match;
//                 if (existingMatchOpt.isPresent()) {
//                     match = existingMatchOpt.get();
//                     match.setMatchScore(BigDecimal.valueOf(score));
//                     match.setGeneratedAt(LocalDateTime.now());
//                     match.setKeywordsMatched("");
//                     logger.info("Updated existing match for userId: {}, jobId: {}, score: {}", userId, jobResp.getId(), score);
//                 } else {
//                     match = AiJobMatch.builder()
//                             .user(user)
//                             .job(jobEntity)
//                             .matchScore(BigDecimal.valueOf(score))
//                             .keywordsMatched("")
//                             .build();
//                     logger.info("Created new match for userId: {}, jobId: {}, score: {}", userId, jobResp.getId(), score);
//                 }

//                 aiJobMatchRepository.save(match);
//                 savedMatches.add(match);
//             } catch (Exception e) {
//                 logger.error("Error processing job match for jobId: {}: {}", jobResp.getId(), e.getMessage(), e);
//                 continue; // Skip to next job on error
//             }
//         }
//         logger.info("Completed job matching for userId: {}, matches saved: {}", userId, savedMatches.size());
//         return savedMatches;
//     }

//     private User extractUserFromCV(CV cv) {
//         if (cv.getJobSeeker() != null) {
//             return cv.getJobSeeker().getUser();
//         } else if (cv.getTechnician() != null) {
//             return cv.getTechnician().getUser();
//         }
//         return null;
//     }

//     private double callGeminiModel(String cvText, JobResponse job) {
//         String prompt = buildPrompt(cvText, job);
//         logger.debug("Calling Gemini API with prompt: {}", prompt);

//         Map<String, Object> requestBody = new HashMap<>();
//         List<Map<String, Object>> contents = new ArrayList<>();
//         Map<String, Object> content = new HashMap<>();
//         List<Map<String, Object>> parts = new ArrayList<>();
//         Map<String, Object> textPart = new HashMap<>();
//         textPart.put("text", prompt);
//         parts.add(textPart);
//         content.put("parts", parts);
//         contents.add(content);
//         requestBody.put("contents", contents);

//         Map<String, Object> generationConfig = new HashMap<>();
//         generationConfig.put("temperature", 0.1);
//         generationConfig.put("maxOutputTokens", 50);
//         generationConfig.put("topP", 0.8);
//         generationConfig.put("topK", 40);
//         requestBody.put("generationConfig", generationConfig);

//         HttpHeaders headers = new HttpHeaders();
//         headers.setContentType(MediaType.APPLICATION_JSON);
//         headers.set("x-goog-api-key", geminiApiKey);
//         HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

//         try {
//             ResponseEntity<Map> response = restTemplate.postForEntity(GEMINI_URL, requestEntity, Map.class);
//             if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
//                 String aiResponse = extractGeminiResponse(response.getBody());
//                 if (aiResponse == null || aiResponse.trim().isEmpty()) {
//                     logger.error("No AI response content from Gemini for job: {}", job.getId());
//                     throw new RuntimeException("No AI response content from Gemini");
//                 }

//                 aiResponse = aiResponse.trim();
//                 logger.debug("Gemini response: {}", aiResponse);
//                 try {
//                     return Double.parseDouble(aiResponse);
//                 } catch (NumberFormatException e) {
//                     return extractScoreFromText(aiResponse);
//                 }
//             } else {
//                 logger.error("Gemini API HTTP error: {}", response.getStatusCode());
//                 throw new RuntimeException("Gemini API HTTP error: " + response.getStatusCode());
//             }
//         } catch (Exception e) {
//             logger.error("Error calling Gemini API for job {}: {}", job.getId(), e.getMessage(), e);
//             throw new RuntimeException("Error calling Gemini API: " + e.getMessage(), e);
//         }
//     }

//     private String extractGeminiResponse(Map<String, Object> responseBody) {
//         try {
//             List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
//             if (candidates != null && !candidates.isEmpty()) {
//                 Map<String, Object> candidate = candidates.get(0);
//                 Map<String, Object> content = (Map<String, Object>) candidate.get("content");
//                 if (content != null) {
//                     List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
//                     if (parts != null && !parts.isEmpty()) {
//                         return (String) parts.get(0).get("text");
//                     }
//                 }
//             }
//             if (responseBody.containsKey("promptFeedback")) {
//                 logger.error("Gemini API rejected prompt: {}", responseBody.get("promptFeedback"));
//                 throw new RuntimeException("Gemini API rejected the prompt for safety reasons");
//             }
//             return null;
//         } catch (Exception e) {
//             logger.error("Failed to parse Gemini API response: {}", e.getMessage(), e);
//             throw new RuntimeException("Failed to parse Gemini API response: " + e.getMessage(), e);
//         }
//     }

//     private double extractScoreFromText(String text) {
//         String[] tokens = text.split("\\s+");
//         for (String token : tokens) {
//             try {
//                 String cleanToken = token.replaceAll("[^0-9.]", "");
//                 if (!cleanToken.isEmpty()) {
//                     double score = Double.parseDouble(cleanToken);
//                     return Math.max(0, Math.min(1, score));
//                 }
//             } catch (NumberFormatException ignored) {
//             }
//         }
//         logger.error("Could not parse score from Gemini response: {}", text);
//         throw new RuntimeException("Could not parse score from Gemini response: " + text);
//     }

//     private String buildPrompt(String cvText, JobResponse job) {
//         String prompt = String.format("""
//                 You are a job matching AI. Analyze how well this CV matches the job description.
//                 Return ONLY a single numeric score between 0 and 1 (with 2 decimal places) and nothing else.
                
//                 CV CONTENT:
//                 %s
                
//                 JOB DESCRIPTION:
//                 Title: %s
//                 Company: %s
//                 Location: %s
//                 Description: %s
                
//                 SCORE (0.00 to 1.00):
//                 """, 
//                 cvText, 
//                 job.getTitle(), 
//                 job.getEmployerName() != null ? job.getEmployerName() : "Not specified",
//                 job.getCity() != null ? job.getCity() : "Not specified",
//                 job.getDescription() != null ? job.getDescription() : "No description available");
//         logger.debug("Built prompt for job {}: {}", job.getId(), prompt);
//         return prompt;
//     }
// }