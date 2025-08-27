package com.example.security.Other.community.comments;

import com.example.security.user.User;
import com.example.security.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth/community/comments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CommentController {
    
    private static final Logger log = LoggerFactory.getLogger(CommentController.class);
    private final CommentService commentService;
    private final UserRepository userRepository;
    
    // Create a new comment - Requires userId in request body
    @PostMapping
    public ResponseEntity<?> createComment(@RequestBody CommentDto.CommentRequest request) {
        
        log.info("=== CREATE COMMENT REQUEST ===");
        log.info("Creating comment - postId: {}, userId: {}, content: '{}'", 
                request.getPostId(), request.getUserId(), request.getContent());
        
        // Validate required fields
        if (request.getPostId() == null) {
            return ResponseEntity.badRequest().body(createErrorResponse("postId is required"));
        }
        if (request.getUserId() == null) {
            return ResponseEntity.badRequest().body(createErrorResponse("userId is required"));
        }
        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(createErrorResponse("content is required"));
        }
        
        try {
            // Find user
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getUserId()));
            
            CommentDto.CommentResponse response = commentService.createComment(request, user);
            log.info("Comment created successfully: {}", response.getCommentId());
            
            Map<String, Object> fullResponse = new HashMap<>();
            fullResponse.put("success", true);
            fullResponse.put("message", "Comment created successfully");
            fullResponse.put("comment", response);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(fullResponse);
            
        } catch (IllegalArgumentException e) {
            log.warn("Invalid comment request: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
            
        } catch (RuntimeException e) {
            log.error("Runtime error creating comment: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse(e.getMessage()));
            
        } catch (Exception e) {
            log.error("Unexpected error creating comment", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to create comment"));
        }
    }
    
    // Get comments by post ID - No authentication required
    @GetMapping("/post/{postId}")
    public ResponseEntity<?> getCommentsByPostId(@PathVariable Integer postId) {
        log.info("=== GET COMMENTS BY POST REQUEST ===");
        log.info("Fetching comments for post: {}", postId);
        
        if (postId == null) {
            return ResponseEntity.badRequest().body(createErrorResponse("postId is required"));
        }
        
        try {
            List<CommentDto.CommentResponse> comments = commentService.getCommentsByPostId(postId);
            log.info("Retrieved {} comments for post {}", comments.size(), postId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("postId", postId);
            response.put("commentCount", comments.size());
            response.put("comments", comments);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            log.error("Error fetching comments for post {}: {}", postId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse(e.getMessage()));
            
        } catch (Exception e) {
            log.error("Unexpected error fetching comments for post: {}", postId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to fetch comments"));
        }
    }
    
    // Get comments by user ID - No authentication required
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getCommentsByUserId(@PathVariable Integer userId) {
        log.info("=== GET COMMENTS BY USER REQUEST ===");
        log.info("Fetching comments for user: {}", userId);
        
        if (userId == null) {
            return ResponseEntity.badRequest().body(createErrorResponse("userId is required"));
        }
        
        try {
            List<CommentDto.CommentResponse> comments = commentService.getCommentsByUserId(userId);
            log.info("Retrieved {} comments for user {}", comments.size(), userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("userId", userId);
            response.put("commentCount", comments.size());
            response.put("comments", comments);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error fetching comments for user: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to fetch user comments"));
        }
    }
    
    // Delete comment - Requires both commentId and userId
    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Integer commentId,
            @RequestParam Integer userId) {
        
        log.info("=== DELETE COMMENT REQUEST ===");
        log.info("Deleting comment {} by user {}", commentId, userId);
        
        // Validate required parameters
        if (commentId == null) {
            return ResponseEntity.badRequest().body(createErrorResponse("commentId is required"));
        }
        if (userId == null) {
            return ResponseEntity.badRequest().body(createErrorResponse("userId is required"));
        }
        
        try {
            // Find user
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
            
            commentService.deleteComment(commentId, user);
            log.info("Comment {} deleted successfully", commentId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Comment deleted successfully");
            response.put("commentId", commentId);
            response.put("userId", userId);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            log.warn("Error deleting comment {}: {}", commentId, e.getMessage());
            
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse(e.getMessage()));
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(createErrorResponse(e.getMessage()));
            }
            
        } catch (Exception e) {
            log.error("Unexpected error deleting comment: {}", commentId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to delete comment"));
        }
    }
    
    // Get comment count for a post - No authentication required
    @GetMapping("/count/post/{postId}")
    public ResponseEntity<?> getCommentCountByPostId(@PathVariable Integer postId) {
        log.info("=== GET COMMENT COUNT BY POST REQUEST ===");
        log.info("Getting comment count for post: {}", postId);
        
        if (postId == null) {
            return ResponseEntity.badRequest().body(createErrorResponse("postId is required"));
        }
        
        try {
            long count = commentService.getCommentCount(postId);
            log.info("Comment count for post {}: {}", postId, count);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("postId", postId);
            response.put("commentCount", count);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error getting comment count for post: {}", postId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to get comment count"));
        }
    }
    
    // Get comment count by user - No authentication required
    @GetMapping("/count/user/{userId}")
    public ResponseEntity<?> getCommentCountByUserId(@PathVariable Integer userId) {
        log.info("=== GET COMMENT COUNT BY USER REQUEST ===");
        log.info("Getting comment count for user: {}", userId);
        
        if (userId == null) {
            return ResponseEntity.badRequest().body(createErrorResponse("userId is required"));
        }
        
        try {
            long count = commentService.getCommentCountByUser(userId);
            log.info("Comment count for user {}: {}", userId, count);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("userId", userId);
            response.put("commentCount", count);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error getting comment count for user: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to get user comment count"));
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