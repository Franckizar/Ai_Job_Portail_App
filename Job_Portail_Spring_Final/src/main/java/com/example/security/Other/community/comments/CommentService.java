package com.example.security.Other.community.comments;

import com.example.security.Other.community.post.Post;
import com.example.security.Other.community.post.PostRepository;
import com.example.security.user.User;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {
    
    private static final Logger log = LoggerFactory.getLogger(CommentService.class);
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    
    // Create a new comment
    public CommentDto.CommentResponse createComment(CommentDto.CommentRequest request, User user) {
        log.info("Creating comment for post {} by user {}", request.getPostId(), user.getId());
        
        // Validation
        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            log.warn("Comment content is empty");
            throw new IllegalArgumentException("Comment content cannot be empty");
        }
        
        if (request.getContent().length() > 500) {
            log.warn("Comment content too long: {} characters", request.getContent().length());
            throw new IllegalArgumentException("Comment content cannot exceed 500 characters");
        }
        
        // Check if post exists
        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> {
                    log.error("Post not found with id: {}", request.getPostId());
                    return new RuntimeException("Post not found with id: " + request.getPostId());
                });
        
        // Create and save comment
        Comment comment = Comment.builder()
                .post(post)
                .user(user)
                .content(request.getContent().trim())
                .build();
        
        Comment savedComment = commentRepository.save(comment);
        log.info("Comment created successfully with id: {}", savedComment.getCommentId());
        
        return convertToCommentResponse(savedComment);
    }
    
    // Get comments by post ID
    @Transactional(readOnly = true)
    public List<CommentDto.CommentResponse> getCommentsByPostId(Integer postId) {
        log.info("Fetching comments for post: {}", postId);
        
        // Verify post exists
        if (!postRepository.existsById(postId)) {
            log.warn("Post not found: {}", postId);
            throw new RuntimeException("Post not found with id: " + postId);
        }
        
        List<Comment> comments = commentRepository.findByPost_PostIdOrderByCreatedAtAsc(postId);
        log.info("Found {} comments for post {}", comments.size(), postId);
        
        return comments.stream()
                .map(this::convertToCommentResponse)
                .collect(Collectors.toList());
    }
    
    // Get comments by user ID
    @Transactional(readOnly = true)
    public List<CommentDto.CommentResponse> getCommentsByUserId(Integer userId) {
        log.info("Fetching comments for user: {}", userId);
        
        List<Comment> comments = commentRepository.findByUser_IdOrderByCreatedAtDesc(userId);
        log.info("Found {} comments for user {}", comments.size(), userId);
        
        return comments.stream()
                .map(this::convertToCommentResponse)
                .collect(Collectors.toList());
    }
    
    // Delete comment
    public void deleteComment(Integer commentId, User user) {
        log.info("Deleting comment {} by user {}", commentId, user.getId());
        
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> {
                    log.error("Comment not found: {}", commentId);
                    return new RuntimeException("Comment not found");
                });
        
        // Check ownership
        if (!comment.getUser().getId().equals(user.getId())) {
            log.warn("User {} attempted to delete comment {} owned by user {}", 
                    user.getId(), commentId, comment.getUser().getId());
            throw new RuntimeException("You can only delete your own comments");
        }
        
        commentRepository.delete(comment);
        log.info("Comment {} deleted successfully", commentId);
    }
    
    // Get comment count for a post
    @Transactional(readOnly = true)
    public long getCommentCount(Integer postId) {
        return commentRepository.countByPost_PostId(postId);
    }
    
    // Get comment count by user
    @Transactional(readOnly = true)
    public long getCommentCountByUser(Integer userId) {
        return commentRepository.countByUser_Id(userId);
    }
    
    // Convert Comment to CommentResponse
    private CommentDto.CommentResponse convertToCommentResponse(Comment comment) {
        return CommentDto.CommentResponse.builder()
                .commentId(comment.getCommentId())
                .postId(comment.getPost().getPostId())
                .user(convertToUserInfo(comment.getUser()))
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .build();
    }
    
    // Convert User to UserInfo
    private CommentDto.UserInfo convertToUserInfo(User user) {
        return CommentDto.UserInfo.builder()
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .build();
    }
}