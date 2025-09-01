// ConnectionRequestDTO.java
package com.example.security.user.connection;

import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

// import com.drew.lang.annotations.NotNull;

import lombok.AllArgsConstructor;



@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConnectionRequestDTO {
    
    @NotNull(message = "Requester ID is required")
    @Positive(message = "Requester ID must be positive")
    private Integer requesterId;
    
    @NotNull(message = "Receiver ID is required")
    @Positive(message = "Receiver ID must be positive")
    private Integer receiverId;
}





/* 
===== JSON TEST EXAMPLES =====

1. Send Connection Request
POST /api/v1/auth/connections/request
Content-Type: application/json

{
    "requesterId": 1,
    "receiverId": 2
}

Expected Response (201 Created):
{
    "id": 1,
    "requesterId": 1,
    "requesterName": "John Doe",
    "requesterEmail": "john@example.com",
    "receiverId": 2,
    "receiverName": "Jane Smith",
    "receiverEmail": "jane@example.com",
    "status": "PENDING",
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
}

2. Accept Connection Request
PUT /api/v1/auth/connections/1/accept

Expected Response (200 OK):
{
    "id": 1,
    "requesterId": 1,
    "requesterName": "John Doe",
    "requesterEmail": "john@example.com",
    "receiverId": 2,
    "receiverName": "Jane Smith",
    "receiverEmail": "jane@example.com",
    "status": "ACCEPTED",
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T11:15:00"
}

3. Reject Connection Request
PUT /api/v1/auth/connections/1/reject

Expected Response (200 OK):
{
    "id": 1,
    "requesterId": 1,
    "requesterName": "John Doe",
    "requesterEmail": "john@example.com",
    "receiverId": 2,
    "receiverName": "Jane Smith",
    "receiverEmail": "jane@example.com",
    "status": "REJECTED",
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T11:20:00"
}

4. Block Connection
PUT /api/v1/auth/connections/1/block

Expected Response (200 OK):
{
    "id": 1,
    "requesterId": 1,
    "requesterName": "John Doe",
    "requesterEmail": "john@example.com",
    "receiverId": 2,
    "receiverName": "Jane Smith",
    "receiverEmail": "jane@example.com",
    "status": "BLOCKED",
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T11:25:00"
}

5. Get User Connections
GET /api/v1/auth/connections/user/1

Expected Response (200 OK):
[
    {
        "id": 1,
        "requesterId": 1,
        "requesterName": "John Doe",
        "requesterEmail": "john@example.com",
        "receiverId": 2,
        "receiverName": "Jane Smith",
        "receiverEmail": "jane@example.com",
        "status": "ACCEPTED",
        "createdAt": "2024-01-15T10:30:00",
        "updatedAt": "2024-01-15T11:15:00"
    },
    {
        "id": 2,
        "requesterId": 3,
        "requesterName": "Bob Wilson",
        "requesterEmail": "bob@example.com",
        "receiverId": 1,
        "receiverName": "John Doe",
        "receiverEmail": "john@example.com",
        "status": "PENDING",
        "createdAt": "2024-01-15T12:00:00",
        "updatedAt": "2024-01-15T12:00:00"
    }
]

6. Get User Friends (Accepted Connections)
GET /api/v1/auth/connections/user/1/friends

Expected Response (200 OK):
[
    {
        "id": 1,
        "requesterId": 1,
        "requesterName": "John Doe",
        "requesterEmail": "john@example.com",
        "receiverId": 2,
        "receiverName": "Jane Smith",
        "receiverEmail": "jane@example.com",
        "status": "ACCEPTED",
        "createdAt": "2024-01-15T10:30:00",
        "updatedAt": "2024-01-15T11:15:00"
    }
]

7. Get Pending Requests
GET /api/v1/auth/connections/user/1/pending

Expected Response (200 OK):
[
    {
        "id": 3,
        "requesterId": 4,
        "requesterName": "Alice Brown",
        "requesterEmail": "alice@example.com",
        "receiverId": 1,
        "receiverName": "John Doe",
        "receiverEmail": "john@example.com",
        "status": "PENDING",
        "createdAt": "2024-01-15T14:00:00",
        "updatedAt": "2024-01-15T14:00:00"
    }
]

8. Get Sent Requests
GET /api/v1/auth/connections/user/1/sent

Expected Response (200 OK):
[
    {
        "id": 5,
        "requesterId": 1,
        "requesterName": "John Doe",
        "requesterEmail": "john@example.com",
        "receiverId": 5,
        "receiverName": "Charlie Davis",
        "receiverEmail": "charlie@example.com",
        "status": "PENDING",
        "createdAt": "2024-01-15T15:30:00",
        "updatedAt": "2024-01-15T15:30:00"
    }
]

9. Remove Connection
DELETE /api/v1/auth/connections/1

Expected Response (204 No Content): Empty body

===== ERROR RESPONSES =====

400 Bad Request (when trying to send duplicate request):
{
    "error": "Bad Request",
    "message": "Connection request already pending"
}

404 Not Found (when connection/user doesn't exist):
{
    "error": "Not Found",
    "message": "Connection not found with id: 999"
}

422 Unprocessable Entity (validation errors):
{
    "error": "Validation Failed",
    "details": [
        {
            "field": "requesterId",
            "message": "Requester ID is required"
        }
    ]
}
*/