package com.example.security.user.Enterprise;

import com.example.security.UserRepository;
import com.example.security.user.Role;
import com.example.security.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EnterpriseService {

    private final EnterpriseRepository enterpriseRepository;
    private final UserRepository userRepository;

    /**
     * Register or update an enterprise account linked to a user.
     */
    @Transactional
    public Enterprise registerOrUpdate(Integer userId, EnterpriseRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        // Assign ENTERPRISE role
        user.getRoles().clear();
        user.addRole(Role.ENTERPRISE);
        userRepository.save(user);

        // Find or create enterprise profile
        Enterprise enterprise = enterpriseRepository.findByUserId(userId)
                .orElse(Enterprise.builder().user(user).build());

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

        return enterpriseRepository.save(enterprise);
    }

    // Used by AuthenticationService during enterprise registration
    @Transactional
    public Enterprise create(User user, EnterpriseRequest request) {
        user.getRoles().clear();
        user.addRole(Role.ENTERPRISE);
        userRepository.save(user);

        Enterprise enterprise = Enterprise.builder()
                .user(user)
                .name(request.getName())
                .industry(request.getIndustry())
                .description(request.getDescription())
                .website(request.getWebsite())
                .logoUrl(request.getLogoUrl())
                .addressLine1(request.getAddressLine1())
                .addressLine2(request.getAddressLine2())
                .city(request.getCity())
                .state(request.getState())
                .postalCode(request.getPostalCode())
                .country(request.getCountry())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .build();

        return enterpriseRepository.save(enterprise);
    }

    public Enterprise getById(Long id) {
        return enterpriseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Enterprise not found with ID: " + id));
    }

    public Enterprise getByUserId(Integer userId) {
        return enterpriseRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Enterprise not found for user ID: " + userId));
    }

    public List<Enterprise> getAll() {
        return enterpriseRepository.findAll();
    }

    public List<Enterprise> searchByIndustry(String industry) {
        return enterpriseRepository.findByIndustryContainingIgnoreCase(industry);
    }

    @Transactional
    public void delete(Long id) {
        enterpriseRepository.deleteById(id);
    }
}
