# Fitness Tracker - Microservices Application

A full-stack fitness tracking application built with Spring Boot microservices and React, featuring AI-powered workout recommendations using Google Gemini.

## Architecture
The application follows a microservices architecture with the following services:

- **API Gateway** - Single entry point, handles authentication via Keycloak OAuth2
- **User Service** - Manages user profiles and registration (PostgreSQL)
- **Activity Service** - Tracks fitness activities (MongoDB + RabbitMQ)
- **AI Service** - Generates AI-powered recommendations using Google Gemini (MongoDB)
- **Config Server** - Centralized configuration management
- **Eureka Server** - Service discovery and load balancing

## Tech Stack

### Backend
- Java + Spring Boot
- Spring Cloud Gateway
- Spring Cloud Netflix Eureka
- Spring Cloud Config Server
- Spring Security + OAuth2 (Keycloak)
- RabbitMQ (async messaging)
- Google Gemini AI API
- PostgreSQL (User data)
- MongoDB Atlas (Activities & Recommendations)

### Frontend
- React 18 + Vite
- Material UI (MUI)
- Axios
- Redux Toolkit
- Keycloak PKCE OAuth2

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- Docker (for RabbitMQ)
- Keycloak server
- PostgreSQL
- MongoDB Atlas account
- Google Gemini API key

### 1. Clone the repository
```bash
git clone https://github.com/RashiMalik02/fitnessTracker.git
cd fitnessTracker
```

### 2. Configure services
Fill in the placeholders in `configserver/src/main/resources/config/`:

| File | Required Values |
|------|----------------|
| `user-service.yml` | PostgreSQL URL, username, password |
| `activity-service.yml` | MongoDB URI |
| `ai-service.yml` | MongoDB URI, Gemini API URL, Gemini API Key |
| `api-gateway.yml` | Keycloak realm URL |

Update `fitness-app-frontend/src/authConfig.js` with your Keycloak endpoints.

### 3. Start RabbitMQ
```bash
docker start rabbitmq
# or if first time:
docker run -d --hostname rabbit-host --name rabbitmq \
  -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

### 4. Start services in order
```bash
# 1. Eureka Server (port 8671)
# 2. Config Server (port 8888)
# 3. User Service (port 8081)
# 4. Activity Service (port 8082)
# 5. AI Service (port 8083)
# 6. API Gateway (port 8080)
```

### 5. Start the frontend
```bash
cd fitness-app-frontend
npm install
npm run dev
```

Visit `http://localhost:5173`

## 🔑 Keycloak Setup
1. Create a realm named `fitness-oauth2`
2. Create a client with PKCE enabled
3. Set redirect URI to `http://localhost:5173`
4. Enable `email`, `profile` scopes

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register user |
| GET | `/api/users/{userId}` | Get user profile |
| POST | `/api/activities` | Log activity |
| GET | `/api/activities` | Get user activities |
| GET | `/api/recommendations/activity/{id}` | Get AI recommendation |

## Features
- Secure authentication via Keycloak (PKCE OAuth2)
- Track running, walking, cycling activities
- AI-powered workout analysis and recommendations via Google Gemini
- Async processing via RabbitMQ
- Service discovery via Eureka
- Centralized config management