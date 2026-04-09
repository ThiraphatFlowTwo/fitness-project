# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fitness management system for a sports college (วิทยาลัยการกีฬา มหาวิทยาลัยราชภัฏเลย). Manages users, exercises, academic years, and training programs with role-based access control.

## Tech Stack

**Backend:** Express.js + MongoDB (Mongoose ODM)
**Frontend:** React 19 + Vite + TailwindCSS + React Router

## Commands

### Backend (from `backend/` directory)
```bash
npm run dev    # Development with nodemon (hot reload)
npm start      # Production server
```
Server runs on port 5000 by default.

### Frontend (from `frontend/` directory)
```bash
npm run dev    # Development server (Vite)
npm run build  # Production build
npm run lint   # ESLint
```
Frontend runs on Vite dev server (default port 5173).

### Environment Setup
Backend requires `.env` file with:
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret
PORT=5000
```

## Architecture

### Backend Structure
```
backend/
├── server.js           # Entry point, route registration
├── config/db.js        # MongoDB connection
├── middleware/authMiddleware.js  # JWT auth + role guards
├── models/             # Mongoose schemas
│   ├── User.js         # Main user model (role-based)
│   ├── Instructor.js   # Instructor profile
│   ├── Trainer.js      # Trainer profile
│   ├── exercise.model.js
│   └── academicYear.model.js
├── controllers/        # Business logic
└── routes/             # Express routers
    ├── authRoutes.js   # /api/auth (register, login)
    ├── adminRoutes.js  # /api/admin (user management)
    ├── academicYear.routes.js
    ├── dashboard.routes.js
    └── exercise.routes.js
```

### Frontend Structure
```
frontend/src/
├── main.jsx            # Entry point
├── App.jsx             # Route definitions
├── services/api.js     # Axios instance (baseURL: http://localhost:5000/api)
├── components/
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx  # Auth guard with role checking
├── layouts/
│   └── InstructorLayout.jsx
└── pages/
    ├── Home.jsx, Login.jsx, Register.jsx  # Public
    ├── admin/           # Admin pages (protected)
    ├── instructor/      # Instructor pages (protected)
    └── trainer/        # Trainer pages (protected)
```

## User Roles & Access

| Role | Route Prefix | Access |
|------|-------------|--------|
| `admin` | `/admin` | Full user management, exercises, academic years |
| `instructor` | `/instructor` | Trainees, programs, profile |
| `trainer` | `/trainer` | Trainer dashboard |
| `trainee` | - | Basic user (pending approval) |

## Authentication Flow

1. User registers → `status: "pending"` (requires admin approval)
2. Admin approves → `status: "active"`
3. User logs in → receives JWT token
4. Frontend stores token in `localStorage`
5. Token sent via `Authorization: Bearer <token>` header
6. `ProtectedRoute` checks token + role before rendering

## API Endpoints

### Auth (`/api/auth`)
- `POST /register` - Create user (status: pending)
- `POST /login` - Authenticate, returns JWT

### Admin (`/api/admin`) - Requires admin role
- `GET /users` - List all users
- `POST /users` - Create user (auto-active)
- `PUT /users/:id` - Update user
- `PUT /users/:id/status` - Toggle status
- `PUT /users/:id/approve` - Approve pending user
- `DELETE /users/:id` - Delete user
- `GET /users/pending-count` - Count pending users

### Exercises (`/api/exercises`)
- CRUD operations for exercise data

### Academic Years (`/api/academic-years`)
- CRUD operations for academic periods

## Key Patterns

- **Controllers** handle business logic, routes are thin
- **JWT authentication** with role-based middleware (`protect`, `adminOnly`)
- **Frontend auth** uses `ProtectedRoute` component wrapping route elements
- **API instance** attaches Bearer token from localStorage via interceptor
- **User model** uses `status` field for approval workflow (`pending`/`active`/`inactive`)

## Database Models

### User
- `username`, `email`, `password`, `name`, `role`, `status`
- Roles: `admin`, `trainer`, `instructor`, `trainee`
- Statuses: `pending`, `active`, `inactive`