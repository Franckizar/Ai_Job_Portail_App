package com.example.security.Other.community.like;

import com.example.security.user.User;
import com.example.security.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth/community/likes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LikeController {
    
    private static final Logger log = LoggerFactory.getLogger(LikeController.class);
    private final LikeService likeService;
    private final UserRepository userRepository;
    
    // Toggle like for a post - Requires userId in request parameter
    @PostMapping("/{postId}")
    public ResponseEntity<?> toggleLike(
            @PathVariable Integer postId,
            @RequestParam Integer userId) {
        
        log.info("=== TOGGLE LIKE REQUEST ===");
        log.info("Toggle like request - postId: {}, userId: {}", postId, userId);
        
        // Validate required parameters
        if (postId == null) {
            return ResponseEntity.badRequest().body(createErrorResponse("postId is required"));
        }
        if (userId == null) {
            return ResponseEntity.badRequest().body(createErrorResponse("userId is required"));
        }
        
        try {
            // Find user
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
            
            LikeDto.LikeResponse response = likeService.toggleLike(postId, user);
            log.info("Like toggled successfully - postId: {}, isLiked: {}, count: {}", 
                    postId, response.isLiked(), response.getLikeCount());
            
            Map<String, Object> fullResponse = new HashMap<>();
            fullResponse.put("success", true);
            fullResponse.put("postId", response.getPostId());
            fullResponse.put("userId", response.getUserId());
            fullResponse.put("isLiked", response.isLiked());
            fullResponse.put("likeCount", response.getLikeCount());
            fullResponse.put("message", response.getMessage());
            
            return ResponseEntity.ok(fullResponse);
            
        } catch (RuntimeException e) {
            log.error("Error toggling like for post {}: {}", postId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
                    
        } catch (Exception e) {
            log.error("Unexpected error toggling like for post: {}", postId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to toggle like"));
        }
    }
    
    // Check if user liked a post - Requires both postId and userId
    @GetMapping("/{postId}/user/{userId}")
    public ResponseEntity<?> isLikedByUser(
            @PathVariable Integer postId,
            @PathVariable Integer userId) {
        
        log.info("=== CHECK LIKE STATUS REQUEST ===");
        log.info("Checking like status - postId: {}, userId: {}", postId, userId);
        
        // Validate required parameters
        if (postId == null) {
            return ResponseEntity.badRequest().body(createErrorResponse("postId is required"));
        }
        if (userId == null) {
            return ResponseEntity.badRequest().body(createErrorResponse("userId is required"));
        }
        
        try {
            boolean isLiked = likeService.isLikedByUser(postId, userId);
            log.info("Like status - postId: {}, userId: {}, isLiked: {}", postId, userId, isLiked);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("postId", postId);
            response.put("userId", userId);
            response.put("isLiked", isLiked);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            log.error("Error checking like status: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
                    
        } catch (Exception e) {
            log.error("Unexpected error checking like status - postId: {}, userId: {}", postId, userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to check like status"));
        }
    }
    
    // Get like count for a post - Only requires postId
    @GetMapping("/count/post/{postId}")
    public ResponseEntity<?> getLikeCountByPostId(@PathVariable Integer postId) {
        log.info("=== GET LIKE COUNT BY POST REQUEST ===");
        log.info("Getting like count for post: {}", postId);
        
        if (postId == null) {
            return ResponseEntity.badRequest().body(createErrorResponse("postId is required"));
        }
        
        try {
            long count = likeService.getLikeCount(postId);
            log.info("Like count for post {}: {}", postId, count);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("postId", postId);
            response.put("likeCount", count);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            log.error("Error getting like count for post {}: {}", postId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
                    
        } catch (Exception e) {
            log.error("Unexpected error getting like count for post: {}", postId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to get like count"));
        }
    }
    
    // Get like count by user - Only requires userId  
    @GetMapping("/count/user/{userId}")
    public ResponseEntity<?> getLikeCountByUserId(@PathVariable Integer userId) {
        log.info("=== GET LIKE COUNT BY USER REQUEST ===");
        log.info("Getting like count for user: {}", userId);
        
        if (userId == null) {
            return ResponseEntity.badRequest().body(createErrorResponse("userId is required"));
        }
        
        try {
            long count = likeService.getLikeCountByUser(userId);
            log.info("Like count for user {}: {}", userId, count);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("userId", userId);
            response.put("likeCount", count);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Unexpected error getting like count for user: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to get user like count"));
        }
    }
    
    // Get all likes for a specific post with user details - Only requires postId
    @GetMapping("/post/{postId}/details")
    public ResponseEntity<?> getLikeDetailsByPostId(@PathVariable Integer postId) {
        log.info("=== GET LIKE DETAILS BY POST REQUEST ===");
        log.info("Getting like details for post: {}", postId);
        
        if (postId == null) {
            return ResponseEntity.badRequest().body(createErrorResponse("postId is required"));
        }
        
        try {
            // This would require additional service method to get like details
            long count = likeService.getLikeCount(postId);
            log.info("Like details for post {}: {} likes", postId, count);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("postId", postId);
            response.put("likeCount", count);
            response.put("message", "Use other endpoints to get specific user like status");
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            log.error("Error getting like details for post {}: {}", postId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
                    
        } catch (Exception e) {
            log.error("Unexpected error getting like details for post: {}", postId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to get like details"));
        }
    }
    
    // Helper method to create error responses
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", true);
        errorResponse.put("success", false);
        errorResponse.put("message", message);
        errorResponse.put("timestamp", System.currentTimeMillis());
        return errorResponse;
    }
}