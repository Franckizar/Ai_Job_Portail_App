package com.example.security.user.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "services")
public class Service {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    private String serviceName;        // "Tooth Cleaning", "Root Canal", "Tooth Extraction"
    private String serviceCode;        // "TC001", "RC001", "EX001" 
    private String description;        // Detailed description
    private String category;           // "PREVENTIVE", "RESTORATIVE", "SURGICAL", "COSMETIC"
    private BigDecimal basePrice;      // Standard price
    private String duration;           // "30 minutes", "1 hour"
    private Boolean isActive;          // To enable/disable services
    private String notes;              // Additional information
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}