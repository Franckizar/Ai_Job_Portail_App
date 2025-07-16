package com.example.security.Other.api_request_log;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "api_request_log")
public class ApiRequestLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime timestamp = LocalDateTime.now();

    public ApiRequestLog() {}
}
