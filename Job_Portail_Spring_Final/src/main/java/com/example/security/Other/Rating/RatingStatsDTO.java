package com.example.security.Other.Rating;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RatingStatsDTO {
    private Integer userId;
    private String userName;
    private String userEmail;
    private Rating.RatedUserType userType;
    private Double averageRating;
    private Long totalRatings;
    private Map<Integer, Long> ratingDistribution; // star rating -> count
    private Map<Rating.RatingCategory, Double> categoryAverages;
    private Map<Rating.RatingCategory, Long> categoryCounts;
    
    // Helper method to get formatted average rating
    public String getFormattedAverageRating() {
        if (averageRating == null) {
            return "0.0";
        }
        return String.format("%.1f", averageRating);
    }
    
    // Helper method to get star display
    public String getStarDisplay() {
        if (averageRating == null) {
            return "☆☆☆☆☆";
        }
        
        int fullStars = averageRating.intValue();
        boolean hasHalfStar = (averageRating - fullStars) >= 0.5;
        
        StringBuilder stars = new StringBuilder();
        
        // Add full stars
        for (int i = 0; i < fullStars && i < 5; i++) {
            stars.append("★");
        }
        
        // Add half star if needed
        if (hasHalfStar && fullStars < 5) {
            stars.append("☆");
            fullStars++;
        }
        
        // Add empty stars
        for (int i = fullStars; i < 5; i++) {
            stars.append("☆");
        }
        
        return stars.toString();
    }
    
    // Helper method to get rating level description
    public String getRatingLevel() {
        if (averageRating == null || averageRating == 0) {
            return "Not Rated";
        } else if (averageRating < 2.0) {
            return "Poor";
        } else if (averageRating < 3.0) {
            return "Fair";
        } else if (averageRating < 4.0) {
            return "Good";
        } else if (averageRating < 4.5) {
            return "Very Good";
        } else {
            return "Excellent";
        }
    }
}