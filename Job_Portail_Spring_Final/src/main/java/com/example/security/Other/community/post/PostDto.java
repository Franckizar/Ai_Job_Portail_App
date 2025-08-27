// File: src/main/java/com/example/security/Other/Post/PostDto.java
package com.example.security.Other.community.post;

// import com.example.security.Other.Comment.CommentDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

import com.example.security.Other.community.comments.CommentDto;

public class PostDto {
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PostRequest {
        private String content;
        private String mediaUrl;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PostResponse {
        private Integer postId;
        private UserInfo user;
        private String content;
        private String mediaUrl;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private int likeCount;
        private int commentCount;
        private boolean isLikedByCurrentUser;
        private List<CommentDto.CommentResponse> comments;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private Integer id;
        private String firstname;
        private String lastname;
        private String email;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PostSummary {
        private Integer postId;
        private UserInfo user;
        private String content;
        private String mediaUrl;
        private LocalDateTime createdAt;
        private int likeCount;
        private int commentCount;
        private boolean isLikedByCurrentUser;
    }
}