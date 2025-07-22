package com.example.security.user.PersonalEmployerProfile;

import com.example.security.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PersonalEmployerService {

    private final PersonalEmployerProfileRepository personalEmployerProfileRepository;

    // Create new profile
    public PersonalEmployerProfile create(User user, PersonalEmployerRequest request) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        if (personalEmployerProfileRepository.findByUserId(user.getId()).isPresent()) {
            throw new IllegalStateException("Personal employer profile already exists for this user");
        }
        PersonalEmployerProfile profile = mapRequestToEntity(new PersonalEmployerProfile(), request);
        profile.setUser(user);
        return personalEmployerProfileRepository.save(profile);
    }

    // Update profile by ID
    public PersonalEmployerProfile update(Integer id, PersonalEmployerRequest request) {
        PersonalEmployerProfile existing = personalEmployerProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profile not found with id: " + id));
        PersonalEmployerProfile updated = mapRequestToEntity(existing, request);
        return personalEmployerProfileRepository.save(updated);
    }

    // Get by ID
    public PersonalEmployerProfile getById(Integer id) {
        return personalEmployerProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profile not found with id: " + id));
    }

    // Get All
    public List<PersonalEmployerProfile> getAll() {
        return personalEmployerProfileRepository.findAll();
    }

    // Delete by ID
    public void deleteById(Integer id) {
        if (!personalEmployerProfileRepository.existsById(id)) {
            throw new RuntimeException("Profile not found with id: " + id);
        }
        personalEmployerProfileRepository.deleteById(id);
    }

    // Map request DTO to entity
    private PersonalEmployerProfile mapRequestToEntity(PersonalEmployerProfile profile, PersonalEmployerRequest request) {
        profile.setDisplayName(request.getDisplayName());
        profile.setBio(request.getBio());
        profile.setProfileImageUrl(request.getProfileImageUrl());
        profile.setContactNumber(request.getContactNumber());
        profile.setAddressLine1(request.getAddressLine1());
        profile.setAddressLine2(request.getAddressLine2());
        profile.setCity(request.getCity());
        profile.setState(request.getState());
        profile.setPostalCode(request.getPostalCode());
        profile.setCountry(request.getCountry());
        profile.setLatitude(request.getLatitude());
        profile.setLongitude(request.getLongitude());
        return profile;
    }
}
