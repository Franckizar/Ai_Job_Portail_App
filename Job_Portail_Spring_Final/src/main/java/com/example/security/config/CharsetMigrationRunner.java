package com.example.security.config;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class CharsetMigrationRunner {

    private final JdbcTemplate jdbcTemplate;

    public CharsetMigrationRunner(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostConstruct
    public void updateCharset() {
        try {
            String sql = "ALTER TABLE `cv` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;";
            jdbcTemplate.execute(sql);
            System.out.println("Database charset conversion executed.");
        } catch (Exception e) {
            System.err.println("Failed to execute charset conversion: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
