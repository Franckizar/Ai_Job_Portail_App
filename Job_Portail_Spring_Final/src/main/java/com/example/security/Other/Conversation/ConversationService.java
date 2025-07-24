package com.example.security.Other.Conversation;

import com.example.security.UserRepository;
import com.example.security.Other.ConversationParticipant.ConversationParticipant;
import com.example.security.Other.ConversationParticipant.ConversationParticipantRepository;
import com.example.security.Other.ConversationParticipantId.ConversationParticipantId;
import com.example.security.Other.Message.Message;
import com.example.security.Other.Message.MessageRepository;
import com.example.security.user.User;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final ConversationParticipantRepository participantRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    // Create a new conversation with participants
    public Conversation createConversation(List<Integer> userIds) {
        Conversation conversation = Conversation.builder().build();
        conversation = conversationRepository.save(conversation);

        for (Integer userId : userIds) {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) continue; // skip invalid users

            ConversationParticipant participant = ConversationParticipant.builder()
                    .conversation(conversation)
                    .user(userOpt.get())
                    .build();
            participantRepository.save(participant);
            conversation.addParticipant(participant);
        }

        return conversation;
    }

    // Add a participant to existing conversation
    public ConversationParticipant addParticipant(Integer conversationId, Integer userId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Check if already participant
        boolean exists = participantRepository.existsById(
                new ConversationParticipantId(conversationId, userId));
        if (exists) {
            throw new IllegalStateException("User already participant");
        }

        ConversationParticipant participant = ConversationParticipant.builder()
                .conversation(conversation)
                .user(user)
                .build();
        return participantRepository.save(participant);
    }

    // Send a message in conversation (FIXED VERSION)
    public Message sendMessage(Integer conversationId, Integer senderId, String content) {
        // Get the conversation
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));

        // Verify sender is a participant
        boolean senderIsParticipant = participantRepository.existsById(
                new ConversationParticipantId(conversationId, senderId));
        if (!senderIsParticipant) {
            throw new IllegalArgumentException("Sender is not a participant in this conversation");
        }

        // Get sender user
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("Sender not found"));

        // Create and save the message
        Message message = Message.builder()
                .senderId(senderId)
                .content(content)
                .conversation(conversation)
                .timestamp(LocalDateTime.now())
                .build();

        return messageRepository.save(message);
    }

    // Alternative: Send message between TWO users (creates conversation if needed)
    public Message sendDirectMessage(Integer senderId, Integer receiverId, String content) {
        // Check if conversation exists between sender and receiver
        Optional<Conversation> existingConversation = findConversationBetweenUsers(senderId, receiverId);

        Conversation conversation;
        
        if (existingConversation.isPresent()) {
            conversation = existingConversation.get();
        } else {
            // Create new conversation if not exists
            User sender = userRepository.findById(senderId)
                    .orElseThrow(() -> new IllegalArgumentException("Sender not found"));
            User receiver = userRepository.findById(receiverId)
                    .orElseThrow(() -> new IllegalArgumentException("Receiver not found"));

            // Create conversation
            conversation = Conversation.builder().build();
            conversation = conversationRepository.save(conversation);

            // Add both participants
            ConversationParticipant senderParticipant = ConversationParticipant.builder()
                    .conversation(conversation)
                    .user(sender)
                    .build();
            participantRepository.save(senderParticipant);
            conversation.addParticipant(senderParticipant);

            ConversationParticipant receiverParticipant = ConversationParticipant.builder()
                    .conversation(conversation)
                    .user(receiver)
                    .build();
            participantRepository.save(receiverParticipant);
            conversation.addParticipant(receiverParticipant);
        }

        // Create and save the message
        Message message = Message.builder()
                .senderId(senderId)
                .receiverId(receiverId)
                .content(content)
                .conversation(conversation)
                .timestamp(LocalDateTime.now())
                .build();

        return messageRepository.save(message);
    }

    // Helper method to find conversation between two users
    private Optional<Conversation> findConversationBetweenUsers(Integer user1Id, Integer user2Id) {
        // This assumes you have a custom query in your repository
        // You'll need to implement this in ConversationRepository
        return conversationRepository.findConversationBetweenTwoUsers(user1Id, user2Id);
    }

    // Get all messages for conversation
    public List<Message> getMessages(Integer conversationId) {
        return messageRepository.findByConversationIdOrderByTimestampAsc(conversationId);
    }

    // Get participants of conversation
    public List<User> getParticipants(Integer conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));
        return conversation.getParticipants().stream()
                .map(ConversationParticipant::getUser)
                .toList();
    }

    // Get all conversations for a user
    public List<Conversation> getUserConversations(Integer userId) {
        return conversationRepository.findConversationsByUserId(userId);
    }
}