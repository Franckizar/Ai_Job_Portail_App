package com.example.security.Other.Message;

import com.example.security.Other.Conversation.Conversation;
import com.example.security.user.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private Integer id;


    @Column(name = "sender_id", nullable = false)
    private Integer senderId;

    @Column(name = "receiver_id")
    private Integer receiverId; // Optional for group chats

    @Column(name = "message_text",nullable = false, columnDefinition = "TEXT")
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "messages", "participants"})
    private Conversation conversation;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private Boolean isRead = false;

    @Column(name = "message_type")
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private MessageType messageType = MessageType.TEXT;

    // Optional: Reference to sender user entity
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User sender;

    // Optional: Reference to receiver user entity
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User receiver;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }

    // Enum for message types
    public enum MessageType {
        TEXT,
        IMAGE,
        FILE,
        SYSTEM // For system messages like "User joined", "User left", etc.
    }

    // Helper methods
    public boolean isFromUser(Integer userId) {
        return senderId != null && senderId.equals(userId);
    }

    public boolean isToUser(Integer userId) {
        return receiverId != null && receiverId.equals(userId);
    }

    public void markAsRead() {
        this.isRead = true;
    }
}