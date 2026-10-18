# Multi-stage Docker build from repo root
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app/backend
COPY backend/pom.xml .
# Download dependencies for layer caching
RUN mvn dependency:go-offline -B
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Runtime Stage (Lightweight JRE Alpine)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/backend/target/junction-backend-0.0.1-SNAPSHOT.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
