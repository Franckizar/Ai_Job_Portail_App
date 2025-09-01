package com.example.security.user.connection;

import com.example.security.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Integer> {

    // Find connection by requester and receiver
    Optional<Connection> findByRequesterAndReceiver(User requester, User receiver);
    
    // Find connection by requester, receiver and status
    Optional<Connection> findByRequesterAndReceiverAndStatus(User requester, User receiver, ConnectionStatus status);

    // Find all connections where user is either requester or receiver
    @Query("SELECT c FROM Connection c WHERE c.requester = :user OR c.receiver = :user ORDER BY c.updatedAt DESC")
    List<Connection> findByRequesterOrReceiver(@Param("user") User user, @Param("user") User user2);

    // Find accepted connections where user is either requester or receiver
    @Query("SELECT c FROM Connection c WHERE (c.requester = :user OR c.receiver = :user) AND c.status = :status ORDER BY c.updatedAt DESC")
    List<Connection> findByRequesterAndStatusOrReceiverAndStatus(
            @Param("user") User user, 
            @Param("status") ConnectionStatus status1, 
            @Param("user") User user2, 
            @Param("status") ConnectionStatus status2
    );

    // Find connections where user is receiver with specific status
    List<Connection> findByReceiverAndStatus(User receiver, ConnectionStatus status);
    
    // Find connections where user is requester with specific status
    List<Connection> findByRequesterAndStatus(User requester, ConnectionStatus status);

    // Find all connections by status
    List<Connection> findByStatus(ConnectionStatus status);

    // Count connections by user and status
    @Query("SELECT COUNT(c) FROM Connection c WHERE (c.requester = :user OR c.receiver = :user) AND c.status = :status")
    Long countByUserAndStatus(@Param("user") User user, @Param("status") ConnectionStatus status);

    // Find blocked connections
    @Query("SELECT c FROM Connection c WHERE (c.requester = :user OR c.receiver = :user) AND c.status = 'BLOCKED'")
    List<Connection> findBlockedConnectionsByUser(@Param("user") User user);

    // Check if connection exists between two users (any direction)
    @Query("SELECT c FROM Connection c WHERE " +
           "(c.requester = :user1 AND c.receiver = :user2) OR " +
           "(c.requester = :user2 AND c.receiver = :user1)")
    Optional<Connection> findConnectionBetweenUsers(@Param("user1") User user1, @Param("user2") User user2);
    
    // Check if users are connected (accepted status, any direction)
    @Query("SELECT c FROM Connection c WHERE " +
           "((c.requester = :user1 AND c.receiver = :user2) OR " +
           "(c.requester = :user2 AND c.receiver = :user1)) AND " +
           "c.status = 'ACCEPTED'")
    Optional<Connection> findAcceptedConnectionBetweenUsers(@Param("user1") User user1, @Param("user2") User user2);
}