package com.example.security.Other.ConversationParticipant;

import com.example.security.Other.ConversationParticipantId.ConversationParticipantId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversationParticipantRepository extends JpaRepository<ConversationParticipant, ConversationParticipantId> {

    // Find all participants in a conversation
    List<ConversationParticipant> findByConversationId(Integer conversationId);

    // Find all conversations a user participates in
    List<ConversationParticipant> findByUserId(Integer userId);

    // Check if user is participant in conversation
    boolean existsByConversationIdAndUserId(Integer conversationId, Integer userId);

    // Count participants in a conversation
    long countByConversationId(Integer conversationId);

    // Find participants excluding a specific user (useful for getting "other" participants)
    @Query("SELECT cp FROM ConversationParticipant cp WHERE cp.conversation.id = :conversationId AND cp.user.id != :excludeUserId")
    List<ConversationParticipant> findByConversationIdAndUserIdNot(@Param("conversationId") Integer conversationId, 
                                                                   @Param("excludeUserId") Integer excludeUserId);

    // Remove participant from conversation
    void deleteByConversationIdAndUserId(Integer conversationId, Integer userId);

    // Find conversations between specific users
    @Query("""
        SELECT DISTINCT cp1.conversation FROM ConversationParticipant cp1 
        JOIN ConversationParticipant cp2 ON cp1.conversation.id = cp2.conversation.id 
        WHERE cp1.user.id = :user1Id AND cp2.user.id = :user2Id
    """)
    List<ConversationParticipant> findConversationsBetweenUsers(@Param("user1Id") Integer user1Id, 
                                                               @Param("user2Id") Integer user2Id);
}