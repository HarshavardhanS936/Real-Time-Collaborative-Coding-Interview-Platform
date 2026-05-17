# Build stage
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
# Download dependencies first to utilize Docker layer caching
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-alpine
RUN apk add --no-cache docker-cli
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
