package com.example.security.Other.Job.category;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
// @RequestMapping("/api/v1/auth/job-categories")
// @RequestMapping("/api/v1/auth/job-categories")
@RequestMapping("/api/v1/auth/job-categories")
@RequiredArgsConstructor
public class JobCategoryController {

    private final JobCategoryService categoryService;

    @PostMapping
    public ResponseEntity<JobCategory> createCategory(@RequestBody JobCategory category) {
        return ResponseEntity.ok(categoryService.createCategory(category));
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<JobCategory>> createCategoriesBulk(@RequestBody List<JobCategory> categories) {
        return ResponseEntity.ok(categoryService.createCategoriesBulk(categories));
    }

    @GetMapping
    public ResponseEntity<List<JobCategory>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobCategory> getCategoryById(@PathVariable Integer id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobCategory> updateCategory(@PathVariable Integer id, @RequestBody JobCategory category) {
        return ResponseEntity.ok(categoryService.updateCategory(id, category));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Integer id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
