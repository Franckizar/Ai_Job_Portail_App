package com.example.security.Other.Job;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class RecaptchaService {

    // Updated for reCAPTCHA Enterprise
    private static final String RECAPTCHA_SECRET_KEY = "6LcV0o4rAAAAABEMPLE_SECRET_KEY_HERE"; // Replace with your actual secret key
    private static final String RECAPTCHA_VERIFY_URL = "https://recaptchaenterprise.googleapis.com/v1/projects/YOUR_PROJECT_ID/assessments?key=YOUR_API_KEY";
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    public RecaptchaService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }
    
    /**
     * Verifies the reCAPTCHA Enterprise token
     * @param token The reCAPTCHA token from the frontend
     * @param expectedAction The expected action (e.g., "APPLY_JOB")
     * @return true if verification is successful, false otherwise
     */
    public boolean verifyRecaptchaEnterprise(String token, String expectedAction) {
        if (token == null || token.isEmpty()) {
            System.err.println("reCAPTCHA token is null or empty");
            return false;
        }
        
        try {
            // Create assessment request body for reCAPTCHA Enterprise
            String requestBody = String.format(
                "{\"event\": {\"token\": \"%s\", \"expectedAction\": \"%s\", \"siteKey\": \"6LcV0o4rAAAAAKX0RVwKLS05y2ZHvZQjNMIq_-CA\"}}",
                token, expectedAction
            );
            
            // Send POST request to reCAPTCHA Enterprise API
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
            
            org.springframework.http.HttpEntity<String> entity = 
                new org.springframework.http.HttpEntity<>(requestBody, headers);
            
            String response = restTemplate.postForObject(
                RECAPTCHA_VERIFY_URL, 
                entity, 
                String.class
            );
            
            if (response == null) {
                System.err.println("reCAPTCHA Enterprise API returned null response");
                return false;
            }
            
            JsonNode jsonNode = objectMapper.readTree(response);
            
            // Check if the token is valid
            boolean tokenValid = jsonNode.has("tokenProperties") && 
                               jsonNode.get("tokenProperties").get("valid").asBoolean();
            
            if (!tokenValid) {
                System.err.println("reCAPTCHA token is invalid");
                return false;
            }
            
            // Verify the action matches
            String action = jsonNode.get("tokenProperties").get("action").asText();
            if (!expectedAction.equals(action)) {
                System.err.println("reCAPTCHA action mismatch. Expected: " + expectedAction + ", Got: " + action);
                return false;
            }
            
            // Check risk score (0.0 - 1.0, where 1.0 is very likely a good interaction)
            double score = jsonNode.get("riskAnalysis").get("score").asDouble();
            
            // You can adjust this threshold based on your needs
            double scoreThreshold = 0.5;
            
            if (score < scoreThreshold) {
                System.err.println("reCAPTCHA score too low: " + score);
                return false;
            }
            
            System.out.println("reCAPTCHA Enterprise verification successful. Score: " + score);
            return true;
            
        } catch (Exception e) {
            System.err.println("reCAPTCHA Enterprise verification error: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
    
    /**
     * Legacy method for backward compatibility - calls Enterprise version with default action
     * @param token The reCAPTCHA token from the frontend
     * @return true if verification is successful, false otherwise
     */
    public boolean verifyRecaptcha(String token) {
        return verifyRecaptchaEnterprise(token, "APPLY_JOB");
    }
}