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

import org.hibernate.validator.internal.util.stereotypes.Lazy;
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
    @Lazy private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ConversationMapper conversationMapper;

    // Create conversation and return DTO
    public ConversationDTO createConversation(List<Integer> userIds) {
        // Remove possible duplicate userIds
        List<Integer> uniqueUserIds = userIds.stream().distinct().toList();

        // Validate all users exist
        for (Integer userId : uniqueUserIds) {
            if (!userRepository.existsById(userId)) {
                throw new IllegalArgumentException("User not found with ID: " + userId);
            }
        }

        // Create conversation without saving it first
        Conversation conversation = Conversation.builder().build();

        // Loop through user IDs and add them as participants
        for (Integer userId : uniqueUserIds) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
            
            ConversationParticipant participant = ConversationParticipant.builder()
                    .conversation(conversation)
                    .user(user)
                    .build();

            conversation.addParticipant(participant);
        }

        // Save the conversation with all participants at once
        Conversation savedConversation = conversationRepository.save(conversation);
        return conversationMapper.toDTO(savedConversation);
    }

    // Add participant and return DTO
    public ConversationDTO addParticipant(Integer conversationId, Integer userId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Check if user is already a participant
        ConversationParticipantId participantId = new ConversationParticipantId(conversationId, userId);
        if (participantRepository.existsById(participantId)) {
            throw new IllegalStateException("User is already a participant in this conversation");
        }

        ConversationParticipant participant = ConversationParticipant.builder()
                .conversation(conversation)
                .user(user)
                .build();

        participantRepository.save(participant);
        
        // Refresh conversation and return DTO
        Conversation updatedConversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));
        return conversationMapper.toDTO(updatedConversation);
    }

    // Send a message in existing conversation and return DTO
    public MessageDTO sendMessage(Integer conversationId, Integer senderId, String content) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("Sender not found"));

        // Validate participant
        if (!participantRepository.existsById(new ConversationParticipantId(conversationId, senderId))) {
            throw new IllegalArgumentException("Sender is not a participant in this conversation");
        }

        Message message = messageRepository.save(Message.builder()
                .content(content)
                .conversation(conversation)
                .sender(sender)
                .timestamp(LocalDateTime.now())
                .build());

        return conversationMapper.toMessageDTO(message, senderId);
    }

    // Send direct message between two users and return DTO
    public MessageDTO sendDirectMessage(Integer senderId, Integer receiverId, String content) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new IllegalArgumentException("Receiver not found"));

        Optional<Conversation> existingConversationOpt = findConversationBetweenUsers(senderId, receiverId);
        
        Conversation conversation;
        if (existingConversationOpt.isPresent()) {
            conversation = existingConversationOpt.get();
        } else {
            // Create new conversation with both participants
            conversation = Conversation.builder().build();
            
            ConversationParticipant senderParticipant = ConversationParticipant.builder()
                    .conversation(conversation)
                    .user(sender)
                    .build();
            
            ConversationParticipant receiverParticipant = ConversationParticipant.builder()
                    .conversation(conversation)
                    .user(receiver)
                    .build();

            conversation.addParticipant(senderParticipant);
            conversation.addParticipant(receiverParticipant);
            
            // Save conversation with participants
            conversation = conversationRepository.save(conversation);
        }

        Message message = Message.builder()
                .content(content)
                .conversation(conversation)
                .sender(sender)
                .receiver(receiver)
                .timestamp(LocalDateTime.now())
                .build();

        Message savedMessage = messageRepository.save(message);
        return conversationMapper.toMessageDTO(savedMessage, senderId);
    }

    private Optional<Conversation> findConversationBetweenUsers(Integer user1Id, Integer user2Id) {
        return conversationRepository.findConversationBetweenTwoUsers(user1Id, user2Id);
    }

    // Get all messages for a conversation and return DTOs
    public List<MessageDTO> getMessages(Integer conversationId, Integer currentUserId) {
        // Verify the user is a participant
        if (!participantRepository.existsById(new ConversationParticipantId(conversationId, currentUserId))) {
            throw new IllegalArgumentException("User is not a participant in this conversation");
        }

        List<Message> messages = messageRepository.findByConversationIdOrderByTimestampAsc(conversationId);
        return conversationMapper.toMessageDTOList(messages, currentUserId);
    }

    // Get participants of a conversation and return DTOs
    public List<UserDTO> getParticipants(Integer conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));
        
        return conversation.getParticipants().stream()
                .map(participant -> conversationMapper.toUserDTO(participant.getUser()))
                .toList();
    }

    // Get all conversations for a user and return DTOs
    public List<ConversationDTO> getUserConversations(Integer userId) {
        List<Conversation> conversations = conversationRepository.findConversationsByUserId(userId);
        return conversationMapper.toDTOList(conversations);
    }

    // Get conversation by ID and return DTO
    public ConversationDTO getConversationById(Integer conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));
        return conversationMapper.toDTO(conversation);
    }

    // Check if conversation exists between two users
    public Optional<ConversationDTO> findConversationBetweenUsersDTO(Integer user1Id, Integer user2Id) {
        Optional<Conversation> conversation = findConversationBetweenUsers(user1Id, user2Id);
        return conversation.map(conversationMapper::toDTO);
    }
}