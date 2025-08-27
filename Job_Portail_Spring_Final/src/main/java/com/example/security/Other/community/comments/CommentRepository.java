package com.example.security.Other.community.comments;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {
    
    // Find comments by post ID, ordered by creation date
    List<Comment> findByPost_PostIdOrderByCreatedAtAsc(Integer postId);
    
    // Find comments by user ID
    List<Comment> findByUser_IdOrderByCreatedAtDesc(Integer userId);
    
    // Count comments by post ID
    long countByPost_PostId(Integer postId);
    
    // Find comment with user details
    @Query("SELECT c FROM Comment c LEFT JOIN FETCH c.user WHERE c.commentId = :commentId")
    Optional<Comment> findByIdWithUser(@Param("commentId") Integer commentId);
    
    // Count comments by user
    long countByUser_Id(Integer userId);
}
