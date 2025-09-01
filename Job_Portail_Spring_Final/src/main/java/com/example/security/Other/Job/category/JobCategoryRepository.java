package com.example.security.Other.Job.category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobCategoryRepository extends JpaRepository<JobCategory, Integer> {
    // Optional: find by name if needed
    JobCategory findByName(String name);
}
