package com.example.security.user.Doctor;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth/doctor/stats")
@RequiredArgsConstructor
public class StatsController {
    private final StatsService statsService;

    @GetMapping("/users/count")
    public long getTotalUsers() {
        return statsService.getTotalUsers();
    }

    @GetMapping("/patients/count")
    public long getTotalPatients() {
        return statsService.getTotalPatients();
    }

    @GetMapping("/nurses/count")
    public long getTotalNurses() {
        return statsService.getTotalNurses();
    }

    @GetMapping("/dentists/count")
    public long getTotalDentists() {
        return statsService.getTotalDentists();
    }



    @GetMapping("/weekly")
    public List<Map<String, Object>> getWeeklyAttendance() {
        List<Map<String, Object>> data = new ArrayList<>();
        data.add(Map.of("name", "Mon", "present", 4000, "Absent", 2400));
        data.add(Map.of("name", "Tue", "present", 3000, "Absent", 1398));
        data.add(Map.of("name", "Wed", "present", 2000, "Absent", 9800));
        data.add(Map.of("name", "Thus", "present", 2780, "Absent", 3908));
        data.add(Map.of("name", "Fri", "present", 1890, "Absent", 4800));
        return data;
    }
}


