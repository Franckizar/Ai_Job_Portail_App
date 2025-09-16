// ```java
package com.example.security.user.connection;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.security.UserRepository;
import com.example.security.user.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ConnectionService {

    private final ConnectionRepository connectionRepository;
    private final UserRepository userRepository;

    public Connection sendRequest(Integer requesterId, Integer receiverId) {
        log.info("Sending connection request from user {} to user {}", requesterId, receiverId);
        
        if (requesterId.equals(receiverId)) {
            throw new IllegalStateException("Cannot send connection request to yourself");
        }
        
        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new IllegalArgumentException("Requester user not found with id: " + requesterId));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new IllegalArgumentException("Receiver user not found with id: " + receiverId));

        Optional<Connection> existingConnection = connectionRepository
                .findByRequesterAndReceiver(requester, receiver);
        
        if (existingConnection.isPresent()) {
            ConnectionStatus status = existingConnection.get().getStatus();
            if (status == ConnectionStatus.PENDING) {
                throw new IllegalStateException("Connection request already pending");
            } else if (status == ConnectionStatus.ACCEPTED) {
                throw new IllegalStateException("Users are already connected");
            } else if (status == ConnectionStatus.BLOCKED) {
                throw new IllegalStateException("Cannot send request - connection is blocked");
            }
        }
        
        Optional<Connection> reverseConnection = connectionRepository
                .findByRequesterAndReceiver(receiver, requester);
        
        if (reverseConnection.isPresent()) {
            ConnectionStatus reverseStatus = reverseConnection.get().getStatus();
            if (reverseStatus == ConnectionStatus.PENDING) {
                Connection connection = reverseConnection.get();
                connection.setStatus(ConnectionStatus.ACCEPTED);
                connection.setUpdatedAt(LocalDateTime.now());
                log.info("Auto-accepting reverse connection request between users {} and {}", requesterId, receiverId);
                return connectionRepository.save(connection);
            } else if (reverseStatus == ConnectionStatus.BLOCKED) {
                throw new IllegalStateException("Cannot send request - you are blocked by this user");
            }
        }

        Connection connection = Connection.builder()
                .requester(requester)
                .receiver(receiver)
                .status(ConnectionStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Connection saved = connectionRepository.save(connection);
        log.info("Connection request created with id: {}", saved.getId());
        return saved;
    }

    public Connection acceptRequest(Integer connectionId) {
        log.info("Accepting connection request with id: {}", connectionId);
        
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new IllegalArgumentException("Connection not found with id: " + connectionId));

        if (connection.getStatus() != ConnectionStatus.PENDING) {
            throw new IllegalStateException("Can only accept pending connection requests. Current status: " + connection.getStatus());
        }

        connection.setStatus(ConnectionStatus.ACCEPTED);
        connection.setUpdatedAt(LocalDateTime.now());
        
        Connection saved = connectionRepository.save(connection);
        log.info("Connection request {} accepted successfully", connectionId);
        return saved;
    }

    public Connection rejectRequest(Integer connectionId) {
        log.info("Rejecting connection request with id: {}", connectionId);
        
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new IllegalArgumentException("Connection not found with id: " + connectionId));

        if (connection.getStatus() != ConnectionStatus.PENDING) {
            throw new IllegalStateException("Can only reject pending connection requests. Current status: " + connection.getStatus());
        }

        connection.setStatus(ConnectionStatus.REJECTED);
        connection.setUpdatedAt(LocalDateTime.now());
        
        Connection saved = connectionRepository.save(connection);
        log.info("Connection request {} rejected successfully", connectionId);
        return saved;
    }

    public Connection blockConnection(Integer connectionId) {
        log.info("Blocking connection with id: {}", connectionId);
        
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new IllegalArgumentException("Connection not found with id: " + connectionId));

        connection.setStatus(ConnectionStatus.BLOCKED);
        connection.setUpdatedAt(LocalDateTime.now());
        
        Connection saved = connectionRepository.save(connection);
        log.info("Connection {} blocked successfully", connectionId);
        return saved;
    }

    @Transactional(readOnly = true)
    public List<Connection> getUserConnections(Integer userId) {
        log.debug("Getting all connections for user: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        
        return connectionRepository.findByRequesterOrReceiver(user, user);
    }

    @Transactional(readOnly = true)
    public List<Connection> getUserFriends(Integer userId) {
        log.debug("Getting friends for user: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        
        return connectionRepository.findByRequesterAndStatusOrReceiverAndStatus(
                user, ConnectionStatus.ACCEPTED, user, ConnectionStatus.ACCEPTED
        );
    }

    @Transactional(readOnly = true)
    public List<Connection> getPendingRequests(Integer userId) {
        log.debug("Getting pending requests for user: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        
        return connectionRepository.findByReceiverAndStatus(user, ConnectionStatus.PENDING);
    }

    @Transactional(readOnly = true)
    public List<Connection> getSentRequests(Integer userId) {
        log.debug("Getting sent requests for user: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        
        return connectionRepository.findByRequesterAndStatus(user, ConnectionStatus.PENDING);
    }

    public void removeConnection(Integer connectionId) {
        log.info("Removing connection with id: {}", connectionId);
        
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new IllegalArgumentException("Connection not found with id: " + connectionId));
        
        connectionRepository.delete(connection);
        log.info("Connection {} removed successfully", connectionId);
    }

    @Transactional(readOnly = true)
    public boolean areUsersConnected(Integer userId1, Integer userId2) {
        User user1 = userRepository.findById(userId1)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId1));
        User user2 = userRepository.findById(userId2)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId2));
        
        Optional<Connection> connection1 = connectionRepository
                .findByRequesterAndReceiverAndStatus(user1, user2, ConnectionStatus.ACCEPTED);
        Optional<Connection> connection2 = connectionRepository
                .findByRequesterAndReceiverAndStatus(user2, user1, ConnectionStatus.ACCEPTED);
        
        return connection1.isPresent() || connection2.isPresent();
    }

    @Transactional(readOnly = true)
    public String getConnectionStatus(Integer requesterId, Integer receiverId) {
        log.info("Getting connection status between requester {} and receiver {}", requesterId, receiverId);
        
        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new IllegalArgumentException("Requester user not found with id: " + requesterId));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new IllegalArgumentException("Receiver user not found with id: " + receiverId));
        
        Optional<Connection> connection = connectionRepository.findByRequesterAndReceiver(requester, receiver);
        if (connection.isPresent()) {
            return connection.get().getStatus().name().toLowerCase();
        }
        
        Optional<Connection> reverseConnection = connectionRepository.findByRequesterAndReceiver(receiver, requester);
        if (reverseConnection.isPresent()) {
            return reverseConnection.get().getStatus().name().toLowerCase();
        }
        
        return "none";
    }

    @Transactional(readOnly = true)
    public List<ConnectionResponseDTO.UserDTO> searchUsersByEmail(String email) {
        log.debug("Searching users with email containing: {}", email);
        List<User> users = userRepository.findByEmailContainingIgnoreCase(email);
        return users.stream().map(user -> ConnectionResponseDTO.UserDTO.builder()
                .id(user.getId())
                .firstname(user.getFirstname() != null ? user.getFirstname() : "")
                .lastname(user.getLastname() != null ? user.getLastname() : "")
                .email(user.getEmail() != null ? user.getEmail() : "No email available")
                .build()
        ).collect(Collectors.toList());
    }
}