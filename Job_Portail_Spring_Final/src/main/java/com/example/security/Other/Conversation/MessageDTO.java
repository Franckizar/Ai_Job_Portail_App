package com.example.security.Other.Conversation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO {
    private Integer id;
    private String content;
    private LocalDateTime timestamp;
    private Boolean isRead;
    private String messageType;
    private UserDTO sender;
    private UserDTO receiver; // For direct messages
    private Boolean isFromCurrentUser; // Will be set based on current user context
}