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

    // File storage configuration
    private static final String BASE_UPLOAD_DIR = "H:/END OF YEAR PROJECT/Job_Portail_App/uploads/posts/";
    private static final String URL_PREFIX = "/uploads/posts/";
    
    // Allowed file types
    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
        "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp",
        "video/mp4", "video/avi", "video/mov", "video/wmv", "video/quicktime"
    );
    
    // Maximum file size (10MB)
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;

    /* --------------------- CREATE --------------------- */
    public Post create(Integer userId, String content, MultipartFile file) throws IOException {
        log.info("=== POST CREATION START ===");
        log.info("Creating post for userId: {}", userId);
        log.info("Content length: {} characters", content != null ? content.length() : 0);
        
        // Validate required file
        if (file == null || file.isEmpty()) {
            log.error("ERROR: No file provided - posts require a media file");
            throw new IllegalArgumentException("Media file is required for creating a post");
        }

        log.info("File details - Name: '{}', Size: {} bytes, ContentType: '{}'", 
                file.getOriginalFilename(), file.getSize(), file.getContentType());

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
        log.info("File saved successfully. MediaUrl: '{}'", mediaUrl);

        // Create and save post
        Post post = Post.builder()
                .user(author)
                .content(content != null ? content.trim() : "")
                .mediaUrl(mediaUrl)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        log.info("Saving post to database...");
        Post savedPost = postRepository.save(post);
        
        log.info("Post created successfully with ID: {}", savedPost.getPostId());
        log.info("Media accessible at: http://localhost:8088{}", savedPost.getMediaUrl());
        log.info("=== POST CREATION END ===");
        
        return savedPost;
    }

    /* --------------------- READ --------------------- */
    @Transactional(readOnly = true)
    public List<Post> listAll() {
        log.info("=== LISTING ALL POSTS ===");
        List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc();
        log.info("Retrieved {} posts from database", posts.size());
        
        // Log media URLs for debugging
        posts.forEach(post -> {
            log.debug("Post {}: MediaUrl='{}', Content length: {}", 
                    post.getPostId(), post.getMediaUrl(), post.getContent().length());
        });
        
        return posts;
    }

    @Transactional(readOnly = true)
    public Post getById(Integer postId) {
        log.info("=== GET POST BY ID: {} ===", postId);
        
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> {
                    log.error("ERROR: Post not found with ID: {}", postId);
                    return new IllegalArgumentException("Post not found with ID: " + postId);
                });
        
        log.info("Post found - MediaUrl: '{}'", post.getMediaUrl());
        return post;
    }

    /* --------------------- UPDATE --------------------- */
    public Post update(Integer postId, Integer userId, String newContent,
                       MultipartFile newFile, boolean removeExistingFile) throws IOException {
        log.info("=== POST UPDATE START ===");
        log.info("Updating post ID: {} by user ID: {}", postId, userId);
        
        Post post = getById(postId);

        // Authorization check
        if (!post.getUser().getId().equals(userId)) {
            log.error("ERROR: User {} not authorized to update post {} (owner: {})", 
                    userId, postId, post.getUser().getId());
            throw new SecurityException("Not authorized to update this post");
        }

        // Handle file removal
        if (removeExistingFile && post.getMediaUrl() != null) {
            log.info("Removing existing file: {}", post.getMediaUrl());
            deleteFileIfExists(post.getMediaUrl());
            post.setMediaUrl(null);
        }

        // Handle new file upload
        if (newFile != null && !newFile.isEmpty()) {
            log.info("Processing new file upload...");
            
            // Delete old file if exists and we're uploading new one
            if (post.getMediaUrl() != null && !removeExistingFile) {
                log.info("Deleting old file before saving new one: {}", post.getMediaUrl());
                deleteFileIfExists(post.getMediaUrl());
            }
            
            String newMediaUrl = saveFile(newFile);
            post.setMediaUrl(newMediaUrl);
            log.info("New file saved with URL: {}", newMediaUrl);
        }

        // Update content and timestamp
        post.setContent(newContent != null ? newContent.trim() : "");
        post.setUpdatedAt(LocalDateTime.now());
        
        Post updatedPost = postRepository.save(post);
        log.info("Post updated successfully - MediaUrl: '{}'", updatedPost.getMediaUrl());
        log.info("=== POST UPDATE END ===");
        
        return updatedPost;
    }

    /* --------------------- DELETE --------------------- */
    public void delete(Integer postId, Integer userId) {
        log.info("=== POST DELETE START ===");
        log.info("Deleting post ID: {} by user ID: {}", postId, userId);
        
        Post post = getById(postId);
        
        // Authorization check
        if (!post.getUser().getId().equals(userId)) {
            log.error("ERROR: User {} not authorized to delete post {} (owner: {})", 
                    userId, postId, post.getUser().getId());
            throw new SecurityException("Not authorized to delete this post");
        }

        // Delete associated file
        if (post.getMediaUrl() != null) {
            log.info("Deleting associated file: {}", post.getMediaUrl());
            deleteFileIfExists(post.getMediaUrl());
        }

        // Delete from database
        postRepository.delete(post);
        log.info("Post deleted successfully from database");
        log.info("=== POST DELETE END ===");
    }

    /* ------------------ PRIVATE HELPER METHODS ------------------ */
    
    private String saveFile(MultipartFile file) throws IOException {
        log.info("=== FILE SAVE START ===");
        
        // Validate file
        validateFile(file);
        
        // Ensure upload directory exists
        ensureUploadDirectoryExists();
        
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String sanitizedFilename = sanitizeFilename(originalFilename);
        String uniqueFilename = UUID.randomUUID() + "_" + sanitizedFilename;
        
        log.info("Generated filename: {} -> {}", originalFilename, uniqueFilename);
        
        // Create full file path
        Path filePath = Paths.get(BASE_UPLOAD_DIR).resolve(uniqueFilename);
        log.info("Saving to: {}", filePath.toAbsolutePath());
        
        try {
            // Save the file
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Verify file was saved correctly
            if (!Files.exists(filePath)) {
                throw new IOException("File save verification failed - file not found after save");
            }
            
            long savedSize = Files.size(filePath);
            log.info("File saved successfully - Size: {} bytes", savedSize);
            
            if (savedSize != file.getSize()) {
                log.warn("WARNING: File size mismatch - Original: {} bytes, Saved: {} bytes", 
                        file.getSize(), savedSize);
            }
            
        } catch (IOException e) {
            log.error("ERROR: Failed to save file", e);
            throw new IOException("Failed to save file: " + e.getMessage(), e);
        }
        
        // Generate and return media URL
        String mediaUrl = URL_PREFIX + uniqueFilename;
        log.info("Generated media URL: {}", mediaUrl);
        log.info("File will be accessible at: http://localhost:8088{}", mediaUrl);
        log.info("=== FILE SAVE END ===");
        
        return mediaUrl;
    }
    
    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be null or empty");
        }
        
        // Check file size
        if (file.getSize() > MAX_FILE_SIZE) {
            log.error("ERROR: File too large - Size: {} bytes, Max: {} bytes", 
                    file.getSize(), MAX_FILE_SIZE);
            throw new IllegalArgumentException(
                String.format("File size (%d bytes) exceeds maximum allowed size (%d bytes)", 
                        file.getSize(), MAX_FILE_SIZE));
        }
        
        // Check content type
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            log.error("ERROR: Invalid file type: {}. Allowed: {}", contentType, ALLOWED_CONTENT_TYPES);
            throw new IllegalArgumentException("Invalid file type: " + contentType + 
                    ". Allowed types: " + String.join(", ", ALLOWED_CONTENT_TYPES));
        }
        
        log.info("File validation passed - Size: {} bytes, Type: {}", file.getSize(), contentType);
    }
    
    private void ensureUploadDirectoryExists() throws IOException {
        Path uploadPath = Paths.get(BASE_UPLOAD_DIR);
        
        if (!Files.exists(uploadPath)) {
            log.info("Upload directory doesn't exist, creating: {}", uploadPath.toAbsolutePath());
            try {
                Files.createDirectories(uploadPath);
                log.info("Upload directory created successfully");
            } catch (IOException e) {
                log.error("ERROR: Failed to create upload directory", e);
                throw new IOException("Failed to create upload directory: " + uploadPath.toAbsolutePath(), e);
            }
        } else {
            log.debug("Upload directory exists: {}", uploadPath.toAbsolutePath());
        }
    }
    
    private void deleteFileIfExists(String mediaUrl) {
        if (mediaUrl == null || !mediaUrl.startsWith(URL_PREFIX)) {
            log.warn("WARNING: Invalid media URL for deletion: {}", mediaUrl);
            return;
        }
        
        try {
            String filename = mediaUrl.substring(URL_PREFIX.length());
            Path filePath = Paths.get(BASE_UPLOAD_DIR).resolve(filename);
            
            log.info("Attempting to delete file: {}", filePath.toAbsolutePath());
            
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                log.info("File deleted successfully: {}", filename);
            } else {
                log.warn("WARNING: File not found for deletion: {}", filePath.toAbsolutePath());
            }
            
        } catch (Exception e) {
            log.error("ERROR: Failed to delete file for URL: {}", mediaUrl, e);
            // Don't throw exception - file deletion failure shouldn't break the operation
        }
    }
    
    private String sanitizeFilename(String originalFilename) {
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            return "file";
        }

        String name = originalFilename.trim();
        int lastDot = name.lastIndexOf('.');
        String extension = "";

        if (lastDot > 0 && lastDot < name.length() - 1) {
            extension = name.substring(lastDot);
            name = name.substring(0, lastDot);
        }

        // Remove invalid characters and replace with underscore
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