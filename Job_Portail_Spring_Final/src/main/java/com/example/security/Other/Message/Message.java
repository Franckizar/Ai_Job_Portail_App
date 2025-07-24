package com.example.security.Other.Message;

import com.example.security.Other.Conversation.Conversation;
import com.example.security.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @Column(name = "message_text", nullable = false, columnDefinition = "TEXT")
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false)
    @JsonIgnore
    private Conversation conversation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    @JsonIgnore
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User receiver;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private Boolean isRead = false;

    @Column(name = "message_type")
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private MessageType messageType = MessageType.TEXT;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }

    public enum MessageType {
        TEXT, IMAGE, FILE, SYSTEM
    }

    // Helper methods
    public boolean isFromUser(Integer userId) {
        return sender != null && sender.getId().equals(userId);
    }

    public boolean isToUser(Integer userId) {
        return receiver != null && receiver.getId().equals(userId);
    }

    public void markAsRead() {
        this.isRead = true;
    }
}