package com.example.security.Other.community.post;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {
    
    // Find all posts ordered by creation date (newest first)
    List<Post> findAllByOrderByCreatedAtDesc();
    
    // Find posts by user ID
    List<Post> findByUser_IdOrderByCreatedAtDesc(Integer userId);
    
    // Find posts with pagination
    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    // Custom query to find post with user details
    @Query("SELECT p FROM Post p LEFT JOIN FETCH p.user WHERE p.postId = :postId")
    Optional<Post> findByIdWithUser(@Param("postId") Integer postId);
    
    // Count posts by user
    long countByUser_Id(Integer userId);

    
    // List<Post> findAllByOrderByCreatedAtDesc();

    List<Post> findAllByUser_IdOrderByCreatedAtDesc(Integer userId);

    // @Query("SELECT p FROM Post p JOIN FETCH p.user WHERE p.postId = :postId")
    // Optional<Post> findByIdWithUser(Integer postId);
    //  Optional<Post> findById(Integer postId);

       Optional<Post> findById(Integer postId);
       List<Post> findByUserId(Integer userId);
}

