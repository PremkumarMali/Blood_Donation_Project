# 🩸 BloodLink | Advanced Blood Donation Management System

[![Version](https://img.shields.io/badge/version-2.0.0-red.svg)](https://github.com/premkumarmali/Blood-Donation-System)
[![React](https://img.shields.io/badge/Frontend-React-blue.svg)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring_Boot-green.svg)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/Database-MySQL-orange.svg)](https://www.mysql.com/)

> **"Every Donor is a Superhero."**  
> BloodLink is a state-of-the-art platform designed to bridge the gap between blood donors, hospitals, and blood banks in real-time. By leveraging modern web technologies and a premium design language, we ensure that life-saving resources are just a click away.

---

## ✨ Key Features

### 🎨 Premium User Experience
- **Glassmorphism Design**: A sleek, modern aesthetic using translucent layers and high-quality blur effects.
- **Dynamic Backgrounds**: Immersive "Vein Flow" and "Mesh Gradient" animations that make the platform feel alive.
- **Micro-Animations**: Smooth transitions and hover effects using CSS3 and Intersection Observer API.
- **Dark/Blood Theme Support**: Customizable interface themes tailored for healthcare environments.

### 👥 Role-Based Ecosystem
- **Donors/Recipients**: Personal dashboards to track donation history, find nearby donors, and earn reward points.
- **Hospital Partners**: Manage patient needs, broadcast SOS alerts, and request blood supplies instantly.
- **Blood Bank Managers**: Comprehensive inventory management, delivery tracking, and order fulfillment.

### 🚀 Core Functionality
- **Real-time Inventory**: Live tracking of blood types (A+, B-, O+, etc.) across multiple storage facilities.
- **Emergency SOS**: instant broadcasting of urgent blood needs to all registered donors in the vicinity.
- **Delivery Tracking**: End-to-end management of blood transport from banks to hospitals.
- **Appointment Scheduling**: Seamless booking system for blood donation sessions.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js 18
- **Styling**: Vanilla CSS3 (Custom Design System), Bootstrap 5
- **Icons**: FontAwesome / Emoji-based iconography
- **State Management**: React Hooks & Context API
- **Routing**: React Router v6

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 17
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA (Hibernate)
- **Security**: Custom Role-Based Authentication

---

## 🏗️ Project Structure

```bash
├── blooddonation/             # Backend (Spring Boot)
│   ├── src/main/java/         # Core logic (Controllers, Models, Services)
│   ├── src/main/resources/    # Configuration & Database properties
│   └── pom.xml                # Maven dependencies
└── blooddonation/Frontend/    # Frontend (React)
    ├── src/components/        # Reusable UI widgets
    ├── src/pages/             # Full-page views (Login, Dashboards, etc.)
    ├── src/styles/            # Global CSS & Theme tokens
    └── public/                # Static assets & Hero images
```

---

## 🚦 Getting Started

### Prerequisites
- **Java JDK 17+**
- **Node.js & npm**
- **MySQL Server**

### 1. Database Setup
1. Create a MySQL database named `blood_donation_db`.
2. Update `application.properties` in the backend with your credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/blood_donation_db
   spring.datasource.username=YOUR_USERNAME
   spring.datasource.password=YOUR_PASSWORD
   ```

### 2. Run Backend
```bash
cd blooddonation
./mvnw spring-boot:run
```

### 3. Run Frontend
```bash
cd blooddonation/Frontend/blood-donation-frontend
npm install
npm start
```

---

## 🛡️ Security & Reliability
- **Data Integrity**: Enforced via relational database constraints and backend validation.
- **Secure Access**: Protected routes ensure users only see data relevant to their role.
- **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile viewing.

---

## 🤝 Contributing
We welcome contributions to make BloodLink even better! Feel free to fork the repo and submit a PR.

---

## 📄 License
This project is licensed under the MIT License.

---

<p align="center">
  Made with ❤️ by the BloodLink Team
</p>
