package com.example.security.Other.community.post;

   import com.example.security.Other.community.comments.Comment;
import com.example.security.user.User;
   import lombok.Data;
   import java.time.LocalDateTime;

   @Data
   public class CommentResponseDTO {
       private Integer commentId;
       private String content;
       private User user;
       private LocalDateTime createdAt;

       public static CommentResponseDTO fromComment(Comment comment) {
           CommentResponseDTO dto = new CommentResponseDTO();
           dto.setCommentId(comment.getCommentId());
           dto.setContent(comment.getContent());
           dto.setUser(comment.getUser());
           dto.setCreatedAt(comment.getCreatedAt());
           return dto;
       }
   }