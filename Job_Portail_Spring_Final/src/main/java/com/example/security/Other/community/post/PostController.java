package com.example.security.Other.community.post;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth/community/posts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PostController {
    private static final Logger log = LoggerFactory.getLogger(PostController.class);
    private final PostService postService;

    /* --------------------- CREATE --------------------- */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(
            @RequestParam Integer userId,
            @RequestParam String content,
            @RequestParam(value = "file", required = false) MultipartFile file) {
       
        log.info("=== POST CREATE REQUEST START ===");
        log.info("Received POST request to create post");
        log.info("Parameters received:");
        log.info(" - userId: {}", userId);
        log.info(" - content: '{}'", content);
        log.info(" - file parameter: {}", file != null ? file.getOriginalFilename() : "none");
       
        // Validate userId
        if (userId == null) {
            log.error("ERROR: UserId is null");
            return ResponseEntity.badRequest().body(createErrorResponse("UserId is required"));
        }
       
        // Allow empty content but log it
        if (content == null || content.trim().isEmpty()) {
            log.warn("WARNING: Content is empty or null");
            content = "";
        }
       
        try {
            log.info("Calling postService.create()...");
            Post savedPost = postService.create(userId, content, file);
           
            log.info("Post created successfully!");
            log.info("Created post details:");
            log.info(" - Post ID: {}", savedPost.getPostId());
            log.info(" - User ID: {}", savedPost.getUser().getId());
            log.info(" - Content: '{}'", savedPost.getContent());
            log.info(" - Media URL: '{}'", savedPost.getMediaUrl());
            log.info(" - Created at: {}", savedPost.getCreatedAt());
           
            log.info("=== POST CREATE REQUEST END (SUCCESS) ===");
            return ResponseEntity.status(HttpStatus.CREATED).body(savedPost);
           
        } catch (IllegalArgumentException e) {
            log.error("ERROR: Validation failed during post creation", e);
            log.error("Error message: {}", e.getMessage());
            log.info("=== POST CREATE REQUEST END (VALIDATION ERROR) ===");
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
           
        } catch (Exception e) {
            log.error("ERROR: Unexpected error during post creation", e);
            log.error("Error type: {}", e.getClass().getSimpleName());
            log.error("Error message: {}", e.getMessage());
            log.info("=== POST CREATE REQUEST END (SERVER ERROR) ===");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to create post: " + e.getMessage()));
        }
    }

    /* --------------------- READ --------------------- */
    @GetMapping
    public ResponseEntity<?> listAll() {
        try {
            List<PostResponseDTO> posts = postService.getAllPostsAsDTO();
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to retrieve posts"));
        }
    }

    @GetMapping("/{postId}")
    public ResponseEntity<?> getById(@PathVariable Integer postId) {
        log.info("=== GET POST BY ID REQUEST START ===");
        log.info("Received GET request for post ID: {}", postId);
       
        try {
            Post post = postService.getById(postId);
            log.info("Successfully retrieved post:");
            log.info(" - Post ID: {}", post.getPostId());
            log.info(" - Media URL: '{}'", post.getMediaUrl());
            log.info(" - Content: '{}'", post.getContent());
           
            log.info("=== GET POST BY ID REQUEST END (SUCCESS) ===");
            return ResponseEntity.ok(post);
           
        } catch (IllegalArgumentException e) {
            log.warn("WARNING: Post not found with ID: {}", postId);
            log.info("=== GET POST BY ID REQUEST END (NOT FOUND) ===");
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse("Post not found with ID: " + postId));
           
        } catch (Exception e) {
            log.error("ERROR: Failed to retrieve post with ID: {}", postId, e);
            log.info("=== GET POST BY ID REQUEST END (ERROR) ===");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to retrieve post: " + e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getPostsByUserId(@PathVariable Integer userId) {
        log.info("=== GET POSTS BY USER ID REQUEST START ===");
        log.info("Received GET request for posts by user ID: {}", userId);
       
        try {
            List<PostResponseDTO> posts = postService.getPostsByUserId(userId);
            log.info("Successfully retrieved {} posts for user ID: {}", posts.size(), userId);
           
            log.info("=== GET POSTS BY USER ID REQUEST END (SUCCESS) ===");
            return ResponseEntity.ok(posts);
           
        } catch (IllegalArgumentException e) {
            log.warn("WARNING: No posts found for user ID: {}", userId);
            log.info("=== GET POSTS BY USER ID REQUEST END (NOT FOUND) ===");
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse("No posts found for user ID: " + userId));
           
        } catch (Exception e) {
            log.error("ERROR: Failed to retrieve posts for user ID: {}", userId, e);
            log.info("=== GET POSTS BY USER ID REQUEST END (ERROR) ===");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to retrieve posts: " + e.getMessage()));
        }
    }

    /* --------------------- UPDATE --------------------- */
    @PutMapping(value = "/{postId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> update(
            @PathVariable Integer postId,
            @RequestParam Integer userId,
            @RequestParam String content,
            @RequestParam(value = "file", required = false) MultipartFile newFile,
            @RequestParam(value = "removeFile", defaultValue = "false") boolean removeExistingFile) {
       
        log.info("=== POST UPDATE REQUEST START ===");
        log.info("Received PUT request to update post");
        log.info("Parameters:");
        log.info(" - postId: {}", postId);
        log.info(" - userId: {}", userId);
        log.info(" - content: '{}'", content);
        log.info(" - hasNewFile: {}", newFile != null && !newFile.isEmpty());
        log.info(" - removeFile: {}", removeExistingFile);
       
        if (newFile != null && !newFile.isEmpty()) {
            log.info("New file details:");
            log.info(" - Filename: '{}'", newFile.getOriginalFilename());
            log.info(" - Size: {} bytes", newFile.getSize());
            log.info(" - Content type: '{}'", newFile.getContentType());
        }
       
        try {
            Post updatedPost = postService.update(postId, userId, content, newFile, removeExistingFile);
            log.info("Post updated successfully!");
            log.info("Updated post MediaUrl: '{}'", updatedPost.getMediaUrl());
           
            log.info("=== POST UPDATE REQUEST END (SUCCESS) ===");
            return ResponseEntity.ok(updatedPost);
           
        } catch (SecurityException e) {
            log.warn("WARNING: Unauthorized update attempt for post {} by user {}", postId, userId);
            log.info("=== POST UPDATE REQUEST END (FORBIDDEN) ===");
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(createErrorResponse("Not authorized to update this post"));
           
        } catch (IllegalArgumentException e) {
            log.warn("WARNING: Invalid request for post update: {}", e.getMessage());
            log.info("=== POST UPDATE REQUEST END (BAD REQUEST) ===");
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
           
        } catch (Exception e) {
            log.error("ERROR: Failed to update post {}", postId, e);
            log.info("=== POST UPDATE REQUEST END (ERROR) ===");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to update post: " + e.getMessage()));
        }
    }

    /* --------------------- DELETE --------------------- */
    @DeleteMapping("/{postId}")
    public ResponseEntity<?> delete(
            @PathVariable Integer postId,
            @RequestParam Integer userId) {
       
        log.info("=== POST DELETE REQUEST START ===");
        log.info("Received DELETE request for post {} by user {}", postId, userId);
       
        try {
            postService.delete(postId, userId);
            log.info("Post deleted successfully!");
           
            log.info("=== POST DELETE REQUEST END (SUCCESS) ===");
            return ResponseEntity.noContent().build();
           
        } catch (SecurityException e) {
            log.warn("WARNING: Unauthorized delete attempt for post {} by user {}", postId, userId);
            log.info("=== POST DELETE REQUEST END (FORBIDDEN) ===");
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(createErrorResponse("Not authorized to delete this post"));
           
        } catch (IllegalArgumentException e) {
            log.warn("WARNING: Post not found for deletion: {}", postId);
            log.info("=== POST DELETE REQUEST END (NOT FOUND) ===");
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse("Post not found with ID: " + postId));
           
        } catch (Exception e) {
            log.error("ERROR: Failed to delete post {}", postId, e);
            log.info("=== POST DELETE REQUEST END (ERROR) ===");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to delete post: " + e.getMessage()));
        }
    }

    /* --------------------- HELPER METHODS --------------------- */
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", true);
        errorResponse.put("message", message);
        errorResponse.put("timestamp", System.currentTimeMillis());
        return errorResponse;
    }
}