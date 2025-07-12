package com.example.security.config;

import io.jsonwebtoken.Claims;
import io.micrometer.common.lang.NonNull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final RouteRoleMapper routeRoleMapper;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        
        final String authHeader = request.getHeader("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);
        
        try {
            final String userEmail = jwtService.extractUsername(jwt);
            
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
                
                // Validate token structure and expiration
                if (!jwtService.isTokenValid(jwt, userDetails)) {
                    response.sendError(HttpServletResponse.SC_FORBIDDEN, "Invalid token");
                    return;
                }

                // Extract and validate roles
                List<String> jwtRoles = jwtService.extractRoles(jwt);
                if (!validateJwtRoles(userDetails, jwtRoles)) {
                    response.sendError(HttpServletResponse.SC_FORBIDDEN, "Invalid role claims");
                    return;
                }

                // Convert roles to authorities (without ROLE_ prefix)
                Set<GrantedAuthority> authorities = jwtRoles.stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toSet());

                // Route authorization check
                if (!routeRoleMapper.isAuthorized(request.getRequestURI(), authorities)) {
                    response.sendError(HttpServletResponse.SC_FORBIDDEN, "Insufficient privileges");
                    return;
                }

                // Create authentication token
                UsernamePasswordAuthenticationToken authToken = 
                    new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        authorities
                    );
                
                authToken.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
                );
                
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        } catch (Exception ex) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, 
                "Authentication failed: " + ex.getMessage());
            return;
        }
        
        filterChain.doFilter(request, response);
    }

    private boolean validateJwtRoles(UserDetails userDetails, List<String> jwtRoles) {
        Set<String> validRoles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(role -> role.replace("ROLE_", ""))
                .collect(Collectors.toSet());
        
        return jwtRoles.stream().allMatch(validRoles::contains);
    }
}