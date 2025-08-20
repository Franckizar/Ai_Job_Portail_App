package com.example.security.config;

import org.springframework.stereotype.Component;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.util.AntPathMatcher;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class RouteRoleMapper {

    private final AntPathMatcher pathMatcher = new AntPathMatcher();
    
    // ROLES WITHOUT PREFIX
    private final Map<String, Set<String>> roleMappings = Map.of(
        "/api/v1/admin/**", Set.of("ADMIN"),
        // "/api/v1/user/**", Set.of("USER"),
        "/api/v1/TECHNICIAN/**", Set.of("TECHNICIAN"),
        "/api/v1/JOB_SEEKER/**", Set.of("JOB_SEEKER"),
        "/api/v1/ENTERPRISE/**", Set.of("ENTERPRISE"),
        "/api/v1/shared/**", Set.of("TECHNICIAN", "ENTERPRISE"),
        "/api/v1/sharedPlus/**", Set.of("ENTERPRISE", "ADMIN", "JOB_SEEKER", "PERSONAL_EMPLOYER","TECHNICIAN")

    );

    public boolean isAuthorized(String requestURI, Collection<? extends GrantedAuthority> authorities) {
        // DIRECTLY USE AUTHORITY NAMES (NO ROLE_ PREFIX)
        Set<String> userRoles = authorities.stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toSet());

        for (Map.Entry<String, Set<String>> entry : roleMappings.entrySet()) {
            if (pathMatcher.match(entry.getKey(), requestURI)) {
                return userRoles.stream().anyMatch(entry.getValue()::contains);
            }
        }
        return true; // Allow non-protected routes
    }
}
