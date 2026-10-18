# Deployment Guide - Svad Malai Chaap Junction 🚀

This document explains how to deploy both the Frontend (React + Vite) and the Backend (Spring Boot 3 + MySQL) to production free cloud tiers (Vercel & Render/Railway/Aiven).

---

## 1. Frontend Deployment (Vercel)

### Option A: Using Vercel CLI
1. Inside `frontend`:
   ```bash
   cd frontend
   npx vercel
   ```
2. Follow prompts (Framework: Vite, Root: `./`).
3. Set Environment Variable:
   - `VITE_API_URL` = Your backend URL (e.g. `https://malai-chaap-backend.onrender.com/api`)

### Option B: Using GitHub & Vercel Dashboard
1. Push `malai-chaap-junction` to a GitHub repository.
2. In Vercel, click "New Project" and import the repo.
3. Set **Root Directory** to `frontend`.
4. Add environment variable `VITE_API_URL`.
5. Click **Deploy**.

---

## 2. Cloud MySQL Database Setup

You can use free cloud MySQL databases from:
- **Aiven Cloud MySQL** (Free tier)
- **Railway.app MySQL** (Free trial)
- **TiDB Cloud Serverless** (Free MySQL compatible)

Get your connection string:
```
jdbc:mysql://<host>:<port>/<dbname>?useSSL=true&serverTimezone=Asia/Kolkata
```

---

## 3. Backend Deployment (Render.com / Docker)

### Option A: Deploy with Docker on Render
Create a `Dockerfile` in `backend`:
```dockerfile
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Environment Variables on Render:
- `SPRING_DATASOURCE_URL`: Your cloud MySQL JDBC URL
- `SPRING_DATASOURCE_USERNAME`: Your MySQL username
- `SPRING_DATASOURCE_PASSWORD`: Your MySQL password
- `PORT`: `8080`

The backend will automatically create tables and seed all 137 menu items on first run!
