package com.example.security.Other.community.post;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class PostResponseDTO {
    private Integer postId;
    private String content;
    private String mediaUrl;
    private UserDTO user;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CommentDTO> comments;
    private Integer likeCount;
    private Integer commentCount;

    @Data
    public static class UserDTO {
        private Integer id;
        private String firstname;
        private String lastname;
        private String email;
        private List<String> roles;
    }

    @Data
    public static class CommentDTO {
        private Integer commentId;
        private String content;
        private UserDTO user;
        private LocalDateTime createdAt;
    }
}