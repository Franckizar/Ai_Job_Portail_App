package com.example.security.Other.Rating;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RatingDTO {
    private Integer id;
    private Integer raterId;
    private String raterName;
    private String raterEmail;
    private Integer ratedUserId;
    private String ratedUserName;
    private String ratedUserEmail;
    private Integer rating;
    private String comment;
    private Rating.RatingCategory category;
    private String categoryDisplayName;
    private Rating.RatedUserType ratedUserType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Convert from Rating entity to DTO
    public static RatingDTO fromEntity(Rating rating) {
        return RatingDTO.builder()
                .id(rating.getId())
                .raterId(rating.getRater().getId())
                .raterName(rating.getRaterName())
                .raterEmail(rating.getRaterEmail())
                .ratedUserId(rating.getRatedUser().getId())
                .ratedUserName(rating.getRatedUserName())
                .ratedUserEmail(rating.getRatedUserEmail())
                .rating(rating.getRating())
                .comment(rating.getComment())
                .category(rating.getCategory())
                .categoryDisplayName(rating.getCategory().getDisplayName())
                .ratedUserType(rating.getRatedUserType())
                .createdAt(rating.getCreatedAt())
                .updatedAt(rating.getUpdatedAt())
                .build();
    }
}