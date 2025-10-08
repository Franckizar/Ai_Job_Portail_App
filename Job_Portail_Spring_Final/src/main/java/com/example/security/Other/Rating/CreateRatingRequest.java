package com.example.security.Other.Rating;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateRatingRequest {
    
    @NotNull(message = "Rated user ID is required")
    private Integer ratedUserId;
    
    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;
    
    private String comment;
    
    @NotNull(message = "Rating category is required")
    private Rating.RatingCategory category;
    
    @NotNull(message = "Rated user type is required")
    private Rating.RatedUserType ratedUserType;
}