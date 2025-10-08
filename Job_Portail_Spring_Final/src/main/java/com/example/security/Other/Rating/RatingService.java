package com.example.security.Other.Rating;

import com.example.security.UserRepository;
import com.example.security.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RatingService {

    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;

    /**
     * Create a new rating
     */
    public RatingDTO createRating(Integer raterId, CreateRatingRequest request) {
        System.out.println("[RatingService] Creating rating - RaterId: " + raterId + ", Request: " + request);
        
        // Validate rater exists
        User rater = userRepository.findById(raterId)
                .orElseThrow(() -> new IllegalArgumentException("Rater not found"));
        System.out.println("[RatingService] Rater found: " + rater.getEmail());

        // Validate rated user exists
        User ratedUser = userRepository.findById(request.getRatedUserId())
                .orElseThrow(() -> new IllegalArgumentException("Rated user not found"));
        System.out.println("[RatingService] Rated user found: " + ratedUser.getEmail());

        // Prevent self-rating
        if (raterId.equals(request.getRatedUserId())) {
            throw new IllegalArgumentException("Users cannot rate themselves");
        }

        // Check if rating already exists for this category
        Optional<Rating> existingRating = ratingRepository.findByRaterAndRatedUserAndCategory(
                rater, ratedUser, request.getCategory());
        System.out.println("[RatingService] Existing rating check completed");

        Rating rating;
        if (existingRating.isPresent()) {
            System.out.println("[RatingService] Updating existing rating");
            // Update existing rating
            rating = existingRating.get();
            rating.setRating(request.getRating());
            rating.setComment(request.getComment());
        } else {
            System.out.println("[RatingService] Creating new rating");
            // Create new rating
            rating = Rating.builder()
                    .rater(rater)
                    .ratedUser(ratedUser)
                    .rating(request.getRating())
                    .comment(request.getComment())
                    .category(request.getCategory())
                    .ratedUserType(request.getRatedUserType())
                    .build();
        }

        System.out.println("[RatingService] Saving rating to database");
        rating = ratingRepository.save(rating);
        System.out.println("[RatingService] Rating saved with ID: " + rating.getId());
        
        RatingDTO result = RatingDTO.fromEntity(rating);
        System.out.println("[RatingService] Rating DTO created successfully");
        return result;
    }

    /**
     * Get all ratings for a user
     */
    @Transactional(readOnly = true)
    public List<RatingDTO> getRatingsForUser(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return ratingRepository.findByRatedUserOrderByCreatedAtDesc(user)
                .stream()
                .map(RatingDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get ratings for a user by category
     */
    @Transactional(readOnly = true)
    public List<RatingDTO> getRatingsForUserByCategory(Integer userId, Rating.RatingCategory category) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return ratingRepository.findByRatedUserAndCategoryOrderByCreatedAtDesc(user, category)
                .stream()
                .map(RatingDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get ratings given by a user
     */
    @Transactional(readOnly = true)
    public List<RatingDTO> getRatingsGivenByUser(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return ratingRepository.findByRaterOrderByCreatedAtDesc(user)
                .stream()
                .map(RatingDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get comprehensive rating statistics for a user
     */
    @Transactional(readOnly = true)
    public RatingStatsDTO getRatingStats(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Get basic stats
        Double averageRating = ratingRepository.getAverageRatingForUser(user);
        Long totalRatings = ratingRepository.getTotalRatingCountForUser(user);

        // Get rating distribution
        List<Object[]> distributionData = ratingRepository.getRatingDistributionForUser(user);
        Map<Integer, Long> ratingDistribution = new HashMap<>();
        for (Object[] data : distributionData) {
            ratingDistribution.put((Integer) data[0], (Long) data[1]);
        }

        // Get category averages and counts
        Map<Rating.RatingCategory, Double> categoryAverages = new HashMap<>();
        Map<Rating.RatingCategory, Long> categoryCounts = new HashMap<>();

        for (Rating.RatingCategory category : Rating.RatingCategory.values()) {
            Double categoryAvg = ratingRepository.getAverageRatingForUserByCategory(user, category);
            List<Rating> categoryRatings = ratingRepository.findByRatedUserAndCategoryOrderByCreatedAtDesc(user, category);
            
            categoryAverages.put(category, categoryAvg);
            categoryCounts.put(category, (long) categoryRatings.size());
        }

        // Determine user type
        Rating.RatedUserType userType = Rating.RatedUserType.JOB_SEEKER;
        if (user.hasRole(com.example.security.user.Role.TECHNICIAN)) {
            userType = Rating.RatedUserType.TECHNICIAN;
        }

        return RatingStatsDTO.builder()
                .userId(userId)
                .userName(user.getFirstname() + " " + user.getLastname())
                .userEmail(user.getEmail())
                .userType(userType)
                .averageRating(averageRating != null ? averageRating : 0.0)
                .totalRatings(totalRatings != null ? totalRatings : 0L)
                .ratingDistribution(ratingDistribution)
                .categoryAverages(categoryAverages)
                .categoryCounts(categoryCounts)
                .build();
    }

    /**
     * Get recent ratings for a user with limit
     */
    @Transactional(readOnly = true)
    public List<RatingDTO> getRecentRatingsForUser(Integer userId, int limit) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Pageable pageable = PageRequest.of(0, limit);
        return ratingRepository.findRatingsForUserWithLimit(user, pageable)
                .stream()
                .map(RatingDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get top rated users by type
     */
    @Transactional(readOnly = true)
    public List<RatingStatsDTO> getTopRatedUsers(Rating.RatedUserType userType, int limit, int minRatings) {
        List<Object[]> topRatedData = ratingRepository.getTopRatedUsersByType(userType, (long) minRatings);
        
        return topRatedData.stream()
                .limit(limit)
                .map(data -> {
                    User user = (User) data[0];
                    Double avgRating = (Double) data[1];
                    
                    return RatingStatsDTO.builder()
                            .userId(user.getId())
                            .userName(user.getFirstname() + " " + user.getLastname())
                            .userEmail(user.getEmail())
                            .userType(userType)
                            .averageRating(avgRating)
                            .totalRatings(ratingRepository.getTotalRatingCountForUser(user))
                            .build();
                })
                .collect(Collectors.toList());
    }

    /**
     * Delete a rating
     */
    public void deleteRating(Integer ratingId, Integer userId) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new IllegalArgumentException("Rating not found"));

        // Only allow the rater to delete their own rating
        if (!rating.getRater().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only delete your own ratings");
        }

        ratingRepository.delete(rating);
    }

    /**
     * Update a rating
     */
    public RatingDTO updateRating(Integer ratingId, Integer userId, CreateRatingRequest request) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new IllegalArgumentException("Rating not found"));

        // Only allow the rater to update their own rating
        if (!rating.getRater().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only update your own ratings");
        }

        rating.setRating(request.getRating());
        rating.setComment(request.getComment());
        
        rating = ratingRepository.save(rating);
        return RatingDTO.fromEntity(rating);
    }

    /**
     * Check if user can rate another user
     */
    @Transactional(readOnly = true)
    public boolean canUserRate(Integer raterId, Integer ratedUserId, Rating.RatingCategory category) {
        if (raterId.equals(ratedUserId)) {
            return false; // Cannot rate self
        }

        User rater = userRepository.findById(raterId).orElse(null);
        User ratedUser = userRepository.findById(ratedUserId).orElse(null);

        if (rater == null || ratedUser == null) {
            return false;
        }

        // Check if already rated for this category
        Optional<Rating> existingRating = ratingRepository.findByRaterAndRatedUserAndCategory(
                rater, ratedUser, category);

        return existingRating.isEmpty();
    }

    /**
     * Get rating between two users for a specific category
     */
    @Transactional(readOnly = true)
    public Optional<RatingDTO> getRatingBetweenUsers(Integer raterId, Integer ratedUserId, Rating.RatingCategory category) {
        User rater = userRepository.findById(raterId).orElse(null);
        User ratedUser = userRepository.findById(ratedUserId).orElse(null);

        if (rater == null || ratedUser == null) {
            return Optional.empty();
        }

        return ratingRepository.findByRaterAndRatedUserAndCategory(rater, ratedUser, category)
                .map(RatingDTO::fromEntity);
    }

    /**
     * Get all users for rating system
     */
    @Transactional(readOnly = true)
    public List<User> getAllUsersForRating() {
        return userRepository.findAll();
    }
}