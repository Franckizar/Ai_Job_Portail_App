package com.example.security.Other.community.post;

import com.example.security.user.User;
import com.example.security.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.Arrays;

@Service
@RequiredArgsConstructor
@Transactional
public class PostService {

    private static final Logger log = LoggerFactory.getLogger(PostService.class);

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    // Absolute path for file storage
    private static final String BASE_UPLOAD_DIR = "H:/END OF YEAR PROJECT/Job_Portail_App/uploads/posts/";
    private static final String URL_PREFIX = "/uploads/posts/";
    
    // Allowed file types
    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
        "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp",
        "video/mp4", "video/avi", "video/mov", "video/wmv"
    );
    
    // Maximum file size (10MB)
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;

    /* --------------------- CREATE --------------------- */
    public Post create(Integer userId, String content, MultipartFile file) throws IOException {
        log.info("=== POST CREATION START ===");
        log.info("Creating post for userId: {}", userId);
        log.info("Content: '{}'", content);
        log.info("File provided: {}", file != null);
        
        if (file != null) {
            log.info("File details - Name: '{}', Size: {} bytes, ContentType: '{}'", 
                    file.getOriginalFilename(), file.getSize(), file.getContentType());
        }

        // Validate that image is required
        if (file == null || file.isEmpty()) {
            log.error("ERROR: No image file provided. Posts require an image!");
            throw new IllegalArgumentException("Image file is required for creating a post");
        }

        // Find user
        log.info("Looking up user with ID: {}", userId);
        User author = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.error("ERROR: User not found with ID: {}", userId);
                    return new IllegalArgumentException("User not found with ID: " + userId);
                });
        log.info("User found: {} {}", author.getFirstname(), author.getLastname());

        // Save file and get URL
        log.info("Starting file save process...");
        String mediaUrl = saveFile(file);
        log.info("File save process completed. MediaUrl: '{}'", mediaUrl);

        // Create post object
        log.info("Creating post object...");
        Post post = Post.builder()
                .user(author)
                .content(content != null ? content.trim() : "")
                .mediaUrl(mediaUrl)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        log.info("Post object created - Content: '{}', MediaUrl: '{}'", 
                post.getContent(), post.getMediaUrl());

        // Save to database
        log.info("Saving post to database...");
        Post savedPost = postRepository.save(post);
        log.info("Post saved to database with ID: {}", savedPost.getPostId());
        log.info("Saved post MediaUrl in DB: '{}'", savedPost.getMediaUrl());
        
        log.info("=== POST CREATION END ===");
        return savedPost;
    }

    /* --------------------- READ --------------------- */
    @Transactional(readOnly = true)
    public List<Post> listAll() {
        log.info("=== LISTING ALL POSTS ===");
        List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc();
        log.info("Found {} posts", posts.size());
        
        for (Post post : posts) {
            log.info("Post ID: {}, MediaUrl: '{}'", post.getPostId(), post.getMediaUrl());
        }
        
        return posts;
    }

    @Transactional(readOnly = true)
    public Post getById(Integer postId) {
        log.info("=== GET POST BY ID ===");
        log.info("Looking for post with ID: {}", postId);
        
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> {
                    log.error("ERROR: Post not found with ID: {}", postId);
                    return new IllegalArgumentException("Post not found with ID: " + postId);
                });
        
        log.info("Post found - ID: {}, MediaUrl: '{}'", post.getPostId(), post.getMediaUrl());
        return post;
    }

    /* --------------------- UPDATE --------------------- */
    public Post update(Integer postId, Integer userId, String newContent,
                       MultipartFile newFile, boolean removeExistingFile) throws IOException {
        log.info("=== POST UPDATE START ===");
        log.info("Updating post ID: {} by user ID: {}", postId, userId);
        
        Post post = getById(postId);

        if (!post.getUser().getId().equals(userId)) {
            log.error("ERROR: User {} not authorized to update post {}", userId, postId);
            throw new SecurityException("Not allowed to update this post");
        }

        if (removeExistingFile && post.getMediaUrl() != null) {
            log.info("Removing existing file: {}", post.getMediaUrl());
            deleteFileIfExists(post.getMediaUrl());
            post.setMediaUrl(null);
        }

        if (newFile != null && !newFile.isEmpty()) {
            log.info("Processing new file upload...");
            if (post.getMediaUrl() != null) {
                log.info("Deleting old file before saving new one: {}", post.getMediaUrl());
                deleteFileIfExists(post.getMediaUrl());
            }
            String newPath = saveFile(newFile);
            post.setMediaUrl(newPath);
            log.info("New file saved with URL: {}", newPath);
        }

        post.setContent(newContent != null ? newContent.trim() : "");
        post.setUpdatedAt(LocalDateTime.now());
        
        Post updatedPost = postRepository.save(post);
        log.info("Post updated successfully - ID: {}, MediaUrl: '{}'", 
                updatedPost.getPostId(), updatedPost.getMediaUrl());
        
        log.info("=== POST UPDATE END ===");
        return updatedPost;
    }

    /* --------------------- DELETE --------------------- */
    public void delete(Integer postId, Integer userId) {
        log.info("=== POST DELETE START ===");
        log.info("Deleting post ID: {} by user ID: {}", postId, userId);
        
        Post post = getById(postId);
        if (!post.getUser().getId().equals(userId)) {
            log.error("ERROR: User {} not authorized to delete post {}", userId, postId);
            throw new SecurityException("Not allowed to delete this post");
        }

        if (post.getMediaUrl() != null) {
            log.info("Deleting associated file: {}", post.getMediaUrl());
            deleteFileIfExists(post.getMediaUrl());
        }

        postRepository.delete(post);
        log.info("Post deleted successfully from database");
        log.info("=== POST DELETE END ===");
    }

    /* ------------------ PRIVATE HELPERS ------------------ */
    private String saveFile(MultipartFile file) throws IOException {
        log.info("=== FILE SAVE START ===");
        
        if (file == null || file.isEmpty()) {
            log.error("ERROR: File is null or empty");
            throw new IllegalArgumentException("File cannot be null or empty");
        }

        // Validate file size
        if (file.getSize() > MAX_FILE_SIZE) {
            log.error("ERROR: File too large. Size: {} bytes, Max allowed: {} bytes", 
                    file.getSize(), MAX_FILE_SIZE);
            throw new IllegalArgumentException("File size exceeds maximum allowed size of 10MB");
        }

        // Validate content type
        String contentType = file.getContentType();
        if (!ALLOWED_CONTENT_TYPES.contains(contentType)) {
            log.error("ERROR: Invalid file type: {}. Allowed types: {}", 
                    contentType, ALLOWED_CONTENT_TYPES);
            throw new IllegalArgumentException("Invalid file type: " + contentType);
        }

        log.info("File validation passed - Size: {} bytes, Type: {}", file.getSize(), contentType);

        // Create upload directory
        Path uploadPath = Paths.get(BASE_UPLOAD_DIR);
        log.info("Upload directory path: {}", uploadPath.toAbsolutePath());
        
        if (!Files.exists(uploadPath)) {
            log.info("Upload directory doesn't exist, creating it...");
            try {
                Files.createDirectories(uploadPath);
                log.info("Upload directory created successfully at: {}", uploadPath.toAbsolutePath());
            } catch (IOException e) {
                log.error("ERROR: Failed to create upload directory: {}", uploadPath.toAbsolutePath(), e);
                throw new IOException("Failed to create upload directory", e);
            }
        } else {
            log.info("Upload directory already exists");
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String sanitizedFilename = sanitizeFilename(originalFilename);
        String uniqueFilename = UUID.randomUUID() + "_" + sanitizedFilename;
        log.info("Generated unique filename: {}", uniqueFilename);

        // Create full file path
        Path filePath = uploadPath.resolve(uniqueFilename);
        log.info("Full file path: {}", filePath.toAbsolutePath());

        // Save the file
        try {
            log.info("Copying file to disk...");
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            log.info("File copied successfully to: {}", filePath.toAbsolutePath());
        } catch (IOException e) {
            log.error("ERROR: Failed to save file to: {}", filePath.toAbsolutePath(), e);
            throw new IOException("Failed to save file", e);
        }

        // Verify file was saved
        if (Files.exists(filePath)) {
            long savedSize = Files.size(filePath);
            log.info("File verification successful - Saved size: {} bytes", savedSize);
            
            if (savedSize != file.getSize()) {
                log.warn("WARNING: File size mismatch - Original: {} bytes, Saved: {} bytes", 
                        file.getSize(), savedSize);
            }
        } else {
            log.error("ERROR: File verification failed - File not found at: {}", filePath.toAbsolutePath());
            throw new IOException("File save verification failed");
        }

        // Generate media URL
        String mediaUrl = URL_PREFIX + uniqueFilename;
        log.info("Generated media URL: {}", mediaUrl);
        
        log.info("=== FILE SAVE END ===");
        return mediaUrl;
    }

    private void deleteFileIfExists(String mediaUrl) {
        log.info("=== FILE DELETE START ===");
        log.info("Attempting to delete file with URL: {}", mediaUrl);
        
        if (mediaUrl == null || !mediaUrl.startsWith(URL_PREFIX)) {
            log.warn("WARNING: Invalid media URL for deletion: {}", mediaUrl);
            return;
        }

        try {
            // Extract filename from URL
            String filename = mediaUrl.substring(URL_PREFIX.length());
            Path filePath = Paths.get(BASE_UPLOAD_DIR).resolve(filename);
            log.info("Attempting to delete file at: {}", filePath.toAbsolutePath());

            if (Files.exists(filePath)) {
                Files.delete(filePath);
                log.info("File deleted successfully: {}", filePath.toAbsolutePath());
            } else {
                log.warn("WARNING: File not found for deletion: {}", filePath.toAbsolutePath());
            }
        } catch (Exception e) {
            log.error("ERROR: Failed to delete file for URL: {}", mediaUrl, e);
        }
        
        log.info("=== FILE DELETE END ===");
    }

    private String sanitizeFilename(String originalFilename) {
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            return "file";
        }

        // Keep the file extension
        String name = originalFilename.trim();
        int lastDot = name.lastIndexOf('.');
        String extension = "";

        if (lastDot > 0 && lastDot < name.length() - 1) {
            extension = name.substring(lastDot);
            name = name.substring(0, lastDot);
        }

        // Remove invalid characters
        String sanitizedName = name.replaceAll("[^a-zA-Z0-9._-]", "_");
        
        // Ensure name is not empty
        if (sanitizedName.isEmpty()) {
            sanitizedName = "file";
        }

        String result = sanitizedName + extension;
        log.debug("Sanitized filename: '{}' -> '{}'", originalFilename, result);
        
        return result;
    }
}