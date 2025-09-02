package com.example.security.Other.community.post;

import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class PostMapper {

    public PostResponseDTO toResponseDTO(Post post) {
        PostResponseDTO dto = new PostResponseDTO();
        dto.setPostId(post.getPostId());
        dto.setContent(post.getContent());
        dto.setMediaUrl(post.getMediaUrl());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());

        // Convert user
        if (post.getUser() != null) {
            PostResponseDTO.UserDTO userDTO = new PostResponseDTO.UserDTO();
            userDTO.setId(post.getUser().getId());
            userDTO.setFirstname(post.getUser().getFirstname());
            userDTO.setLastname(post.getUser().getLastname());
            userDTO.setEmail(post.getUser().getEmail());

            if (post.getUser().getRoles() != null) {
                userDTO.setRoles(post.getUser().getRoles().stream()
                        .map(Object::toString)
                        .collect(Collectors.toList()));
            }

            dto.setUser(userDTO);
        }

        // Convert comments
        if (post.getComments() != null) {
            dto.setComments(post.getComments().stream()
                    .map(comment -> {
                        PostResponseDTO.CommentDTO commentDTO = new PostResponseDTO.CommentDTO();
                        commentDTO.setCommentId(comment.getCommentId());
                        commentDTO.setContent(comment.getContent());
                        commentDTO.setCreatedAt(comment.getCreatedAt());

                        if (comment.getUser() != null) {
                            PostResponseDTO.UserDTO commentUserDTO = new PostResponseDTO.UserDTO();
                            commentUserDTO.setId(comment.getUser().getId());
                            commentUserDTO.setFirstname(comment.getUser().getFirstname());
                            commentUserDTO.setLastname(comment.getUser().getLastname());
                            commentUserDTO.setEmail(comment.getUser().getEmail());

                            if (comment.getUser().getRoles() != null) {
                                commentUserDTO.setRoles(comment.getUser().getRoles().stream()
                                        .map(Object::toString)
                                        .collect(Collectors.toList()));
                            }

                            commentDTO.setUser(commentUserDTO);
                        }

                        return commentDTO;
                    })
                    .collect(Collectors.toList()));
        }

        // Count likes and comments
        dto.setLikeCount(post.getLikes() != null ? post.getLikes().size() : 0);
        dto.setCommentCount(post.getComments() != null ? post.getComments().size() : 0);

        return dto;
    }
}