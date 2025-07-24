package com.example.security.Other.Message;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

import com.example.security.Other.Message.Message.MessageType;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDTO {
    private Integer messageId;
    private String content;
    private LocalDateTime timestamp;
    private boolean isRead;
    private MessageType messageType;
    private boolean isFromCurrentUser;
    private UserDTO sender;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDTO {
        private Integer id;
        private String firstname;
        private String lastname;
        private String email;
    }
}