package com.example.security.config;

import com.example.security.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String SECRET_KEY;

    @Value("${jwt.expiration}")
    private long JWT_EXPIRATION;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractFirstname(String token) {
        return extractClaim(token, claims -> claims.get("firstname", String.class));
    }

    public String extractLastname(String token) {
        return extractClaim(token, claims -> claims.get("lastname", String.class));
    }

    public String extractFullname(String token) {
        String firstname = extractFirstname(token);
        String lastname = extractLastname(token);
        return (firstname != null && lastname != null) ? firstname + " " + lastname : extractUsername(token);
    }

    public Integer extractTokenVersion(String token) {
        return extractClaim(token, claims -> claims.get("token_version", Integer.class));
    }

    public Integer extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("userId", Integer.class));
    }

    public Integer extractDoctorId(String token) {
        return extractClaim(token, claims -> claims.get("doctorId", Integer.class));
    }

    public Integer extractPatientId(String token) {
        return extractClaim(token, claims -> claims.get("patientId", Integer.class));
    }

    public Integer extractNurseId(String token) {
        return extractClaim(token, claims -> claims.get("nurseId", Integer.class));
    }

    public Integer extractAdminId(String token) {
        return extractClaim(token, claims -> claims.get("adminId", Integer.class));
    }

    public List<String> extractRoles(String token) {
        Claims claims = extractAllClaims(token);
        try {
            @SuppressWarnings("unchecked")
            List<String> roles = (List<String>) claims.get("roles");
            return roles != null ? roles : Collections.emptyList();
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        if (userDetails instanceof User user) {
            // Basic user information
            extraClaims.put("token_version", user.getTokenVersion());
            extraClaims.put("userId", user.getId());
            extraClaims.put("firstname", user.getFirstname());
            extraClaims.put("lastname", user.getLastname());

            // Profile-specific IDs
            if (user.getDoctor() != null) {
                extraClaims.put("doctorId", user.getDoctor().getId());
            }
            if (user.getPatient() != null) {
                extraClaims.put("patientId", user.getPatient().getId());
            }
            if (user.getNurse() != null) {
                extraClaims.put("nurseId", user.getNurse().getId());
            }
            if (user.getAdmin() != null) {
                extraClaims.put("adminId", user.getAdmin().getId());
            }

            // Roles
            List<String> roles = user.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .map(role -> role.replace("ROLE_", ""))
                    .collect(Collectors.toList());
            extraClaims.put("roles", roles);
        }

        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        if (!(userDetails instanceof User user)) {
            return false;
        }

        final String username = extractUsername(token);
        final Integer tokenVersion = extractTokenVersion(token);

        return username.equals(user.getUsername())
                && tokenVersion != null
                && tokenVersion.equals(user.getTokenVersion())
                && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}