package com.example.security.config;

import com.example.security.user.User;
import io.jsonwebtoken.*;
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

    // ================== Extract Basic Claims ===================

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
        return (firstname != null && lastname != null)
                ? firstname + " " + lastname
                : extractUsername(token);
    }

    public Integer extractTokenVersion(String token) {
        return extractClaim(token, claims -> claims.get("token_version", Integer.class));
    }

    public Integer extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("userId", Integer.class));
    }

    // ============ Extract Profile-Specific IDs ============

    public Integer extractJobSeekerId(String token) {
        return extractClaim(token, claims -> claims.get("jobSeekerId", Integer.class));
    }

    public Integer extractTechnicianId(String token) {
        return extractClaim(token, claims -> claims.get("technicianId", Integer.class));
    }

    public Integer extractAdminId(String token) {
        return extractClaim(token, claims -> claims.get("adminId", Integer.class));
    }

    public Integer extractEnterpriseId(String token) {
        return extractClaim(token, claims -> claims.get("enterpriseId", Integer.class));
    }

    public Integer extractPersonalEmployerId(String token) {
        return extractClaim(token, claims -> claims.get("personalEmployerId", Integer.class));
    }

    // ============ Extract Roles ============

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

    // ============ Generic Claim ============

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // ============ Generate Token ============

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        if (userDetails instanceof User user) {
            extraClaims.put("token_version", user.getTokenVersion());
            extraClaims.put("userId", user.getId());
            extraClaims.put("firstname", user.getFirstname());
            extraClaims.put("lastname", user.getLastname());

            if (user.getJobSeekerProfile() != null) {
                extraClaims.put("jobSeekerId", user.getJobSeekerProfile().getId());
            }
            if (user.getTechnician() != null) {
                extraClaims.put("technicianId", user.getTechnician().getId());
            }
            if (user.getAdminProfile() != null) {
                extraClaims.put("adminId", user.getAdminProfile().getId());
            }
            if (user.getEnterpriseProfile() != null) {
                extraClaims.put("enterpriseId", user.getEnterpriseProfile().getId());
            }
            if (user.getPersonalEmployerProfile() != null) {
                extraClaims.put("personalEmployerId", user.getPersonalEmployerProfile().getId());
            }

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
        if (!(userDetails instanceof User user)) return false;

        final String email = extractUsername(token);
        final Integer tokenVersion = extractTokenVersion(token);

        return email.equals(user.getUsername()) &&
                tokenVersion != null &&
                tokenVersion.equals(user.getTokenVersion()) &&
                !isTokenExpired(token);
    }

    // ============ Token Expiration ============

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // ============ Internal: Decode ============

    private Claims extractAllClaims(String token) {
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
