// File 13: DTOs
package com.example.security.Other.community.comments;

import lombok.*;

import java.util.List;



@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentRequest {
    private Long postId;
    private String content;
}

