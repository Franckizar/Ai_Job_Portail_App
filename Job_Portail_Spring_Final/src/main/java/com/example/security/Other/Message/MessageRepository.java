package com.example.security.Other.Message;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Integer> {

    // Find messages by conversation ID ordered by timestamp
    @Query("SELECT m FROM Message m WHERE m.conversation.id = :conversationId ORDER BY m.timestamp ASC")
    List<Message> findByConversationIdOrderByTimestampAsc(@Param("conversationId") Integer conversationId);

    // Find messages by conversation ID ordered by timestamp (descending)
    @Query("SELECT m FROM Message m WHERE m.conversation.id = :conversationId ORDER BY m.timestamp DESC")
    List<Message> findByConversationIdOrderByTimestampDesc(@Param("conversationId") Integer conversationId);

    // Find messages sent by a specific user
    @Query("SELECT m FROM Message m WHERE m.sender.id = :senderId ORDER BY m.timestamp DESC")
    List<Message> findBySenderIdOrderByTimestampDesc(@Param("senderId") Integer senderId);

    // Find messages received by a specific user
    @Query("SELECT m FROM Message m WHERE m.receiver.id = :receiverId ORDER BY m.timestamp DESC")
    List<Message> findByReceiverIdOrderByTimestampDesc(@Param("receiverId") Integer receiverId);

    // Find latest message in each conversation for a user
    @Query("""
        SELECT m FROM Message m 
        WHERE m.id IN (
            SELECT MAX(m2.id) FROM Message m2 
            WHERE m2.conversation.id IN (
                SELECT cp.conversation.id FROM ConversationParticipant cp 
                WHERE cp.user.id = :userId
            )
            GROUP BY m2.conversation.id
        )
        ORDER BY m.timestamp DESC
    """)
    List<Message> findLatestMessagesByUserId(@Param("userId") Integer userId);

    // Count unread messages for a user
    @Query("""
        SELECT COUNT(m) FROM Message m 
        WHERE m.receiver.id = :userId AND m.isRead = false
    """)
    long countUnreadMessages(@Param("userId") Integer userId);

    // Additional useful queries
    @Query("""
        SELECT m FROM Message m 
        WHERE m.conversation.id = :conversationId 
        AND (m.sender.id = :userId OR m.receiver.id = :userId)
        ORDER BY m.timestamp ASC
    """)
    List<Message> findConversationMessagesForUser(
        @Param("conversationId") Integer conversationId,
        @Param("userId") Integer userId
    );

    @Query("""
        SELECT m FROM Message m 
        WHERE m.conversation.id = :conversationId 
        AND m.timestamp > :since
        ORDER BY m.timestamp ASC
    """)
    List<Message> findNewMessagesSince(
        @Param("conversationId") Integer conversationId,
        @Param("since") LocalDateTime since
    );




        // ... (keep existing queries)
    
    @Query("""
        SELECT m FROM Message m
        JOIN FETCH m.sender
        LEFT JOIN FETCH m.receiver
        WHERE m.conversation.id = :conversationId
        ORDER BY m.timestamp ASC
    """)
    List<Message> findFullMessagesByConversation(@Param("conversationId") Integer conversationId);

}