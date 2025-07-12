FROM openjdk:21-jdk
WORKDIR /app
COPY target/security-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8086
CMD ["java", "-jar", "app.jar"]

# # HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
# #   CMD curl -f http://localhost:8080/actuator/health || exit 1