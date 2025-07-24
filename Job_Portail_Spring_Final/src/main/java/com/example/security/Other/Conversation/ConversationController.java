package com.example.security.Other.Conversation;

import com.example.security.Other.ConversationParticipant.ConversationParticipant;
import com.example.security.Other.Message.Message;
import com.example.security.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth/conversations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ConversationController {

    private final ConversationService conversationService;

    // --- DTOs ---
    public static record CreateConversationRequest(List<Integer> userIds) {}
    public static record SendMessageRequest(Integer senderId, String messageText) {}
    public static record SendDirectMessageRequest(Integer senderId, Integer receiverId, String messageText) {}

    // --- Create a new conversation (group or 1-1) ---
    @PostMapping
    public ResponseEntity<?> createConversation(@RequestBody CreateConversationRequest request) {
        if (request.userIds() == null || request.userIds().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User IDs list is required."));
        }
        try {
            Conversation conversation = conversationService.createConversation(request.userIds());
            return ResponseEntity.ok(conversation);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    // --- Add a participant to an existing conversation ---
    @PostMapping("/{conversationId}/participants/{userId}")
    public ResponseEntity<?> addParticipant(
            @PathVariable Integer conversationId,
            @PathVariable Integer userId) {
        try {
            ConversationParticipant participant = conversationService.addParticipant(conversationId, userId);
            return ResponseEntity.ok(participant);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // --- Send a message in an existing conversation ---
    @PostMapping("/{conversationId}/messages")
    public ResponseEntity<?> sendMessage(
            @PathVariable Integer conversationId,
            @RequestBody SendMessageRequest request) {

        if (request.senderId() == null || request.messageText() == null || request.messageText().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "senderId and messageText are required."));
        }

        try {
            Message message = conversationService.sendMessage(conversationId, request.senderId(), request.messageText());
            return ResponseEntity.ok(message);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // --- Send direct message (creates new conversation if needed) ---
    @PostMapping("/direct")
    public ResponseEntity<?> sendDirectMessage(@RequestBody SendDirectMessageRequest request) {
        if (request.senderId() == null || request.receiverId() == null ||
            request.messageText() == null || request.messageText().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "senderId, receiverId, and messageText are required."));
        }

        try {
            Message message = conversationService.sendDirectMessage(
                    request.senderId(), request.receiverId(), request.messageText());
            return ResponseEntity.ok(message);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // --- Get all messages from a conversation ---
    @GetMapping("/{conversationId}/messages")
    public ResponseEntity<?> getMessages(@PathVariable Integer conversationId) {
        try {
            List<Message> messages = conversationService.getMessages(conversationId);
            return ResponseEntity.ok(messages);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(Map.of("error", "Conversation not found"));
        }
    }

    // --- Get participants of a conversation ---
    @GetMapping("/{conversationId}/participants")
    public ResponseEntity<?> getParticipants(@PathVariable Integer conversationId) {
        try {
            List<User> participants = conversationService.getParticipants(conversationId);
            return ResponseEntity.ok(participants);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(Map.of("error", "Conversation not found"));
        }
    }

    // --- Get all conversations for a user ---
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserConversations(@PathVariable Integer userId) {
        try {
            List<Conversation> conversations = conversationService.getUserConversations(userId);
            return ResponseEntity.ok(conversations);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    // --- Get conversation by ID (renamed to avoid path conflict with "/direct") ---
    // @GetMapping("/by-id/{conversationId}")
    // public ResponseEntity<?> getConversationById(@PathVariable Integer conversationId) {
    //     try {
    //         Conversation conversation = conversationService.getConversationById(conversationId);
    //         return ResponseEntity.ok(conversation);
    //     } catch (IllegalArgumentException e) {
    //         return ResponseEntity.status(404).body(Map.of("error", "Conversation not found"));
    //     }
    // }
}
