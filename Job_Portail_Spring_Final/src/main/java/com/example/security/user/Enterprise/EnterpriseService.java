package com.example.security.user.Enterprise;

import com.example.security.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EnterpriseService {

    private final EnterpriseRepository enterpriseRepository;

    /**
     * Create a new Enterprise profile linked to the given User.
     */
    public Enterprise create(User user, EnterpriseRequest request) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }

        if (enterpriseRepository.findByUserId(user.getId()).isPresent()) {
            throw new IllegalStateException("Enterprise profile already exists for this user");
        }

        Enterprise enterprise = mapRequestToEntity(new Enterprise(), request);
        enterprise.setUser(user);
        return enterpriseRepository.save(enterprise);
    }

    /**
     * Update an existing Enterprise profile by its ID.
     */
    public Enterprise update(Integer id, EnterpriseRequest request) {
        Enterprise existing = enterpriseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enterprise not found with id: " + id));
        Enterprise updated = mapRequestToEntity(existing, request);
        return enterpriseRepository.save(updated);
    }

    /**
     * Get Enterprise profile by ID.
     */
    public Enterprise getById(Integer id) {
        return enterpriseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enterprise not found with id: " + id));
    }

    /**
     * Get all Enterprise profiles.
     */
    public List<Enterprise> getAll() {
        return enterpriseRepository.findAll();
    }

    /**
     * Delete Enterprise profile by ID.
     */
    public void deleteById(Integer id) {
        if (!enterpriseRepository.existsById(id)) {
            throw new RuntimeException("Enterprise not found with id: " + id);
        }
        enterpriseRepository.deleteById(id);
    }

    /**
     * Map EnterpriseRequest DTO to Enterprise entity.
     */
    private Enterprise mapRequestToEntity(Enterprise enterprise, EnterpriseRequest request) {
        enterprise.setName(request.getName());
        enterprise.setIndustry(request.getIndustry());
        enterprise.setDescription(request.getDescription());
        enterprise.setWebsite(request.getWebsite());
        enterprise.setLogoUrl(request.getLogoUrl());
        enterprise.setAddressLine1(request.getAddressLine1());
        enterprise.setAddressLine2(request.getAddressLine2());
        enterprise.setCity(request.getCity());
        enterprise.setState(request.getState());
        enterprise.setPostalCode(request.getPostalCode());
        enterprise.setCountry(request.getCountry());
        enterprise.setLatitude(request.getLatitude());
        enterprise.setLongitude(request.getLongitude());
        return enterprise;
    }
}
