package com.example.security.user.connection;

import com.example.security.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@Entity
@Table(
    name = "connections",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_connections_requester_receiver",
                          columnNames = {"requester_id","receiver_id"})
    },
    indexes = {
        @Index(name = "idx_connections_requester_status", columnList = "requester_id,status"),
        @Index(name = "idx_connections_receiver_status",  columnList = "receiver_id,status")
    }
)
public class Connection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // who sent the request
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "requester_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_conn_requester"))
    private User requester;

    // who received the request
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "receiver_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_conn_receiver"))
    private User receiver;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private ConnectionStatus status; // PENDING, ACCEPTED, REJECTED, BLOCKED

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist @PreUpdate
    private void validate() {
        if (requester != null && receiver != null && requester.getId() != null
                && requester.getId().equals(receiver.getId())) {
            throw new IllegalArgumentException("requester and receiver must be different users");
        }
    }
}
