package com.example.security.Other.Conversation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Integer> {

    /**
     * Find a conversation that exists between exactly two users.
     */
    @Query("""
        SELECT c FROM Conversation c 
        WHERE c.id IN (
            SELECT cp1.conversation.id FROM ConversationParticipant cp1 
            WHERE cp1.user.id = :user1Id
        )
        AND c.id IN (
            SELECT cp2.conversation.id FROM ConversationParticipant cp2 
            WHERE cp2.user.id = :user2Id
        )
        AND (
            SELECT COUNT(cp) FROM ConversationParticipant cp 
            WHERE cp.conversation.id = c.id
        ) = 2
    """)
    Optional<Conversation> findConversationBetweenTwoUsers(
        @Param("user1Id") Integer user1Id,
        @Param("user2Id") Integer user2Id
    );

    /**
     * Get all conversations for a specific user, ordered by creation date (most recent first).
     */
    @Query("""
        SELECT DISTINCT c FROM Conversation c
        JOIN c.participants cp
        WHERE cp.user.id = :userId
        ORDER BY c.createdAt DESC
    """)
    List<Conversation> findConversationsByUserId(@Param("userId") Integer userId);

    /**
     * Find a conversation involving a specific group of users (group chat),
     * only when all users are part of that conversation and no extra user is present.
     */
    @Query("""
        SELECT c FROM Conversation c
        WHERE c.id IN (
            SELECT cp.conversation.id FROM ConversationParticipant cp
            WHERE cp.user.id IN :userIds
            GROUP BY cp.conversation.id
            HAVING COUNT(DISTINCT cp.user.id) = :userCount
        )
    """)
    List<Conversation> findConversationsByParticipants(
        @Param("userIds") List<Integer> userIds,
        @Param("userCount") long userCount
    );
}
