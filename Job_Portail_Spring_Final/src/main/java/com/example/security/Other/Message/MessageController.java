package com.example.security.Other.Message;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth/messages")
public class MessageController {

    private final MessageService messageService;
    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }
@GetMapping("/conversations/{conversationId}/messages")
public ResponseEntity<List<ChatMessageDTO>> getChatMessages(
        @PathVariable Integer conversationId,
        @RequestParam Integer userId) {  // Get user ID directly from request
    
    return ResponseEntity.ok(messageService.getChatMessages(conversationId, userId));
}
    
}
