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

 public Conversation createConversation(List<Integer> userIds) {
    // Save the conversation first
    Conversation conversation = conversationRepository.save(Conversation.builder().build());

    // Loop through user IDs and add them as participants
    for (Integer userId : userIds) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        ConversationParticipant participant = ConversationParticipant.builder()
                .conversation(conversation)
                .user(user)
                .build();

        participantRepository.save(participant);
        conversation.addParticipant(participant);
    }

    return conversation;
}


    // Add participant to existing conversation
    public ConversationParticipant addParticipant(Integer conversationId, Integer userId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        boolean exists = participantRepository.existsById(new ConversationParticipantId(conversationId, userId));
        if (exists) {
            throw new IllegalStateException("User already participant");
        }

        ConversationParticipant participant = ConversationParticipant.builder()
                .conversation(conversation)
                .user(user)
                .build();

        return participantRepository.save(participant);
    }

    // Send a message in existing conversation
    public Message sendMessage(Integer conversationId, Integer senderId, String content) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));

        boolean senderIsParticipant = participantRepository.existsById(
                new ConversationParticipantId(conversationId, senderId));
        if (!senderIsParticipant) {
            throw new IllegalArgumentException("Sender is not a participant in this conversation");
        }

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("Sender not found"));

        Message message = Message.builder()
                .senderId(senderId)
                .content(content)
                .conversation(conversation)
                .timestamp(LocalDateTime.now())
                .build();

        return messageRepository.save(message);
    }

    // Send direct message between two users (create conversation if needed)
    public Message sendDirectMessage(Integer senderId, Integer receiverId, String content) {
        Optional<Conversation> existingConversationOpt = findConversationBetweenUsers(senderId, receiverId);

        Conversation conversation;

        if (existingConversationOpt.isPresent()) {
            conversation = existingConversationOpt.get();
        } else {
            // Create new conversation
            conversation = Conversation.builder().build();

            // Fetch users once
            User sender = userRepository.findById(senderId)
                    .orElseThrow(() -> new IllegalArgumentException("Sender not found"));
            User receiver = userRepository.findById(receiverId)
                    .orElseThrow(() -> new IllegalArgumentException("Receiver not found"));

            // Add participants before saving conversation to avoid duplicate session issues
            ConversationParticipant senderParticipant = ConversationParticipant.builder()
                    .conversation(conversation)
                    .user(sender)
                    .build();

            ConversationParticipant receiverParticipant = ConversationParticipant.builder()
                    .conversation(conversation)
                    .user(receiver)
                    .build();

            conversation.getParticipants().add(senderParticipant);
            conversation.getParticipants().add(receiverParticipant);

            // Save conversation + participants via cascade
            conversation = conversationRepository.save(conversation);
        }

        // Create and save message linked to conversation
        Message message = Message.builder()
                .senderId(senderId)
                .receiverId(receiverId)
                .content(content)
                .conversation(conversation)
                .timestamp(LocalDateTime.now())
                .build();

        return messageRepository.save(message);
    }

    // Find conversation between two users
    private Optional<Conversation> findConversationBetweenUsers(Integer user1Id, Integer user2Id) {
        return conversationRepository.findConversationBetweenTwoUsers(user1Id, user2Id);
    }

    // Get all messages for a conversation
    public List<Message> getMessages(Integer conversationId) {
        return messageRepository.findByConversationIdOrderByTimestampAsc(conversationId);
    }

    // Get participants of a conversation
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
