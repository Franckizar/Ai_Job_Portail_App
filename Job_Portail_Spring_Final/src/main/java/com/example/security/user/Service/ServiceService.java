package com.example.security.user.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

// package com.example.security.user.Service;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;
// import java.math.BigDecimal;
// import java.time.LocalDateTime;
// import java.util.List;
// import java.util.Optional;
// import java.util.stream.Collectors;

@Service
@Transactional
public class ServiceService {
    
    @Autowired
    private ServiceRepository serviceRepository;
    
    // CREATE - Add new service
       public ServiceResponse createService(ServiceRequest request) {
        // Check for duplicate service code
        if (serviceRepository.findByServiceCode(request.getServiceCode()).isPresent()) {
            throw new IllegalArgumentException("Service code already exists: " + request.getServiceCode());
        }

        com.example.security.user.Service.Service service = com.example.security.user.Service.Service.builder()
                .serviceName(request.getServiceName())
                .serviceCode(request.getServiceCode())
                .description(request.getDescription())
                .category(request.getCategory())
                .basePrice(request.getBasePrice())
                .duration(request.getDuration())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .notes(request.getNotes())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        com.example.security.user.Service.Service savedService = serviceRepository.save(service);

        return mapToResponse(savedService);
    }

    public List<ServiceResponse> createMultipleServices(List<ServiceRequest> requests) {
        List<ServiceResponse> responses = new ArrayList<>();
        for (ServiceRequest request : requests) {
            responses.add(createService(request));  // Reuse single create method
        }
        return responses;
    }
    // READ - Get all services
    public List<ServiceResponse> getAllServices() {
        return serviceRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    // READ - Get active services only
    public List<ServiceResponse> getActiveServices() {
        return serviceRepository.findByIsActiveTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    // READ - Get service by ID
    public ServiceResponse getServiceById(Integer id) {
        com.example.security.user.Service.Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Service not found with ID: " + id));
        return mapToResponse(service);
    }
    
    // READ - Get service by code
    public ServiceResponse getServiceByCode(String serviceCode) {
        com.example.security.user.Service.Service service = serviceRepository.findByServiceCode(serviceCode)
                .orElseThrow(() -> new IllegalArgumentException("Service not found with code: " + serviceCode));
        return mapToResponse(service);
    }
    
    // READ - Get services by category
    public List<ServiceResponse> getServicesByCategory(String category) {
        return serviceRepository.findByCategoryAndIsActiveTrue(category).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    // READ - Search services by name
    public List<ServiceResponse> searchServicesByName(String name) {
        return serviceRepository.findByServiceNameContainingIgnoreCase(name).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    // READ - Get services by price range
    public List<ServiceResponse> getServicesByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return serviceRepository.findByPriceRange(minPrice, maxPrice).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    // UPDATE - Update existing service
    public ServiceResponse updateService(Integer id, ServiceUpdateRequest request) {
        com.example.security.user.Service.Service existingService = serviceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Service not found with ID: " + id));
        
        // Check if service code is being changed and if new code already exists
        if (!existingService.getServiceCode().equals(request.getServiceCode())) {
            if (serviceRepository.findByServiceCode(request.getServiceCode()).isPresent()) {
                throw new IllegalArgumentException("Service code already exists: " + request.getServiceCode());
            }
        }
        
        // Update fields
        existingService.setServiceName(request.getServiceName());
        existingService.setServiceCode(request.getServiceCode());
        existingService.setDescription(request.getDescription());
        existingService.setCategory(request.getCategory());
        existingService.setBasePrice(request.getBasePrice());
        existingService.setDuration(request.getDuration());
        existingService.setIsActive(request.getIsActive());
        existingService.setNotes(request.getNotes());
        existingService.setUpdatedAt(LocalDateTime.now());
        
        com.example.security.user.Service.Service updatedService = serviceRepository.save(existingService);
        return mapToResponse(updatedService);
    }
    
    // DELETE - Soft delete (deactivate) service
    public void deactivateService(Integer id) {
        com.example.security.user.Service.Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Service not found with ID: " + id));
        
        service.setIsActive(false);
        service.setUpdatedAt(LocalDateTime.now());
        serviceRepository.save(service);
    }
    
    // DELETE - Hard delete service
    public void deleteService(Integer id) {
        if (!serviceRepository.existsById(id)) {
            throw new IllegalArgumentException("Service not found with ID: " + id);
        }
        serviceRepository.deleteById(id);
    }
    
    // Helper method to map entity to response DTO
    private ServiceResponse mapToResponse(com.example.security.user.Service.Service service) {
        return ServiceResponse.builder()
                .id(service.getId())
                .serviceName(service.getServiceName())
                .serviceCode(service.getServiceCode())
                .description(service.getDescription())
                .category(service.getCategory())
                .basePrice(service.getBasePrice())
                .duration(service.getDuration())
                .isActive(service.getIsActive())
                .notes(service.getNotes())
                .createdAt(service.getCreatedAt())
                .updatedAt(service.getUpdatedAt())
                .build();
    }
}