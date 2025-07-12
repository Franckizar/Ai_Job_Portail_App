package com.example.security.user;

import com.example.security.user.Patient.PatientProfile;
import com.example.security.user.Doctor.DoctorProfile;
import com.example.security.user.Nurse.NurseProfile;
import com.example.security.user.adminthings.AdminProfile;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String firstname;
    private String lastname;

    @Column(unique = true)
    private String email;

    private String password;

    @Builder.Default
    @Column(name = "token_version", columnDefinition = "integer default 0")
    private Integer tokenVersion = 0;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role")
    @Builder.Default
    private List<String> roles = new ArrayList<>();

    // Role profile relationships (Bidirectional)

    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
    private PatientProfile patientProfile;

    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
    private DoctorProfile doctorProfile;

    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
    private NurseProfile nurseProfile;

    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
    private AdminProfile adminProfile;

    // Utility Methods

    public void logout() {
        this.tokenVersion = 0;
    }

    public void incrementTokenVersion() {
        this.tokenVersion = (this.tokenVersion == null) ? 1 : this.tokenVersion + 1;
    }

    public void addRole(String role) {
        String normalizedRole = role.toUpperCase();
        if (!roles.contains(normalizedRole)) {
            roles.add(normalizedRole);
        }
    }

    public void addRole(Role role) {
        addRole(role.name());
    }

    public boolean hasRole(String role) {
        return roles.contains(role.toUpperCase());
    }

    public boolean hasRole(Role role) {
        return hasRole(role.name());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(SimpleGrantedAuthority::new)
                .toList();
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }

    // Custom helper getters for JWT or other places:
    public PatientProfile getPatient() {
        return patientProfile;
    }

    public DoctorProfile getDoctor() {
        return doctorProfile;
    }

    public NurseProfile getNurse() {
        return nurseProfile;
    }

    public AdminProfile getAdmin() {
        return adminProfile;
    }
}
