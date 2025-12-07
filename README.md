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
git clone https://github.com/mashayeakh/B6-Assignment2.git
cd B6-Assignment2
npm install
npm run build
npm run dev
```

> **Note:** Configure `.env` with `PORT`, `CONNECTION_STR`, and `JWT_SECRET`. Database tables are auto-created on first run.

---

## 🔗 API Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/v1/auth/signup` | Public |
| POST | `/api/v1/auth/signin` | Public |
| GET | `/api/v1/users/` | Admin |
| POST | `/api/v1/vehicles/` | Admin |
| GET | `/api/v1/vehicles/` | Public |
| POST | `/api/v1/bookings/` | Admin/Customer |

---

## 📁 Folder Structure

```
src/
 ├─ app/auth/
 ├─ modules/
 │   ├─ bookings/
 │   ├─ users/
 │   └─ vehicles/
 ├─ config/
 ├─ middleware/
 └─ types/
dist/
```

---

## 📚 Resources

- **GitHub:** [B6-Assignment2](https://github.com/mashayeakh/B6-Assignment2)
- **Live Demo:** [rentalsystem-lilac.vercel.app](https://rentalsystem-lilac.vercel.app/)

_Developed by Md Masyeakh Islam Prodhan_
