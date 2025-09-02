// ConversationMapper.java - Utility class to convert entities to DTOs
package com.example.security.Other.Conversation;

import com.example.security.Other.Conversation.Conversation;
import com.example.security.Other.ConversationParticipant.ConversationParticipant;
import com.example.security.Other.Message.Message;
import com.example.security.user.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ConversationMapper {

    public ConversationDTO toDTO(Conversation conversation) {
        return ConversationDTO.builder()
                .id(conversation.getId())
                .createdAt(conversation.getCreatedAt())
                .participants(conversation.getParticipants().stream()
                        .map(this::toParticipantDTO)
                        .collect(Collectors.toList()))
                .build();
    }

    public ConversationDTO toDTO(Conversation conversation, Message lastMessage, Integer unreadCount) {
        return ConversationDTO.builder()
                .id(conversation.getId())
                .createdAt(conversation.getCreatedAt())
                .participants(conversation.getParticipants().stream()
                        .map(this::toParticipantDTO)
                        .collect(Collectors.toList()))
                .lastMessage(lastMessage != null ? toMessageDTO(lastMessage, null) : null)
                .unreadCount(unreadCount != null ? unreadCount : 0)
                .build();
    }

    public ParticipantDTO toParticipantDTO(ConversationParticipant participant) {
        return ParticipantDTO.builder()
                .user(toUserDTO(participant.getUser()))
                .joinedAt(participant.getJoinedAt()) // Assuming you have createdAt in ConversationParticipant
                .build();
    }

    public UserDTO toUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .fullName(user.getFirstname() + " " + user.getLastname())
                .initials(getInitials(user.getFirstname(), user.getLastname()))
                .build();
    }

    public MessageDTO toMessageDTO(Message message, Integer currentUserId) {
        return MessageDTO.builder()
                .id(message.getId())
                .content(message.getContent())
                .timestamp(message.getTimestamp())
                .isRead(message.getIsRead())
               .messageType(message.getMessageType() != null ? message.getMessageType().name() : null)
                .sender(toUserDTO(message.getSender()))
                .receiver(message.getReceiver() != null ? toUserDTO(message.getReceiver()) : null)
                .isFromCurrentUser(currentUserId != null && message.getSender().getId().equals(currentUserId))
                .build();
    }

    public List<ConversationDTO> toDTOList(List<Conversation> conversations) {
        return conversations.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<MessageDTO> toMessageDTOList(List<Message> messages, Integer currentUserId) {
        return messages.stream()
                .map(message -> toMessageDTO(message, currentUserId))
                .collect(Collectors.toList());
    }

    private String getInitials(String firstname, String lastname) {
        StringBuilder initials = new StringBuilder();
        if (firstname != null && !firstname.isEmpty()) {
            initials.append(firstname.charAt(0));
        }
        if (lastname != null && !lastname.isEmpty()) {
            initials.append(lastname.charAt(0));
        }
        return initials.toString().toUpperCase();
    }
}