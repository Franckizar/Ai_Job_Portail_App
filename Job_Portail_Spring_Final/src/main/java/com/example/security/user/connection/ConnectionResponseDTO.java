
// ConnectionResponseDTO.java
package com.example.security.user.connection;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConnectionResponseDTO {
    
    private Integer id;
    private Integer requesterId;
    private String requesterName;
    private String requesterEmail;
    private Integer receiverId;
    private String receiverName;
    private String receiverEmail;
    private ConnectionStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static ConnectionResponseDTO fromConnection(Connection connection) {
        return ConnectionResponseDTO.builder()
                .id(connection.getId())
                .requesterId(connection.getRequester().getId())
                .requesterName(connection.getRequester().getFirstname() + " " + connection.getRequester().getLastname())
                .requesterEmail(connection.getRequester().getEmail())
                .receiverId(connection.getReceiver().getId())
                .receiverName(connection.getReceiver().getFirstname() + " " + connection.getReceiver().getLastname())
                .receiverEmail(connection.getReceiver().getEmail())
                .status(connection.getStatus())
                .createdAt(connection.getCreatedAt())
                .updatedAt(connection.getUpdatedAt())
                .build();
    }
}
