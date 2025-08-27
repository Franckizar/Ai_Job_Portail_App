    package com.example.security.config;

    import org.slf4j.Logger;
    import org.slf4j.LoggerFactory;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
    import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

    import java.nio.file.Paths;

    @Configuration
    public class WebConfig implements WebMvcConfigurer {

        private static final Logger log = LoggerFactory.getLogger(WebConfig.class);

        @Override
        public void addResourceHandlers(ResourceHandlerRegistry registry) {
            log.info("=== CONFIGURING STATIC RESOURCE HANDLERS ===");

            // Your local folder where files are uploaded
            String uploadDir = "H:/END OF YEAR PROJECT/Job_Portail_App/uploads/";
            String resourcePath = Paths.get(uploadDir).toUri().toString();

            log.info("Configuring static resource handler:");
            log.info("  - URL Pattern: /uploads/**");
            log.info("  - File Location: {}", resourcePath);

            registry.addResourceHandler("/uploads/**")
                    .addResourceLocations(resourcePath)
                    .setCachePeriod(3600); // 1 hour cache

            log.info("Static resource handler configured successfully");
            log.info("Files will be accessible at: http://localhost:8080/uploads/...");
        }
    }
