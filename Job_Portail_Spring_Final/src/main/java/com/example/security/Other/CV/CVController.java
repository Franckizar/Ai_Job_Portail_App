package com.example.security.Other.CV;

import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/auth/cv")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CVController {

    private final CVService cvService;

    public CVController(CVService cvService) {
        this.cvService = cvService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadCV(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") Integer userId,
            @RequestParam("userType") String userType) {
        try {
            CV cv = cvService.uploadCV(file, userId, userType);
            String message = (cv.getJobSeeker() != null && cv.getJobSeeker().getCv() != null)
                    || (cv.getTechnician() != null && cv.getTechnician().getCv() != null)
                    ? "CV updated successfully"
                    : "CV uploaded successfully";
            return ResponseEntity.ok(message);
        } catch (IOException | IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/{userId}/{userType}")
    public ResponseEntity<Map<String, String>> getCV(
            @PathVariable Integer userId,
            @PathVariable String userType) {
        try {
            CV cv = cvService.getCVByUserId(userId, userType);
            
            // Convert binary to base64 string
            String base64Content = Base64.getEncoder().encodeToString(cv.getContent());
            
            Map<String, String> response = new HashMap<>();
            response.put("content", base64Content);
            response.put("contentType", "application/pdf");
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}