package com.example.security.Other.Message;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.security.Other.ConversationParticipant.ConversationParticipantRepository;
import com.example.security.Other.ConversationParticipantId.ConversationParticipantId;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
@Transactional
public class MessageService {
    private final MessageRepository messageRepository;
    private final ConversationParticipantRepository participantRepository;

  public List<ChatMessageDTO> getChatMessages(Integer conversationId, Integer currentUserId) {
    // Verify the user is a participant
    if (!participantRepository.existsByConversationIdAndUserId(conversationId, currentUserId)) {
        throw new IllegalArgumentException("User is not a participant in this conversation");
    }

    List<Message> messages = messageRepository.findFullMessagesByConversation(conversationId);
    
    return messages.stream()
            .map(message -> {
                boolean isFromCurrentUser = message.getSender().getId().equals(currentUserId);
                
                return new ChatMessageDTO(
                        message.getId(),
                        message.getContent(),
                        message.getTimestamp(),
                        message.getIsRead(),
                        message.getMessageType(),
                        isFromCurrentUser,
                        new ChatMessageDTO.UserDTO(
                                message.getSender().getId(),
                                message.getSender().getFirstname(),
                                message.getSender().getLastname(),
                                message.getSender().getEmail()
                        )
                );
            })
            .collect(Collectors.toList());
}
    
}
