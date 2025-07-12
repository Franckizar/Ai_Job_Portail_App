    // package com.example.security.user;
    // import jakarta.persistence.*;
    // import lombok.*;
    // import org.springframework.security.core.GrantedAuthority;
    // import org.springframework.security.core.authority.SimpleGrantedAuthority;
    // import org.springframework.security.core.userdetails.UserDetails;

    // import java.util.Collection;
    // import java.util.List;
    // import java.util.ArrayList;

    // @Data
    // @Builder
    // @NoArgsConstructor
    // @AllArgsConstructor
    // @Entity
    // @Table(name = "users")
    // public class User implements UserDetails {

    //     @Id
    //     @GeneratedValue(strategy = GenerationType.IDENTITY)
    //     private Integer id;
        
    //     private String firstname;
    //     private String lastname;
        
    //     @Column(unique = true)
    //     private String email;
        
    //     private String password;

    //     // User.java
    //     public void logout() {
    //     this.tokenVersion = 0;
    //     }



    //     @Builder.Default
    // // In User.java
    //     @Column(name = "token_version", columnDefinition = "integer default 0")
    //     private Integer tokenVersion = 0;

    //     public void incrementTokenVersion() {
    //         this.tokenVersion = (this.tokenVersion == null) ? 1 : this.tokenVersion + 1;
    //     }


    //     @ElementCollection(fetch = FetchType.EAGER)
    //     @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    //     @Column(name = "role")
    //     @Builder.Default
    //     private List<String> roles = new ArrayList<>();

    //     // Role management methods
    //     public void addRole(String role) {
    //         String normalizedRole = role.toUpperCase();
    //         if (!roles.contains(normalizedRole)) {
    //             roles.add(normalizedRole);
    //         }
    //     }

    //     public void addRole(Role role) {
    //         addRole(role.name());
    //     }

    //     @Override
    //     public Collection<? extends GrantedAuthority> getAuthorities() {
    //         return roles.stream()
    //                 .map(SimpleGrantedAuthority::new) // USER, ADMIN (no prefix)
    //                 .toList();
    //     }
        

    //     // @Override
    //     // public String getUsername() {
    //     //     return email;
    //     // }
    //     @Override
    //     public String getUsername() {
    //         return email;
    //     }

    //     @Override
    //     public boolean isAccountNonExpired() {
    //         return true;
    //     }

    //     @Override
    //     public boolean isAccountNonLocked() {
    //         return true;
    //     }

    //     @Override
    //     public boolean isCredentialsNonExpired() {
    //         return true;
    //     }

    //     @Override
    //     public boolean isEnabled() {
    //         return true;
    //     }
    // }