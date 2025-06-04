# 🍽️ Restaurant Table Booking Assignment 

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

A backend API for restaurant table booking applications, built with Node.js, Express, TypeScript, and PostgreSQL.

## 📝 Table of Contents

- [Live API](#live-api)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Project ScreenShots](#project-screenshots)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)

## 🌐 Live API

Base URL: https://restaurant-booking-backend-rb4t.onrender.com
OpenAPI Doc URL: https://restaurant-booking-backend-rb4t.onrender.com/api-docs/

## ✨ Features

### 👤 User Management

- Complete user authentication system:
  - Secure signup and login
  - Password encryption with bcrypt
  - JWT-based authentication
  - User profile management

### 🪑 Table Booking System

- Intelligent table reservation system:
  - Check real-time availability
  - Book tables with guest count
  - Receive booking confirmations
  - Prevent double bookings

### 📅 Reservation Management

- Comprehensive reservation handling:
  - View reservation history
  - Cancel reservations
  - Filter reservations by status (active, completed, cancelled)

### 📬 Email Notifications Using Resend

- Automated notifications for:
  - Booking confirmations
  - Booking cancellations

## 🛠️ Tech Stack

- **Backend Framework**: Node.js with Express
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Vitest
- **Email Notifications**: Resend

## 📡 API Endpoints

### Authentication

- `POST /api/v1/user/signup` - Register a new user
- `POST /api/v1/user/login` - Login user

### Restaurants

- `GET /api/v1/restaurant` - Get all restaurants
- `GET /api/v1/restaurant/:id` - Get a specific restaurant
- `POST /api/v1/restaurant` - Add a new restaurant

### Reservations

- `POST /api/v1/reservation` - Create a new reservation
- `GET /api/v1/reservation/:userId` - Get user's reservations
- `DELETE /api/v1/reservation` - Cancel a reservation

## 🚀 Getting Started

## Project ScreenShots

### Vitest Testing

![image1](https://github.com/AshutoshDM1/Restaurant-Booking-Backend/blob/main/assets/image1.png)

### Neon DB with Demo Data

![image2](https://github.com/AshutoshDM1/Restaurant-Booking-Backend/blob/main/assets/image2.png)

### Live Testing Hopscotch

![image3](https://github.com/AshutoshDM1/Restaurant-Booking-Backend/blob/main/assets/image3.png)

### OpenAPI Spec Doc

![image4](https://github.com/AshutoshDM1/Restaurant-Booking-Backend/blob/main/assets/image4.png)

### Notification Email

![image4](https://github.com/AshutoshDM1/Restaurant-Booking-Backend/blob/main/assets/image5.png)

### No Double Booking

![image4](https://github.com/AshutoshDM1/Restaurant-Booking-Backend/blob/main/assets/image6.png)

### Prerequisites

- Node.js (v14+)
- PostgreSQL
- pnpm

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/restaurant-booking-backend.git
cd restaurant-booking-backend
```

2. Install dependencies

```bash
pnpm install
```

3. Set up environment variables (see .env.example)

4. Setup the database

```bash
pnpx prisma db pull
```

5. Start the development server

```bash
pnpm run dev
```

## 🔐 Environment Variables

Create a `.env` file in the project root with these variables:

```
DATABASE_URL=postgresql://username:password@localhost:5432/restaurant_booking
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

## 📊 Database Schema

The application uses the following primary data models:

- **User**: Stores user information and authentication details
- **Restaurant**: Contains restaurant information and seating capacity
- **Booking**: Records reservations with status tracking

## 🤝 Thank for the Assignment

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
