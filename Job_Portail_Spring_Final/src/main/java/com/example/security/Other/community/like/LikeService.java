package com.example.security.Other.community.like;

import com.example.security.Other.community.post.Post;
import com.example.security.Other.community.post.PostRepository;
import com.example.security.user.User;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class LikeService {
    
    private static final Logger log = LoggerFactory.getLogger(LikeService.class);
    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    
    // Toggle like (like/unlike)
    public LikeDto.LikeResponse toggleLike(Integer postId, User user) {
        log.info("Toggling like for post {} by user {}", postId, user.getId());
        
        // Check if post exists
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> {
                    log.error("Post not found: {}", postId);
                    return new RuntimeException("Post not found with id: " + postId);
                });
        
        Optional<Like> existingLike = likeRepository.findByPost_PostIdAndUser_Id(postId, user.getId());
        
        boolean isLiked;
        if (existingLike.isPresent()) {
            // Unlike the post
            likeRepository.delete(existingLike.get());
            isLiked = false;
            log.info("User {} unliked post {}", user.getId(), postId);
        } else {
            // Like the post
            Like like = Like.builder()
                    .post(post)
                    .user(user)
                    .build();
            
            likeRepository.save(like);
            isLiked = true;
            log.info("User {} liked post {}", user.getId(), postId);
        }
        
        long likeCount = likeRepository.countByPost_PostId(postId);
        String message = isLiked ? "Post liked successfully" : "Post unliked successfully";
        
        log.info("Post {} now has {} likes", postId, likeCount);
        
        return LikeDto.LikeResponse.builder()
                .isLiked(isLiked)
                .likeCount(likeCount)
                .message(message)
                .postId(postId)
                .userId(user.getId())
                .build();
    }
    
    // Check if user liked a post
    @Transactional(readOnly = true)
    public boolean isLikedByUser(Integer postId, Integer userId) {
        log.debug("Checking if user {} liked post {}", userId, postId);
        
        // Verify post exists
        if (!postRepository.existsById(postId)) {
            log.warn("Post not found when checking like status: {}", postId);
            throw new RuntimeException("Post not found with id: " + postId);
        }
        
        boolean isLiked = likeRepository.existsByPost_PostIdAndUser_Id(postId, userId);
        log.debug("User {} like status for post {}: {}", userId, postId, isLiked);
        
        return isLiked;
    }
    
    // Get like count for a post
    @Transactional(readOnly = true)
    public long getLikeCount(Integer postId) {
        log.debug("Getting like count for post: {}", postId);
        
        // Verify post exists
        if (!postRepository.existsById(postId)) {
            log.warn("Post not found when getting like count: {}", postId);
            throw new RuntimeException("Post not found with id: " + postId);
        }
        
        long count = likeRepository.countByPost_PostId(postId);
        log.debug("Post {} has {} likes", postId, count);
        
        return count;
    }
    
    // Get like count by user (posts liked by user)
    @Transactional(readOnly = true)
    public long getLikeCountByUser(Integer userId) {
        log.debug("Getting like count by user: {}", userId);
        
        long count = likeRepository.countByUser_Id(userId);
        log.debug("User {} has liked {} posts", userId, count);
        
        return count;
    }
}