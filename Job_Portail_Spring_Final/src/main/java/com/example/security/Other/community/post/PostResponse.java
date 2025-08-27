// File 13: DTOs
package com.example.security.Other.community.post;

import lombok.*;

import java.util.List;

import com.example.security.Other.community.comments.Comment;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {
    private Post post;
    private long likeCount;
    private boolean isLiked;
    private List<Comment> comments;
}
