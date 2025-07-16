package com.example.security.Other.api_request_log;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@CrossOrigin // <-- Allow frontend requests. Limit origins in production!
@RestController
@RequestMapping("/api/v1/auth")
public class ApiRequestLogController {

    @Autowired
    private ApiRequestLogService logService;

    @PostMapping("/track")
    public Map<String, Object> trackRequest() {
        logService.saveRequest();
        return Map.of("count", logService.getTotalRequestCount());
    }

    @GetMapping("/count")
    public Map<String, Object> getRequestCount() {
        return Map.of("count", logService.getTotalRequestCount());
    }
}
