# 🚗 Vehicle Rental System

**Live Deployment:** [https://rentalsystem-lilac.vercel.app/](https://rentalsystem-lilac.vercel.app/)

---

## 🎯 Project Overview
This is a backend API for a vehicle rental management system, built with a **modular and layered architecture**. It handles:

- **Vehicles:** Manage vehicle inventory with availability tracking
- **Customers:** Manage customer accounts and profiles
- **Bookings:** Handle vehicle rentals, returns, and cost calculation
- **Authentication:** Secure role-based access control (Admin and Customer roles)

**Architecture:** Modular pattern with proper layering
- **Modules:** `auth`, `users`, `vehicles`, `bookings`  
- **Each module contains:** `routes`, `controllers`, `services`  
- **Middleware:** Authentication, validation, and error handling  

---

## 🛠️ Features & Technology Stack

### Features
- **User Authentication & Authorization** – Secure Sign Up/Sign In with JWT and bcrypt
- **Role-Based Access Control** – Admin and Customer roles
- **Vehicle Management** – Create, update, delete, and list vehicles with duplicate prevention
- **Booking System** – Book vehicles with automatic cost calculation and expired booking returns
- **Global Error Handling** – Consistent API responses with validation errors

### Technology Stack
- **Node.js + TypeScript**
- **Express.js** | **PostgreSQL**
- **bcryptjs** | **jsonwebtoken** | **CORS & dotenv**

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js installed
- PostgreSQL database

### Steps
```bash
# Clone repository
git clone https://github.com/mashayeakh/B6-Assignment2.git
cd B6-Assignment2

# Install dependencies
npm install

# Set up .env file
# PORT=your_port
# CONNECTION_STR=your_postgresql_connection_string
# JWT_SECRET=your_jwt_secret_key

# Build and run
npm run build
npm run dev   # development
npm start     # production
```

> **Note:** Database tables are automatically created on first run.

---

## 🔗 API Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| **Auth** |
| POST | `/api/v1/auth/signup` | Public |
| POST | `/api/v1/auth/signin` | Public |
| **Users** |
| GET | `/api/v1/users/` | Admin |
| PUT | `/api/v1/users/:userId` | Admin/Customer |
| DELETE | `/api/v1/users/:userId` | Admin |
| **Vehicles** |
| POST | `/api/v1/vehicles/` | Admin |
| GET | `/api/v1/vehicles/` | Public |
| GET | `/api/v1/vehicles/:vehicleId` | Public |
| PUT | `/api/v1/vehicles/:vehicleId` | Admin |
| DELETE | `/api/v1/vehicles/:vehicleId` | Admin |
| **Bookings** |
| POST | `/api/v1/bookings/` | Admin/Customer |
| GET | `/api/v1/bookings/` | Admin/Customer |
| PUT | `/api/v1/bookings/:bookingId` | Admin/Customer |
| DELETE | `/api/v1/bookings/:bookingId` | Admin |

---

## 📁 Folder Structure

```
src/
 ├─ app/
 │   └─ auth/         # Authentication module
 ├─ modules/
 │   ├─ bookings/     # Booking module
 │   ├─ users/        # User module
 │   └─ vehicles/     # Vehicle module
 ├─ config/           # Database & environment
 ├─ middleware/       # Auth, validation, error handling
 └─ types/            # TypeScript definitions
dist/                 # Compiled files
```

---

## 📚 Resources

- **GitHub:** [mashayeakh/B6-Assignment2](https://github.com/mashayeakh/B6-Assignment2)
- **Live Demo:** [rentalsystem-lilac.vercel.app](https://rentalsystem-lilac.vercel.app/)

