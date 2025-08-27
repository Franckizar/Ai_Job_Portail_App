package com.example.security.Other.community.like;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Integer> {
    
    // Check if user liked a specific post
    Optional<Like> findByPost_PostIdAndUser_Id(Integer postId, Integer userId);
    
    // Count likes for a specific post
    long countByPost_PostId(Integer postId);
    
    // Check if user liked a post (returns boolean)
    boolean existsByPost_PostIdAndUser_Id(Integer postId, Integer userId);
    
    // Delete like by post and user
    void deleteByPost_PostIdAndUser_Id(Integer postId, Integer userId);
    
    // Count likes by user
    long countByUser_Id(Integer userId);
}

// ================================
