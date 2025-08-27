// File 13: DTOs
package com.example.security.Other.community.like;

import lombok.*;

import java.util.List;



@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LikeResponse {
    private boolean isLiked;
    private long likeCount;
}
