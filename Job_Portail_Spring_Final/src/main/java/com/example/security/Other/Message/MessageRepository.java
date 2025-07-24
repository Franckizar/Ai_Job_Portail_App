package com.example.security.Other.Message;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Integer> {

    // Find messages by conversation ID ordered by timestamp
    List<Message> findByConversationIdOrderByTimestampAsc(Integer conversationId);

    // Find messages by conversation ID ordered by timestamp (descending)
    List<Message> findByConversationIdOrderByTimestampDesc(Integer conversationId);

    // Find messages sent by a specific user
    List<Message> findBySenderIdOrderByTimestampDesc(Integer senderId);

    // Find messages received by a specific user
    List<Message> findByReceiverIdOrderByTimestampDesc(Integer receiverId);

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

    // Count unread messages for a user (you'd need to add a 'read' field to Message entity)
    @Query("""
        SELECT COUNT(m) FROM Message m 
        WHERE m.receiverId = :userId AND m.isRead = false
    """)
    long countUnreadMessages(@Param("userId") Integer userId);
}