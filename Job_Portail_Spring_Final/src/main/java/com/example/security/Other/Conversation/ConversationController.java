package com.example.security.Other.Conversation;


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

    // Response DTOs for standardized responses
    public static record ApiResponse<T>(boolean success, String message, T data, String error) {
        public static <T> ApiResponse<T> success(T data) {
            return new ApiResponse<>(true, "Success", data, null);
        }
        
        public static <T> ApiResponse<T> success(String message, T data) {
            return new ApiResponse<>(true, message, data, null);
        }
        
        public static <T> ApiResponse<T> error(String error) {
            return new ApiResponse<>(false, null, null, error);
        }
    }

    // --- Create a new conversation (group or 1-1) ---
    @PostMapping
    public ResponseEntity<ApiResponse<ConversationDTO>> createConversation(@RequestBody CreateConversationRequest request) {
        if (request.userIds() == null || request.userIds().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("User IDs list is required and cannot be empty"));
        }

        if (request.userIds().size() < 2) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("At least 2 users are required to create a conversation"));
        }

        try {
            ConversationDTO conversation = conversationService.createConversation(request.userIds());
            return ResponseEntity.ok(ApiResponse.success("Conversation created successfully", conversation));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to create conversation: " + e.getMessage()));
        }
    }

    // --- Add a participant to an existing conversation ---
    @PostMapping("/{conversationId}/participants/{userId}")
    public ResponseEntity<ApiResponse<ConversationDTO>> addParticipant(
            @PathVariable Integer conversationId,
            @PathVariable Integer userId) {
        try {
            ConversationDTO conversation = conversationService.addParticipant(conversationId, userId);
            return ResponseEntity.ok(ApiResponse.success("Participant added successfully", conversation));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to add participant: " + e.getMessage()));
        }
    }

    // --- Send a message in an existing conversation ---
    @PostMapping("/{conversationId}/messages")
    public ResponseEntity<ApiResponse<MessageDTO>> sendMessage(
            @PathVariable Integer conversationId,
            @RequestBody SendMessageRequest request) {

        if (request.senderId() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Sender ID is required"));
        }

        if (request.messageText() == null || request.messageText().trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Message text is required and cannot be empty"));
        }

        try {
            MessageDTO message = conversationService.sendMessage(
                    conversationId, request.senderId(), request.messageText().trim());
            return ResponseEntity.ok(ApiResponse.success("Message sent successfully", message));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to send message: " + e.getMessage()));
        }
    }

    // --- Send direct message (creates new conversation if needed) ---
    @PostMapping("/direct")
    public ResponseEntity<ApiResponse<MessageDTO>> sendDirectMessage(@RequestBody SendDirectMessageRequest request) {
        if (request.senderId() == null || request.receiverId() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Sender ID and receiver ID are required"));
        }

        if (request.senderId().equals(request.receiverId())) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Cannot send message to yourself"));
        }

        if (request.messageText() == null || request.messageText().trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Message text is required and cannot be empty"));
        }

        try {
            MessageDTO message = conversationService.sendDirectMessage(
                    request.senderId(), request.receiverId(), request.messageText().trim());
            return ResponseEntity.ok(ApiResponse.success("Direct message sent successfully", message));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to send direct message: " + e.getMessage()));
        }
    }

    // --- Get all messages from a conversation ---
    @GetMapping("/{conversationId}/messages")
    public ResponseEntity<ApiResponse<List<MessageDTO>>> getMessages(
            @PathVariable Integer conversationId,
            @RequestParam Integer userId) {
        
        if (userId == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("User ID parameter is required"));
        }

        try {
            List<MessageDTO> messages = conversationService.getMessages(conversationId, userId);
            return ResponseEntity.ok(ApiResponse.success(messages));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(403).body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to fetch messages: " + e.getMessage()));
        }
    }

    // --- Get participants of a conversation ---
    @GetMapping("/{conversationId}/participants")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getParticipants(@PathVariable Integer conversationId) {
        try {
            List<UserDTO> participants = conversationService.getParticipants(conversationId);
            return ResponseEntity.ok(ApiResponse.success(participants));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to fetch participants: " + e.getMessage()));
        }
    }

    // --- Get all conversations for a user ---
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<ConversationDTO>>> getUserConversations(@PathVariable Integer userId) {
        try {
            List<ConversationDTO> conversations = conversationService.getUserConversations(userId);
            return ResponseEntity.ok(ApiResponse.success(conversations));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to fetch conversations: " + e.getMessage()));
        }
    }

    // --- Get conversation by ID ---
    @GetMapping("/{conversationId}")
    public ResponseEntity<ApiResponse<ConversationDTO>> getConversationById(@PathVariable Integer conversationId) {
        try {
            ConversationDTO conversation = conversationService.getConversationById(conversationId);
            return ResponseEntity.ok(ApiResponse.success(conversation));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to fetch conversation: " + e.getMessage()));
        }
    }

    // --- Check if conversation exists between two users ---
    @GetMapping("/between/{user1Id}/{user2Id}")
    public ResponseEntity<ApiResponse<ConversationDTO>> getConversationBetweenUsers(
            @PathVariable Integer user1Id, 
            @PathVariable Integer user2Id) {
        
        if (user1Id.equals(user2Id)) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Cannot find conversation between same user"));
        }

        try {
            var conversationOpt = conversationService.findConversationBetweenUsersDTO(user1Id, user2Id);
            if (conversationOpt.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success(conversationOpt.get()));
            } else {
                return ResponseEntity.status(404)
                        .body(ApiResponse.error("No conversation found between these users"));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to find conversation: " + e.getMessage()));
        }
    }
}