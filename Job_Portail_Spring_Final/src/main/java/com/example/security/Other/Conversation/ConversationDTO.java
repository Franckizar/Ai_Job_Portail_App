package com.example.security.Other.Conversation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationDTO {
    private Integer id;
    private LocalDateTime createdAt;
    private List<ParticipantDTO> participants;
    private MessageDTO lastMessage; // Optional: to show last message in conversations list
    private Integer unreadCount; // Optional: for unread message count
}