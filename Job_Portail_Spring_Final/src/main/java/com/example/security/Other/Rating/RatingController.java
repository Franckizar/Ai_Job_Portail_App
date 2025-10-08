package com.example.security.Other.Rating;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    /**
     * Create a new rating
     */
    @PostMapping("/{raterId}")
    public ResponseEntity<RatingDTO> createRating(
            @PathVariable Integer raterId,
            @Valid @RequestBody CreateRatingRequest request) {
        System.out.println("[RatingController] Received rating request: " + request);
        try {
            System.out.println("[RatingController] Rater ID: " + raterId);
            RatingDTO rating = ratingService.createRating(raterId, request);
            System.out.println("[RatingController] Rating created successfully: " + rating.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(rating);
        } catch (IllegalArgumentException e) {
            System.out.println("[RatingController] IllegalArgumentException: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            System.out.println("[RatingController] Exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all ratings for a specific user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RatingDTO>> getRatingsForUser(@PathVariable Integer userId) {
        try {
            List<RatingDTO> ratings = ratingService.getRatingsForUser(userId);
            return ResponseEntity.ok(ratings);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get ratings for a user by category
     */
    @GetMapping("/user/{userId}/category/{category}")
    public ResponseEntity<List<RatingDTO>> getRatingsForUserByCategory(
            @PathVariable Integer userId,
            @PathVariable Rating.RatingCategory category) {
        try {
            List<RatingDTO> ratings = ratingService.getRatingsForUserByCategory(userId, category);
            return ResponseEntity.ok(ratings);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get ratings given by a user
     */
    @GetMapping("/user/{userId}/given-ratings")
    public ResponseEntity<List<RatingDTO>> getRatingsGivenByUser(@PathVariable Integer userId) {
        try {
            List<RatingDTO> ratings = ratingService.getRatingsGivenByUser(userId);
            return ResponseEntity.ok(ratings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get comprehensive rating statistics for a user
     */
    @GetMapping("/user/{userId}/stats")
    public ResponseEntity<RatingStatsDTO> getRatingStats(@PathVariable Integer userId) {
        try {
            RatingStatsDTO stats = ratingService.getRatingStats(userId);
            return ResponseEntity.ok(stats);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get recent ratings for a user
     */
    @GetMapping("/user/{userId}/recent")
    public ResponseEntity<List<RatingDTO>> getRecentRatingsForUser(
            @PathVariable Integer userId,
            @RequestParam(defaultValue = "5") int limit) {
        try {
            List<RatingDTO> ratings = ratingService.getRecentRatingsForUser(userId, limit);
            return ResponseEntity.ok(ratings);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get top rated job seekers
     */
    @GetMapping("/top-job-seekers")
    public ResponseEntity<List<RatingStatsDTO>> getTopRatedJobSeekers(
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "3") int minRatings) {
        try {
            List<RatingStatsDTO> topRated = ratingService.getTopRatedUsers(
                    Rating.RatedUserType.JOB_SEEKER, limit, minRatings);
            return ResponseEntity.ok(topRated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get top rated technicians
     */
    @GetMapping("/top-technicians")
    public ResponseEntity<List<RatingStatsDTO>> getTopRatedTechnicians(
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "3") int minRatings) {
        try {
            List<RatingStatsDTO> topRated = ratingService.getTopRatedUsers(
                    Rating.RatedUserType.TECHNICIAN, limit, minRatings);
            return ResponseEntity.ok(topRated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Update a rating
     */
    @PutMapping("/{ratingId}/user/{userId}")
    public ResponseEntity<RatingDTO> updateRating(
            @PathVariable Integer ratingId,
            @PathVariable Integer userId,
            @Valid @RequestBody CreateRatingRequest request) {
        try {
            RatingDTO updatedRating = ratingService.updateRating(ratingId, userId, request);
            return ResponseEntity.ok(updatedRating);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Delete a rating
     */
    @DeleteMapping("/{ratingId}/user/{userId}")
    public ResponseEntity<Void> deleteRating(
            @PathVariable Integer ratingId,
            @PathVariable Integer userId) {
        try {
            ratingService.deleteRating(ratingId, userId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Check if a user can rate another user for a specific category
     */
    @GetMapping("/can-rate/{raterId}/{userId}/category/{category}")
    public ResponseEntity<Map<String, Boolean>> canRateUser(
            @PathVariable Integer raterId,
            @PathVariable Integer userId,
            @PathVariable Rating.RatingCategory category) {
        try {
            boolean canRate = ratingService.canUserRate(raterId, userId, category);
            return ResponseEntity.ok(Map.of("canRate", canRate));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get rating between two users for a specific category
     */
    @GetMapping("/between/{raterId}/{userId}/category/{category}")
    public ResponseEntity<RatingDTO> getRatingBetweenUsers(
            @PathVariable Integer raterId,
            @PathVariable Integer userId,
            @PathVariable Rating.RatingCategory category) {
        try {
            Optional<RatingDTO> rating = ratingService.getRatingBetweenUsers(raterId, userId, category);
            
            if (rating.isPresent()) {
                return ResponseEntity.ok(rating.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all available rating categories
     */
    @GetMapping("/categories")
    public ResponseEntity<List<Map<String, String>>> getRatingCategories() {
        try {
            List<Map<String, String>> categories = List.of(
                Map.of("value", "WORK_QUALITY", "label", "Work Quality"),
                Map.of("value", "COMMUNICATION", "label", "Communication"),
                Map.of("value", "PROFESSIONALISM", "label", "Professionalism"),
                Map.of("value", "PUNCTUALITY", "label", "Punctuality"),
                Map.of("value", "TECHNICAL_SKILLS", "label", "Technical Skills"),
                Map.of("value", "OVERALL", "label", "Overall Experience")
            );
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all users for rating system
     */
    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        try {
            List<com.example.security.user.User> users = ratingService.getAllUsersForRating();
            List<Map<String, Object>> userDTOs = users.stream()
                    .map(user -> {
                        Map<String, Object> dto = new HashMap<>();
                        dto.put("id", user.getId());
                        dto.put("firstname", user.getFirstname());
                        dto.put("lastname", user.getLastname());
                        dto.put("email", user.getEmail());
                        dto.put("roles", user.getRoles().stream()
                                .map(role -> role.name())
                                .collect(java.util.stream.Collectors.toList()));
                        return dto;
                    })
                    .collect(java.util.stream.Collectors.toList());
            
            return ResponseEntity.ok(userDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}