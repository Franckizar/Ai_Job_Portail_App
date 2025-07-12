
// 1. SERVICE REPOSITORY
package com.example.security.user.Service;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Integer> {
    
    // Find active services
    List<Service> findByIsActiveTrue();
    
    // Find services by category
    List<Service> findByCategoryAndIsActiveTrue(String category);
    
    // Find service by code
    Optional<Service> findByServiceCode(String serviceCode);
    
    // Search services by name (case insensitive)
    @Query("SELECT s FROM Service s WHERE LOWER(s.serviceName) LIKE LOWER(CONCAT('%', :name, '%')) AND s.isActive = true")
    List<Service> findByServiceNameContainingIgnoreCase(@Param("name") String name);
    
    // Find services by price range
    @Query("SELECT s FROM Service s WHERE s.basePrice BETWEEN :minPrice AND :maxPrice AND s.isActive = true")
    List<Service> findByPriceRange(@Param("minPrice") java.math.BigDecimal minPrice, 
                                   @Param("maxPrice") java.math.BigDecimal maxPrice);
}