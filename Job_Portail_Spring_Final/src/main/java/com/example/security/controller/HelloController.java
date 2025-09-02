package com.example.security.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.security.Other.community.post.Post;
import com.example.security.Other.community.post.PostRepository;
import com.example.security.auth.Authentication.AuthenticationService;
import com.example.security.user.User;
import com.example.security.user.Admin.AdminService;
import com.example.security.user.Enterprise.EnterpriseService;
import com.example.security.user.JobSeeker.JobSeekerService;
import com.example.security.user.PersonalEmployerProfile.PersonalEmployerService;
import com.example.security.user.Technicien.TechnicianService;

@RestController
@RequestMapping("/api/v1/sharedPlus")
// @RequestMapping("/api/v1/auth/sharedPlus")
public class HelloController {

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private AdminService adminService;

    @Autowired
    private TechnicianService technicianService;

    @Autowired
    private JobSeekerService jobSeekerService;

    @Autowired
    private EnterpriseService enterpriseService;

    @Autowired
    private PersonalEmployerService personalEmployerService;

    @Autowired
    private PostRepository postRepository;

    @PostMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestBody Map<String, Object> body) {
        try {
            System.out.println("Received request to /me");
            
            String role = (String) body.get("role");
            Object idObj = body.get("id");
            
            if (role == null || role.isEmpty()) {
                System.out.println("Role is missing from request body");
                return ResponseEntity
                        .badRequest()
                        .body(Map.of("error", "Role must be provided"));
            }
            
            if (idObj == null) {
                System.out.println("ID is missing from request body");
                return ResponseEntity
                        .badRequest()
                        .body(Map.of("error", "ID must be provided"));
            }
            
            Integer id = null;
            if (idObj instanceof Integer) {
                id = (Integer) idObj;
            } else if (idObj instanceof String) {
                try {
                    id = Integer.parseInt((String) idObj);
                } catch (NumberFormatException e) {
                    System.out.println("Invalid ID format: " + idObj);
                    return ResponseEntity
                            .badRequest()
                            .body(Map.of("error", "Invalid ID format"));
                }
            }
            
            if (id == null) {
                return ResponseEntity
                        .badRequest()
                        .body(Map.of("error", "Valid ID must be provided"));
            }
            
            System.out.println("Looking up user with role: " + role + " and ID: " + id);

            Object userData = null;

            if ("ADMIN".equalsIgnoreCase(role)) {
                userData = adminService.getAdminProfileById(id);
            } else if ("TECHNICIAN".equalsIgnoreCase(role)) {
                userData = technicianService.getById(id);
            } else if ("JOB_SEEKER".equalsIgnoreCase(role) || "JOBSEEKER".equalsIgnoreCase(role)) {
                userData = jobSeekerService.getById(id);
            } else if ("ENTERPRISE".equalsIgnoreCase(role)) {
                userData = enterpriseService.getById(id);
            } else if ("PERSONAL_EMPLOYER".equalsIgnoreCase(role)) {
                userData = personalEmployerService.getById(id);
            } else {
                System.out.println("Unknown role: " + role);
                return ResponseEntity
                        .badRequest()
                        .body(Map.of("error", "Unknown role: " + role));
            }

            if (userData == null) {
                System.out.println("Profile not found for role: " + role + " with ID: " + id);
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Profile not found for role: " + role + " with ID: " + id));
            }
            
            System.out.println("Profile found for role: " + role + " and ID: " + id);
            return ResponseEntity.ok(userData);

        } catch (IllegalArgumentException e) {
            System.out.println("Invalid argument: " + e.getMessage());
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "Invalid argument: " + e.getMessage()));
        } catch (RuntimeException e) {
            System.out.println("Runtime exception: " + e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Runtime error: " + e.getMessage()));
        } catch (Exception e) {
            System.out.println("Unexpected exception in /me endpoint: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal server error: " + e.getMessage()));
        }
    }

    @GetMapping("/user-by-post/{postId}")
    public ResponseEntity<?> findUserByPostId(@PathVariable Integer postId) {
        try {
            System.out.println("Received request to /user-by-post/" + postId);

            if (postId == null) {
                System.out.println("Post ID is missing from request");
                return ResponseEntity
                        .badRequest()
                        .body(Map.of("error", "Post ID must be provided"));
            }

            // Find post by ID
            Post post = postRepository.findById(postId)
                    .orElse(null);
            if (post == null) {
                System.out.println("Post not found for ID: " + postId);
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Post not found with ID: " + postId));
            }

            // Get user from post
            User user = post.getUser();
            if (user == null) {
                System.out.println("No user associated with post ID: " + postId);
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "No user associated with post ID: " + postId));
            }

            Integer userId = user.getId();
         String role = user.getRoles().isEmpty() ? null : user.getRoles().get(0).toString();

            // Fetch profile based on role
            Object userData = null;
            try {
                if ("ADMIN".equalsIgnoreCase(role)) {
                    userData = adminService.getAdminProfileById(userId);
                } else if ("TECHNICIAN".equalsIgnoreCase(role)) {
                    userData = technicianService.getById(userId);
                } else if ("JOB_SEEKER".equalsIgnoreCase(role) || "JOBSEEKER".equalsIgnoreCase(role)) {
                    userData = jobSeekerService.getById(userId);
                } else if ("ENTERPRISE".equalsIgnoreCase(role)) {
                    userData = enterpriseService.getById(userId);
                } else if ("PERSONAL_EMPLOYER".equalsIgnoreCase(role)) {
                    userData = personalEmployerService.getById(userId);
                } else {
                    System.out.println("Unknown role: " + role);
                    return ResponseEntity
                            .badRequest()
                            .body(Map.of("error", "Unknown role: " + role));
                }
            } catch (Exception e) {
                System.out.println("Profile lookup failed for user ID " + userId + ": " + e.getMessage());
            }

            if (userData == null) {
                System.out.println("Profile not found for role: " + role + " with ID: " + userId);
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Profile not found for role: " + role + " with ID: " + userId));
            }

            System.out.println("User found with role: " + role + " and ID: " + userId + " for post ID: " + postId);
            return ResponseEntity.ok(Map.of(
                "role", role,
                "userData", userData
            ));

        } catch (Exception e) {
            System.out.println("Unexpected exception in /user-by-post/{postId} endpoint: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal server error: " + e.getMessage()));
        }
    }
}