// ```java
package com.example.security.user.connection;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConnectionResponseDTO {
    private Integer id;
    private Integer requesterId;
    private Integer receiverId;
    private String status;
    private String message; // Added for error messages
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructor for error messages
    public ConnectionResponseDTO(String message) {
        this.message = message;
    }

    // Factory method to create DTO from Connection entity
    public static ConnectionResponseDTO fromConnection(Connection connection) {
        return ConnectionResponseDTO.builder()
                .id(connection.getId())
                .requesterId(connection.getRequester().getId())
                .receiverId(connection.getReceiver().getId())
                .status(connection.getStatus().name().toLowerCase())
                .createdAt(connection.getCreatedAt())
                .updatedAt(connection.getUpdatedAt())
                .build();
    }
}
// ```