package com.example.security.Other.Job;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class JobCategoryService {

    private final JobCategoryRepository categoryRepository;

    // Create single category
    public JobCategory createCategory(JobCategory category) {
        return categoryRepository.save(category);
    }

    // Create multiple categories in bulk
    public List<JobCategory> createCategoriesBulk(List<JobCategory> categories) {
        return categoryRepository.saveAll(categories);
    }

    // Get all categories
    public List<JobCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Get category by id
    public JobCategory getCategoryById(Integer id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Category not found with id: " + id));
    }

    // Update category
    public JobCategory updateCategory(Integer id, JobCategory updatedCategory) {
        JobCategory category = getCategoryById(id);
        category.setName(updatedCategory.getName());
        return categoryRepository.save(category);
    }

    // Delete category
    public void deleteCategory(Integer id) {
        JobCategory category = getCategoryById(id);
        categoryRepository.delete(category);
    }
}
