# Real-Time Collaborative Coding Interview Platform

A scalable, real-time collaborative code editor and remote interview platform built with Java Spring Boot, React, and WebSockets. Designed to simulate the experience of modern technical interviews (similar to LeetCode or HackerRank), allowing multiple users to write, compile, and execute code simultaneously.

## 🚀 Key Features

*   **Real-Time Collaboration:** Low-latency code synchronization and cursor tracking using STOMP over WebSockets.
*   **Secure Code Execution Engine:** Ephemeral, heavily restricted Docker containers for safely compiling and running untrusted Java, Python, and C++ submissions.
*   **Role-Based Workspaces:** Distinct dashboard and permissions for Interviewers and Candidates, secured via stateless JWT Authentication.
*   **Analytics Dashboard:** Visual performance tracking, execution times, and historical success rates utilizing Recharts.
*   **Rich IDE Experience:** Integrated Microsoft Monaco Editor for syntax highlighting, auto-completion, and a VS Code-like feel.

## 🛠️ Tech Stack

*   **Backend:** Java 21, Spring Boot 3, Spring Security (JWT), Spring WebSocket, Spring Data JPA
*   **Frontend:** React 18, Vite, Tailwind CSS, Monaco Editor, Axios
*   **Infrastructure:** PostgreSQL, Docker, Docker Compose, GitHub Actions (CI/CD), Nginx

## 🏗️ High-Level Architecture

The platform utilizes a decoupled Client-Server architecture. The React Single Page Application communicates with the Spring Boot backend via REST APIs for authentication and data retrieval. Inside an interview room, a persistent bidirectional WebSocket connection is established to broadcast code deltas to all participants in real-time. Code execution is offloaded to a secure, isolated container environment to protect the host server from malicious inputs or resource exhaustion.

## ⚙️ Quick Start (Local Setup)

Prerequisites: Docker and Docker Compose installed.

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/collaborative-coding-platform.git
   cd collaborative-coding-platform
   ```

2. Spin up the entire infrastructure:
   ```bash
   docker-compose up --build
   ```

3. Access the application:
   * Frontend: `http://localhost:3000`
   * Backend API: `http://localhost:8080`

## 🛡️ License

This project is licensed under the MIT License.
