package com.example.security.user.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/auth/services")
// @CrossOrigin(origins = "*")
// @CrossOrigin(origins = {"http://localhost:3000"}, allowCredentials = "true")  
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceService serviceService;

    @PostMapping("/create")
    public ResponseEntity<ServiceResponse> createService(@RequestBody ServiceRequest request) {
        ServiceResponse response = serviceService.createService(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Create multiple services (batch)
    @PostMapping("/create-multiple")
    public ResponseEntity<List<ServiceResponse>> createMultipleServices(@RequestBody List<ServiceRequest> requests) {
        List<ServiceResponse> responses = serviceService.createMultipleServices(requests);
        return new ResponseEntity<>(responses, HttpStatus.CREATED);
    }

    // READ - Get all services
    @GetMapping("/all")
    public ResponseEntity<List<ServiceResponse>> getAllServices() {
        return ResponseEntity.ok(serviceService.getAllServices());
    }

    // READ - Get active services only
    @GetMapping("/active")
    public ResponseEntity<List<ServiceResponse>> getActiveServices() {
        return ResponseEntity.ok(serviceService.getActiveServices());
    }

    // READ - Get service by ID
    @GetMapping("/{id}")
    public ResponseEntity<ServiceResponse> getServiceById(@PathVariable Integer id) {
        return ResponseEntity.ok(serviceService.getServiceById(id));
    }

    // READ - Get service by code
    @GetMapping("/code/{serviceCode}")
    public ResponseEntity<ServiceResponse> getServiceByCode(@PathVariable String serviceCode) {
        return ResponseEntity.ok(serviceService.getServiceByCode(serviceCode));
    }

    // READ - Get services by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<ServiceResponse>> getServicesByCategory(@PathVariable String category) {
        return ResponseEntity.ok(serviceService.getServicesByCategory(category));
    }

    // READ - Search services by name
    @GetMapping("/search")
    public ResponseEntity<List<ServiceResponse>> searchServicesByName(@RequestParam String name) {
        return ResponseEntity.ok(serviceService.searchServicesByName(name));
    }

    // READ - Get services by price range
    @GetMapping("/price-range")
    public ResponseEntity<List<ServiceResponse>> getServicesByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice) {
        return ResponseEntity.ok(serviceService.getServicesByPriceRange(minPrice, maxPrice));
    }

    // UPDATE - Update existing service
    @PutMapping("/{id}")
    public ResponseEntity<ServiceResponse> updateService(
            @PathVariable Integer id,
            @RequestBody ServiceUpdateRequest request) {
        return ResponseEntity.ok(serviceService.updateService(id, request));
    }

    // PATCH - Soft delete (deactivate) service
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<String> deactivateService(@PathVariable Integer id) {
        serviceService.deactivateService(id);
        return ResponseEntity.ok("Service deactivated successfully");
    }

    // DELETE - Hard delete service
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteService(@PathVariable Integer id) {
        serviceService.deleteService(id);
        return ResponseEntity.ok("Service deleted successfully");
    }
}
