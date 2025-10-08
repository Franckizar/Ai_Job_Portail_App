package com.example.security.Other.Rating;

import com.example.security.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Integer> {

    // Find all ratings for a specific user (who is being rated)
    List<Rating> findByRatedUserOrderByCreatedAtDesc(User ratedUser);

    // Find all ratings given by a specific user (who is rating others)
    List<Rating> findByRaterOrderByCreatedAtDesc(User rater);

    // Find ratings for a specific user by category
    List<Rating> findByRatedUserAndCategoryOrderByCreatedAtDesc(User ratedUser, Rating.RatingCategory category);

    // Find ratings for a specific user by type (JOB_SEEKER or TECHNICIAN)
    List<Rating> findByRatedUserAndRatedUserTypeOrderByCreatedAtDesc(User ratedUser, Rating.RatedUserType ratedUserType);

    // Check if a user has already rated another user for a specific category
    Optional<Rating> findByRaterAndRatedUserAndCategory(User rater, User ratedUser, Rating.RatingCategory category);

    // Get average rating for a user
    @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.ratedUser = :user")
    Double getAverageRatingForUser(@Param("user") User user);

    // Get average rating for a user by category
    @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.ratedUser = :user AND r.category = :category")
    Double getAverageRatingForUserByCategory(@Param("user") User user, @Param("category") Rating.RatingCategory category);

    // Get total count of ratings for a user
    @Query("SELECT COUNT(r) FROM Rating r WHERE r.ratedUser = :user")
    Long getTotalRatingCountForUser(@Param("user") User user);

    // Get rating distribution for a user (count of each star rating)
    @Query("SELECT r.rating, COUNT(r) FROM Rating r WHERE r.ratedUser = :user GROUP BY r.rating ORDER BY r.rating")
    List<Object[]> getRatingDistributionForUser(@Param("user") User user);

    // Get recent ratings for a user (limit to last N ratings)
    @Query("SELECT r FROM Rating r WHERE r.ratedUser = :user ORDER BY r.createdAt DESC")
    List<Rating> getRecentRatingsForUser(@Param("user") User user);

    // Get top rated users by type
    @Query("SELECT r.ratedUser, AVG(r.rating) as avgRating FROM Rating r WHERE r.ratedUserType = :userType GROUP BY r.ratedUser HAVING COUNT(r) >= :minRatings ORDER BY avgRating DESC")
    List<Object[]> getTopRatedUsersByType(@Param("userType") Rating.RatedUserType userType, @Param("minRatings") Long minRatings);

    // Delete all ratings for a user (when user is deleted)
    void deleteByRatedUser(User ratedUser);
    void deleteByRater(User rater);

    // Find ratings between two users
    List<Rating> findByRaterAndRatedUser(User rater, User ratedUser);

    // Get ratings with pagination
    @Query("SELECT r FROM Rating r WHERE r.ratedUser = :user ORDER BY r.createdAt DESC")
    List<Rating> findRatingsForUserWithLimit(@Param("user") User user, org.springframework.data.domain.Pageable pageable);
}
}