package com.example.security.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private static final Logger log = LoggerFactory.getLogger(WebConfig.class);

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        log.info("=== CONFIGURING STATIC RESOURCE HANDLERS ===");
        
        String uploadPath = "file:H:/END OF YEAR PROJECT/Job_Portail_App/uploads/";
        log.info("Configuring static resource handler:");
        log.info("  - URL Pattern: /uploads/**");
        log.info("  - File Location: {}", uploadPath);
        
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadPath)
                .setCachePeriod(3600); // Cache for 1 hour
        
        log.info("Static resource handler configured successfully");
        log.info("Files will be accessible at: http://your-domain/uploads/posts/filename");
    }
}