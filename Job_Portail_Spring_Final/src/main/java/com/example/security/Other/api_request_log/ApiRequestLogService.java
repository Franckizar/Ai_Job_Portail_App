package com.example.security.Other.api_request_log;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ApiRequestLogService {

    private final ApiRequestLogRepository repository;

    // @Autowired
    public ApiRequestLogService(ApiRequestLogRepository repository) {
        this.repository = repository;
    }

    public void saveRequest() {
        repository.save(new ApiRequestLog());
    }

    public long getTotalRequestCount() {
        return repository.count();
    }
}
