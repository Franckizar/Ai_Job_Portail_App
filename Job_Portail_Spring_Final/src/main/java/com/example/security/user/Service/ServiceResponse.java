package com.example.security.user.Service;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceResponse {
    private Integer id;
    private String serviceName;
    private String serviceCode;
    private String description;
    private String category;
    private BigDecimal basePrice;
    private String duration;
    private Boolean isActive;
    private String notes;
    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;
}