package com.example.security.user.connection;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;

import java.util.List;
import java.util.Map;

// import javax.validation.Valid;
// import javax.validation.constraints.Positive;

@RestController
@RequestMapping("/api/v1/auth/connections")
@RequiredArgsConstructor
public class ConnectionController {

    private final ConnectionService connectionService;

    /**
     * Send a connection request
     * POST /api/v1/auth/connections/request
     */
    @PostMapping("/request")
    public ResponseEntity<ConnectionResponseDTO> sendRequest(@Valid @RequestBody ConnectionRequestDTO request) {
        try {
            Connection connection = connectionService.sendRequest(request.getRequesterId(), request.getReceiverId());
            ConnectionResponseDTO response = ConnectionResponseDTO.fromConnection(connection);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(new ConnectionResponseDTO(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Accept a connection request
     * PUT /api/v1/auth/connections/{id}/accept
     */
    @PutMapping("/{id}/accept")
    public ResponseEntity<ConnectionResponseDTO> acceptRequest(@PathVariable @Positive Integer id) {
        try {
            Connection connection = connectionService.acceptRequest(id);
            ConnectionResponseDTO response = ConnectionResponseDTO.fromConnection(connection);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Reject a connection request
     * PUT /api/v1/auth/connections/{id}/reject
     */
    @PutMapping("/{id}/reject")
    public ResponseEntity<ConnectionResponseDTO> rejectRequest(@PathVariable @Positive Integer id) {
        try {
            Connection connection = connectionService.rejectRequest(id);
            ConnectionResponseDTO response = ConnectionResponseDTO.fromConnection(connection);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Block a user connection
     * PUT /api/v1/auth/connections/{id}/block
     */
    @PutMapping("/{id}/block")
    public ResponseEntity<ConnectionResponseDTO> blockConnection(@PathVariable @Positive Integer id) {
        try {
            Connection connection = connectionService.blockConnection(id);
            ConnectionResponseDTO response = ConnectionResponseDTO.fromConnection(connection);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all connections for a user
     * GET /api/v1/auth/connections/user/{userId}
     */
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

    /**
     * Get accepted connections (friends) for a user
     * GET /api/v1/auth/connections/user/{userId}/friends
     */
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

    /**
     * Get pending connection requests for a user
     * GET /api/v1/auth/connections/user/{userId}/pending
     */
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

    /**
     * Get sent connection requests by a user
     * GET /api/v1/auth/connections/user/{userId}/sent
     */
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

    /**
     * Remove/Delete a connection
     * DELETE /api/v1/auth/connections/{id}
     */
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

    /**
     * Get connection status between two users
     * GET /api/v1/auth/connections/status
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, String>> getConnectionStatus(
            @RequestParam Integer requesterId,
            @RequestParam Integer receiverId) {
        try {
            String status = connectionService.getConnectionStatus(requesterId, receiverId);
            return ResponseEntity.ok(Map.of("status", status));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}