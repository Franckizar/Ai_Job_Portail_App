package com.example.security.secure;

import com.example.security.Other.Application.Application;
import com.example.security.Other.Application.ApplicationRepository;
import com.example.security.Other.Job.Job;
import com.example.security.Other.Job.JobRepository;
import com.example.security.Other.Payment.Payment;
import com.example.security.Other.Payment.PaymentRepository;
import com.example.security.secure.Admin.ARepository;
import com.example.security.user.Enterprise.Enterprise;
import com.example.security.user.Enterprise.EnterpriseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class TController {

    private final ARepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final PaymentRepository paymentRepository;
    private final EnterpriseRepository enterpriseRepository;

    @GetMapping("/hello_admin")
    public ResponseEntity<String> sayHello(){
        return ResponseEntity.ok("hello from secure endpoint i am an admin user");
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // Basic counts
        stats.put("totalUsers", userRepository.countTotalUsers());
        stats.put("activeJobs", jobRepository.countActiveJobs());
        stats.put("pendingApprovals", jobRepository.countByStatus(Job.JobStatus.ACTIVE)); // Assuming active jobs need approval
        stats.put("totalApplications", applicationRepository.countSubmittedApplications());

        // Premium enterprises (assuming enterprises with premium subscriptions)
        long premiumEnterprises = enterpriseRepository.count();
        stats.put("premiumEnterprises", premiumEnterprises);

        // Revenue calculation
        double totalRevenue = paymentRepository.findAll().stream()
                .filter(p -> p.getStatus() == Payment.PaymentStatus.COMPLETED)
                .mapToDouble(p -> p.getAmount() != null ? p.getAmount() : 0.0)
                .sum();
        stats.put("revenue", totalRevenue);

        // Matches made (simplified - could be based on accepted applications)
        long matchesMade = applicationRepository.countByStatus(Application.ApplicationStatus.ACCEPTED);
        stats.put("matchesMade", matchesMade);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/stats/users")
    public ResponseEntity<Map<String, Object>> getUserStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("count", userRepository.countTotalUsers());
        stats.put("change", 12); // Mock change percentage
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/stats/jobs")
    public ResponseEntity<Map<String, Object>> getJobStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("count", jobRepository.countActiveJobs());
        stats.put("change", 8); // Mock change percentage
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/stats/enterprises")
    public ResponseEntity<Map<String, Object>> getEnterpriseStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("count", enterpriseRepository.count());
        stats.put("change", 15); // Mock change percentage
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/stats/revenue")
    public ResponseEntity<Map<String, Object>> getRevenueStats() {
        double totalRevenue = paymentRepository.findAll().stream()
                .filter(p -> p.getStatus() == Payment.PaymentStatus.COMPLETED)
                .mapToDouble(p -> p.getAmount() != null ? p.getAmount() : 0.0)
                .sum();

        Map<String, Object> stats = new HashMap<>();
        stats.put("amount", totalRevenue);
        stats.put("change", 25); // Mock change percentage
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/activities")
    public ResponseEntity<List<Map<String, Object>>> getRecentActivities() {
        List<Map<String, Object>> activities = new ArrayList<>();

        // Get recent jobs
        List<Job> recentJobs = jobRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(5)
                .collect(Collectors.toList());

        for (Job job : recentJobs) {
            Map<String, Object> activity = new HashMap<>();
            activity.put("id", job.getId());
            activity.put("type", "job_post");
            activity.put("title", "New job posted");
            activity.put("description", job.getTitle() + " at " +
                (job.getEnterprise() != null ? job.getEnterprise().getName() : "Personal Employer"));
            activity.put("time", formatTimeAgo(job.getCreatedAt()));
            activity.put("icon", "Briefcase");
            activities.add(activity);
        }

        // Get recent applications
        List<Application> recentApplications = applicationRepository.findAll().stream()
                .sorted((a, b) -> b.getAppliedAt().compareTo(a.getAppliedAt()))
                .limit(3)
                .collect(Collectors.toList());

        for (Application app : recentApplications) {
            Map<String, Object> activity = new HashMap<>();
            activity.put("id", app.getId() + 1000); // Offset to avoid ID conflicts
            activity.put("type", "application");
            activity.put("title", "New application received");
            activity.put("description", "Application for " + app.getJob().getTitle());
            activity.put("time", formatTimeAgo(app.getAppliedAt()));
            activity.put("icon", "FileCheck");
            activities.add(activity);
        }

        // Sort all activities by time
        activities.sort((a, b) -> ((String) b.get("time")).compareTo((String) a.get("time")));

        return ResponseEntity.ok(activities.subList(0, Math.min(activities.size(), 8)));
    }

    @GetMapping("/top-enterprises")
    public ResponseEntity<List<Map<String, Object>>> getTopEnterprises() {
        List<Map<String, Object>> topEnterprises = new ArrayList<>();

        List<Enterprise> enterprises = enterpriseRepository.findAll().stream()
                .limit(5)
                .collect(Collectors.toList());

        for (Enterprise enterprise : enterprises) {
            Map<String, Object> enterpriseData = new HashMap<>();
            enterpriseData.put("id", enterprise.getId());
            enterpriseData.put("name", enterprise.getName());

            // Count jobs for this enterprise
            long jobCount = jobRepository.findAll().stream()
                    .filter(job -> job.getEnterprise() != null && job.getEnterprise().getId().equals(enterprise.getId()))
                    .count();
            enterpriseData.put("jobs", (int) jobCount);

            // Mock member count (could be based on enterprise users)
            enterpriseData.put("members", new Random().nextInt(20) + 5);

            // Mock join date
            enterpriseData.put("joined", "2024-01-15");

            topEnterprises.add(enterpriseData);
        }

        return ResponseEntity.ok(topEnterprises);
    }

    @GetMapping("/recent-jobs")
    public ResponseEntity<List<Map<String, Object>>> getRecentJobs() {
        List<Map<String, Object>> recentJobs = new ArrayList<>();

        List<Job> jobs = jobRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(10)
                .collect(Collectors.toList());

        for (Job job : jobs) {
            Map<String, Object> jobData = new HashMap<>();
            jobData.put("id", job.getId());
            jobData.put("title", job.getTitle());
            jobData.put("company", job.getEnterprise() != null ? job.getEnterprise().getName() : "Personal Employer");

            // Count applications for this job
            long applicationCount = applicationRepository.findByJob_Id(job.getId()).size();
            jobData.put("applications", (int) applicationCount);

            jobData.put("status", job.getStatus().toString().toLowerCase());
            jobData.put("posted", formatTimeAgo(job.getCreatedAt()));

            recentJobs.add(jobData);
        }

        return ResponseEntity.ok(recentJobs);
    }

    private String formatTimeAgo(LocalDateTime dateTime) {
        if (dateTime == null) return "Unknown";

        LocalDateTime now = LocalDateTime.now();
        long minutes = java.time.Duration.between(dateTime, now).toMinutes();

        if (minutes < 60) {
            return minutes + " mins ago";
        } else if (minutes < 1440) {
            return (minutes / 60) + " hours ago";
        } else {
            return (minutes / 1440) + " days ago";
        }
    }
}
