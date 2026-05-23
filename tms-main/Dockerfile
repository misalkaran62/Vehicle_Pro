# Use Maven with an Alpine-based JDK image to build the application
FROM maven:3.8.7-eclipse-temurin-17-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy Maven project files
COPY pom.xml ./
COPY src ./src

# Package the application (skipping tests for faster build)
RUN mvn clean package -DskipTests

# Use a lightweight JDK Alpine image to run the application
FROM eclipse-temurin:17-jre-alpine

# Set the working directory
WORKDIR /app

# Copy the packaged JAR from the builder stage
COPY --from=builder /app/target/tms.jar tms.jar

# Define file storage path
ENV FILE_STORAGE_PATH=/app/uploads

# Ensure the uploads directory exists
RUN mkdir -p /app/uploads

# Expose the application port
EXPOSE 8080

# Command to run the application
CMD ["java", "-jar", "tms.jar"]
