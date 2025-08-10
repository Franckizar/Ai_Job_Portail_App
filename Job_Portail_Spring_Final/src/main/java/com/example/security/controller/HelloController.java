package com.example.security.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.security.auth.Authentication.AuthenticationService;
import com.example.security.user.User;
import com.example.security.user.Admin.AdminService;
import com.example.security.user.Enterprise.EnterpriseService;
import com.example.security.user.JobSeeker.JobSeekerService;
import com.example.security.user.PersonalEmployerProfile.PersonalEmployerService;
import com.example.security.user.Technicien.TechnicianService;

@RestController
@RequestMapping("/api/v1/sharedPlus")
public class HelloController {

    @Autowired
    private AuthenticationService authenticationService;

    // Secure endpoint: expects JWT in Authorization header + email in body
    // @PostMapping("/me")
    // public ResponseEntity<?> getCurrentUser(@RequestBody Map<String, String> body,
    //                                         @RequestHeader("Authorization") String authHeader) {
    //     try {
    //         System.out.println("Received request to /me with Authorization: " + authHeader);

    //         String emailFromBody = body.get("email");
    //         if (emailFromBody == null || emailFromBody.isEmpty()) {
    //             System.out.println("Email is missing from request body");
    //             return ResponseEntity.badRequest().body("Email must be provided");
    //         }

    //         System.out.println("Looking up user by email: " + emailFromBody);
    //         User user = authenticationService.getUserByEmail(emailFromBody);

    //         if (user == null) {
    //             System.out.println("User not found for email: " + emailFromBody);
    //             return ResponseEntity.status(404).body("User not found");
    //         }

    //         System.out.println("User found: " + user.getEmail() + " | ID: " + user.getId());
    //         return ResponseEntity.ok(user);

    //     } catch (Exception e) {
    //         System.out.println("Exception in /me endpoint: " + e.getMessage());
    //         e.printStackTrace();
    //         return ResponseEntity.status(401).body("Unauthorized or invalid token");
    //     }
    // }

////////////////////////////////////////////////////////////////////////////////////////////


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

    @PostMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestBody Map<String, Object> body) {
        try {
            System.out.println("Received request to /me");
            
            String role = (String) body.get("role");
            Object idObj = body.get("id");
            
            if (role == null || role.isEmpty()) {
                System.out.println("Role is missing from request body");
                return ResponseEntity.badRequest().body("Role must be provided");
            }
            
            if (idObj == null) {
                System.out.println("ID is missing from request body");
                return ResponseEntity.badRequest().body("ID must be provided");
            }
            
            // Convert ID to Integer
            Integer id = null;
            if (idObj instanceof Integer) {
                id = (Integer) idObj;
            } else if (idObj instanceof String) {
                try {
                    id = Integer.parseInt((String) idObj);
                } catch (NumberFormatException e) {
                    return ResponseEntity.badRequest().body("Invalid ID format");
                }
            }
            
            if (id == null) {
                return ResponseEntity.badRequest().body("Valid ID must be provided");
            }
            
            System.out.println("Looking up user with role: " + role + " and ID: " + id);
            
            // Use if conditions to fetch from appropriate table based on role
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
                return ResponseEntity.badRequest().body("Unknown role: " + role);
            }
            
            if (userData == null) {
                System.out.println("Profile not found for role: " + role + " with ID: " + id);
                return ResponseEntity.status(404).body("Profile not found");
            }
            
            System.out.println("Profile found for role: " + role + " with ID: " + id);
            return ResponseEntity.ok(userData);
            
        } catch (IllegalArgumentException e) {
            System.out.println("Profile not found: " + e.getMessage());
            return ResponseEntity.status(404).body("Profile not found: " + e.getMessage());
        } catch (RuntimeException e) {
            System.out.println("Runtime exception: " + e.getMessage());
            return ResponseEntity.status(404).body("Profile not found: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Exception in /me endpoint: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }





//////////////////

























    @PostMapping("/verify-user")
    public ResponseEntity<?> verify_user(@RequestBody Map<String, String> body,
                                            @RequestHeader("Authorization") String authHeader) {
        try {
            System.out.println("Received request to /me with Authorization: " + authHeader);

            String emailFromBody = body.get("email");
            if (emailFromBody == null || emailFromBody.isEmpty()) {
                System.out.println("Email is missing from request body");
                return ResponseEntity.badRequest().body("Email must be provided");
            }

            System.out.println("Looking up user by email: " + emailFromBody);
            User user = authenticationService.getUserByEmail(emailFromBody);

            if (user == null) {
                System.out.println("User not found for email: " + emailFromBody);
                return ResponseEntity.status(404).body("User not found");
            }

            System.out.println("User found: " + user.getEmail() + " | ID: " + user.getId());
            return ResponseEntity.ok(user);

        } catch (Exception e) {
            System.out.println("Exception in /me endpoint: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(401).body("Unauthorized or invalid token");
        }
    }
//     @PostMapping("/verify-user")
//     public ResponseEntity<?> verifyUser(@RequestBody Map<String, String> body) {
//     String emailFromBody = body.get("email");
//     if (emailFromBody == null || emailFromBody.isEmpty()) {
//         return ResponseEntity.badRequest().body("Email must be provided in the request body");
//     }

//     User user = authenticationService.getUserByEmail(emailFromBody);
//     if (user == null) {
//         return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
//     }

//     // Return user info (you may want to customize to avoid returning passwords etc.)
//     return ResponseEntity.ok(user);
// }

}
