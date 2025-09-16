// ```java
package com.example.security.user.connection;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth/connections")
@RequiredArgsConstructor
public class ConnectionController {

    private final ConnectionService connectionService;

    @PostMapping("/request")
    public ResponseEntity<ConnectionResponseDTO> sendRequest(@Valid @RequestBody ConnectionRequestDTO request) {
        try {
            Connection connection = connectionService.sendRequest(request.getRequesterId(), request.getReceiverId());
            return ResponseEntity.status(HttpStatus.CREATED).body(ConnectionResponseDTO.fromConnection(connection));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(new ConnectionResponseDTO(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<ConnectionResponseDTO> acceptRequest(@PathVariable @Positive Integer id) {
        try {
            Connection connection = connectionService.acceptRequest(id);
            return ResponseEntity.ok(ConnectionResponseDTO.fromConnection(connection));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(new ConnectionResponseDTO(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ConnectionResponseDTO> rejectRequest(@PathVariable @Positive Integer id) {
        try {
            Connection connection = connectionService.rejectRequest(id);
            return ResponseEntity.ok(ConnectionResponseDTO.fromConnection(connection));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(new ConnectionResponseDTO(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}/block")
    public ResponseEntity<ConnectionResponseDTO> blockConnection(@PathVariable @Positive Integer id) {
        try {
            Connection connection = connectionService.blockConnection(id);
            return ResponseEntity.ok(ConnectionResponseDTO.fromConnection(connection));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(new ConnectionResponseDTO(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ConnectionResponseDTO>> getUserConnections(@PathVariable @Positive Integer userId) {
        try {
            List<Connection> connections = connectionService.getUserConnections(userId);
            List<ConnectionResponseDTO> response = connections.stream()
                    .map(ConnectionResponseDTO::fromConnection)
                    .toList();
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/user/{userId}/friends")
    public ResponseEntity<List<ConnectionResponseDTO>> getUserFriends(@PathVariable @Positive Integer userId) {
        try {
            List<Connection> friends = connectionService.getUserFriends(userId);
            List<ConnectionResponseDTO> response = friends.stream()
                    .map(ConnectionResponseDTO::fromConnection)
                    .toList();
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/user/{userId}/pending")
    public ResponseEntity<List<ConnectionResponseDTO>> getPendingRequests(@PathVariable @Positive Integer userId) {
        try {
            List<Connection> pendingRequests = connectionService.getPendingRequests(userId);
            List<ConnectionResponseDTO> response = pendingRequests.stream()
                    .map(ConnectionResponseDTO::fromConnection)
                    .toList();
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/user/{userId}/sent")
    public ResponseEntity<List<ConnectionResponseDTO>> getSentRequests(@PathVariable @Positive Integer userId) {
        try {
            List<Connection> sentRequests = connectionService.getSentRequests(userId);
            List<ConnectionResponseDTO> response = sentRequests.stream()
                    .map(ConnectionResponseDTO::fromConnection)
                    .toList();
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeConnection(@PathVariable @Positive Integer id) {
        try {
            connectionService.removeConnection(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, String>> getConnectionStatus(
            @RequestParam @Positive Integer requesterId,
            @RequestParam @Positive Integer receiverId) {
        try {
            String status = connectionService.getConnectionStatus(requesterId, receiverId);
            return ResponseEntity.ok(Map.of("status", status));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<ConnectionResponseDTO.UserDTO>> searchUsersByEmail(@RequestParam @NotBlank String email) {
        try {
            List<ConnectionResponseDTO.UserDTO> users = connectionService.searchUsersByEmail(email);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}