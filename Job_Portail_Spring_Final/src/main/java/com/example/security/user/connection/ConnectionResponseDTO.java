// ```java
package com.example.security.user.connection;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConnectionResponseDTO {
    private Integer id;
    private Integer requesterId;
    private Integer receiverId;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserDTO requester;
    private UserDTO receiver;
    private String errorMessage;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserDTO {
        private Integer id;
        private String firstname;
        private String lastname;
        private String email;
    }

    public static ConnectionResponseDTO fromConnection(Connection connection) {
        UserDTO requesterDTO = new UserDTO(
            connection.getRequester().getId(),
            connection.getRequester().getFirstname(),
            connection.getRequester().getLastname(),
            connection.getRequester().getEmail()
        );
        UserDTO receiverDTO = new UserDTO(
            connection.getReceiver().getId(),
            connection.getReceiver().getFirstname(),
            connection.getReceiver().getLastname(),
            connection.getReceiver().getEmail()
        );

        return ConnectionResponseDTO.builder()
                .id(connection.getId())
                .requesterId(connection.getRequester().getId())
                .receiverId(connection.getReceiver().getId())
                .status(connection.getStatus().name())
                .createdAt(connection.getCreatedAt())
                .updatedAt(connection.getUpdatedAt())
                .requester(requesterDTO)
                .receiver(receiverDTO)
                .build();
    }

    public ConnectionResponseDTO(String errorMessage) {
        this.errorMessage = errorMessage;
    }
}