// package com.example.security.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.servlet.config.annotation.CorsRegistry;
// import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// @Configuration
// public class WebConfig {
//     @Bean
//     public WebMvcConfigurer corsConfigurer() {
//         return new WebMvcConfigurer() {
//             @Override
//             public void addCorsMappings(CorsRegistry registry) {
//                 registry.addMapping("/**")
//                     // ✅ Use specific origins instead of "*" when allowCredentials is true
//                     .allowedOrigins(
//                         "http://localhost:3000",    // React development server
//                         "http://localhost:3001",    // Alternative React port
//                         "http://127.0.0.1:3000"     // Alternative localhost format
//                     )
//                     .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
//                     .allowedHeaders("*")
//                     .allowCredentials(true)
//                     .maxAge(3600); // Cache preflight response for 1 hour
//             }
//         };
//     }
// }

// // Alternative: Environment-based configuration
// // @Configuration
// // public class WebConfig {
// //     @Value("${app.cors.allowed-origins:http://localhost:3000}")
// //     private String[] allowedOrigins;
// //     
// //     @Bean
// //     public WebMvcConfigurer corsConfigurer() {
// //         return new WebMvcConfigurer() {
// //             @Override
// //             public void addCorsMappings(CorsRegistry registry) {
// //                 registry.addMapping("/**")
// //                     .allowedOrigins(allowedOrigins)
// //                     .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
// //                     .allowedHeaders("*")
// //                     .allowCredentials(true);
// //             }
// //         };
// //     }
// // }