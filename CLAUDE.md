# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

## Project Overview

**Fitness Management System** - ระบบจัดการข้อมูลเทรนเนอร์สำหรับคณะวิทยาศาสตร์และเทคโนโลยีมหาวิทยาลัยราชภัฏเลย (Sports College)

Web application for managing users, exercises, academic years, and training programs with role-based access control.

## Tech Stack

**Frontend:**
- React 19 + Vite
- TailwindCSS (with custom design system)
- React Router
- Axios for API calls
- Lucide React for icons
- Recharts for data visualization

**Backend:**
- Express.js
- MongoDB (Mongoose ODM)
- JWT Authentication
- Node.js runtime

## Commands

### Backend (from `backend/` directory)
```bash
npm run dev        # Development with hot reload (nodemon)
npm start          # Production server
npm test           # Run tests (currently placeholder)
```

### Frontend (from `frontend/` directory)
```bash
npm run dev        # Development server (Vite, default port 5173)
npm run build      # Production build
npm run lint       # ESLint for JavaScript/React code
```

### Installation
```bash
# Clone repository
git clone <repository-url>
cd fitness-project

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd frontend
npm install

# Setup environment
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start development servers
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend (new terminal)
cd frontend && npm run dev
```

## Project Structure

```
fitness-project/
├── backend/
│   ├── server.js              # Express app entry point
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── authMiddleware.js # JWT auth + role guards
│   ├── models/
│   │   ├── User.js             # Main user model
│   │   ├── Instructor.js       # Instructor profile
│   │   ├── Trainer.js          # Trainer profile
│   │   ├── exercise.model.js
│   │   └── academicYear.model.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── dashboard.controller.js
│   │   ├── exercise.controller.js
│   │   └── academicYear.controller.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── academicYear.routes.js
│   │   ├── dashboard.routes.js
│   │   └── exercise.routes.js
│   └── .env                 # Environment variables
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js          # Custom color system
    ├── package.json
    └── src/
        ├── main.jsx              # React entry point
        ├── App.jsx               # Route definitions
        ├── services/
        │   └── api.js           # Axios instance with Bearer token interceptor
        ├── components/
        │   ├── ui/              # Reusable UI component library
        │   │   ├── navigation/   # Sidebar, Topbar
        │   │   ├── cards/        # StatCard, InfoCard, SectionCard, QuickAction, ActivityItem, StatusItem
        │   │   ├── forms/        # Input, Select, TextArea, Checkbox, FormField
        │   │   ├── feedback/     # Alert, Loading
        │   │   ├── data-display/ # Avatar, Badge, Table
        │   │   ├── layout/       # Container, Section, PageContainer
        │   │   └── shared/      # Logo, Divider
        ├── layouts/
        │   ├── InstructorLayout.jsx
        │   ├── AdminLayout.jsx
        │   └── TrainerLayout.jsx
        └── pages/
            ├── Home.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── admin/
            │   ├── AdminDashboard.jsx
            │   ├── ManageUsers.jsx
            │   ├── ManageAcademicYear.jsx
            │   └── ManageExercises.jsx
            ├── instructor/
            │   ├── InstructorDashboard.jsx
            │   ├── InstructorProfile.jsx
            │   ├── ManagePrograms.jsx
            │   └── ManageTrainees.jsx
            └── trainer/
                ├── TrainerDashboard.jsx
                ├── TrainerExercises.jsx
                ├── TrainerProfile.jsx
                ├── TrainerPrograms.jsx
                ├── TrainerProgress.jsx
                ├── TrainerResults.jsx
                ├── TrainerTrainees.jsx
                └── TrainerLayout.jsx
```

## Design System

The project uses a consistent Tailwind design system defined in `tailwind.config.js`.

**Color Palette:**
- **Primary:** Deep Navy Blue (navy-900 to navy-950) - For headings, primary buttons, navigation
- **Secondary:** Steel Grey (steel-50 to steel-900) - For backgrounds, secondary text
- **Accent:** Sky Blue (sky-500 to sky-900) - For active states, highlights, links
- **Success:** Emerald (emerald-500 to emerald-600) - For success indicators
- **Warning:** Yellow (yellow-500) - For warnings
- **Error:** Red (red-500) - For errors, danger actions

**Component Patterns:**
- Cards: White background (`bg-white`), rounded-2xl (`rounded-2xl`), border-gray-200, shadow-sm hover:shadow-md, hover:-translate-y-1
- Buttons: Navy gradient backgrounds (`from-navy-900 to-navy-800`), rounded-xl, shadow-md hover:shadow-lg, hover:scale-105
- Forms: Gray backgrounds (`bg-gray-50`), navy borders on focus (`focus:ring-2 focus:ring-sky-500`)
- Navigation: Clear active states (`bg-navy-100 text-navy-900`), subtle hover (`hover:bg-gray-100`)

**Typography Hierarchy:**
- Headings: text-navy-900 font-semibold (2xl, 3xl, 4xl)
- Body: text-gray-600
- Labels: text-gray-500
- Links: text-sky-600

**Spacing Standards:**
- Page padding: p-4 sm:p-6 lg:p-8
- Section spacing: gap-6
- Grid gaps: gap-4 sm:grid-cols-2 lg:grid-cols-4
- Card padding: p-6

## Component Library

**Reusable Components** (located in `frontend/src/components/ui/`)

**Layout Components:**
- `PageContainer` - Consistent page wrapper with spacing
- `Container` - Content container with max-width
- `Section` - Section wrapper for consistent spacing

**Card Components:**
- `StatCard` - Statistics display with icon, value, title
- `InfoCard` - Information display with icon, title, description
- `SectionCard` - Section card with optional header, border accent
- `QuickAction` - Action card with hover gradient effect
- `ActivityItem` - Activity feed item with icon, title, description, time
- `StatusItem` - Status display with icon, label, status value

**Form Components:**
- `Input` - Text input with icon, label, focus states
- `Select` - Dropdown with icon, label, focus states
- `TextArea` - Multi-line text area
- `Checkbox` - Checkbox with custom styling
- `FormField` - Form field wrapper with error display

**Navigation Components:**
- `Sidebar` - Unified sidebar navigation (used in AdminLayout)
- `Topbar` - Header navigation bar (used in pages)

**Feedback Components:**
- `Alert` - Success/warning/error alerts
- `Loading` - Loading spinner animation

**Data Display Components:**
- `Avatar` - User avatar with gradient background
- `Badge` - Status badges
- `Table` - Data table with consistent styling

**Button Components:**
- `PrimaryButton` - Navy gradient primary action button
- `SecondaryButton` - Gray outline secondary button
- `DangerButton` - Red danger action button
- `IconButton` - Icon-only button with hover effect

## Architecture Patterns

**Authentication Flow:**
1. User registers → status: "pending" (requires admin approval)
2. Admin approves → status: "active"
3. User logs in → receives JWT token
4. Token stored in localStorage
5. ProtectedRoute checks token + role before rendering

**Route Structure:**
- `/` - Home page (public)
- `/login` - Login page (public)
- `/register` - Register page (public)
- `/admin/*` - Admin routes (protected, admin role)
- `/instructor/*` - Instructor routes (protected, instructor role)
- `/trainer/*` - Trainer routes (protected, trainer role)
- `ProtectedRoute` component wraps routes requiring authentication

**API Service:**
- Located in `frontend/src/services/api.js`
- Axios instance with Bearer token interceptor
- Automatically attaches token from localStorage to all requests
- Base URL configured (typically localhost:5000 in development)

**Middleware:**
- `protect` - Verifies JWT token, adds `req.user` to request
- `adminOnly` - Checks if `req.user.role === "admin"`
- Applied as route guards: `router.get('/admin/users', protect, adminOnly, handler)`

## Key Files

**Configuration:**
- `frontend/tailwind.config.js` - Custom color system (navy, steel, sky scales)
- `frontend/vite.config.js` - Build tool configuration
- `backend/.env` - Environment variables (MONGO_URI, JWT_SECRET, PORT)
- `frontend/src/services/api.js` - Axios instance with token management

**Data Models:**
- `backend/models/User.js` - Main user with roles (admin, trainer, instructor, trainee)
- `backend/models/Instructor.js` - Instructor profile extension
- `backend/models/Trainer.js` - Trainer profile extension
- Profile models auto-created on registration based on user role

**Entry Points:**
- `backend/server.js` - Express app, route registration
- `frontend/src/main.jsx` - React root, creates App, mounts to #root
- `frontend/src/App.jsx` - Route configuration with ProtectedRoute wrapper

## Development Guidelines

**When Adding Features:**
1. Check if reusable component exists in `frontend/src/components/ui/`
2. Use design system colors (navy, steel, sky, emerald)
3. Follow spacing standards (gap-6 for sections, p-6 for cards)
4. Use proper contrast for accessibility (text-gray-600 on light backgrounds)
5. Add focus states to all interactive elements (`focus:ring-2 focus:ring-sky-500`)

**When Modifying Components:**
1. Maintain consistency with existing components
2. Use shared components from UI library when possible
3. Do not duplicate component logic - extract to shared components
4. Keep existing functionality intact - only update styling

**File Organization:**
- Keep component structure flat - use index files for imports
- Group related components in subdirectories (cards/, forms/, etc.)
- Maintain clear separation between UI components and page-specific components

## Testing

**Backend:** Currently has placeholder test command (`npm test` exits with error)
**Frontend:** ESLint configured (`npm run lint`)

**Manual Testing:**
- Test authentication flow (register → approve → login → access routes)
- Test role-based access (admin can access /admin/*, etc.)
- Test API endpoints independently (curl or Postman)
- Verify token storage and retrieval

## Common Patterns

**Creating New Dashboard Pages:**
1. Import PageContainer wrapper
2. Add header with title and description
3. Use StatCard components for metrics
4. Use SectionCard for main content areas
5. Apply consistent spacing and colors throughout
6. Use lucide-react icons with consistent sizes (w-5 h-5, w-6 h-6)

**Creating Management Pages:**
1. Use PageContainer for page layout
2. Use SectionCard for content organization
3. Implement proper form validation with error display
4. Use consistent button styling (PrimaryButton, DangerButton)
5. Add loading states with Loading component
6. Use appropriate icons from lucide-react

**API Integration:**
- Import api from `services/api.js`
- Use await for async operations
- Handle errors with try/catch blocks
- Display user-friendly error messages (alerts or console logs)

## Important Notes

**Token Management:**
- JWT tokens stored in `localStorage` with key "token"
- User data stored as JSON string with key "user"
- Token expires - implement refresh logic if needed
- Logout clears both token and user from localStorage

**Role-Based Access:**
- ProtectedRoute checks user role from stored user data
- Roles: admin, trainer, instructor, trainee
- New users start with status "pending" (require approval)
- Admins can approve pending users via API

**Status Management:**
- User status can be: pending, active, inactive
- Status affects login (only active users can log in)
- Admins can change user status via API endpoints

## Database

**MongoDB Connection:**
- Mongoose ODM for schema management and validation
- Connection string configured in .env file
- Use environment variables for sensitive data (never hardcode)

**Collections:**
- `users` - Main user collection with role field
- `instructors` - Instructor profiles
- `trainers` - Trainer profiles
- `academic_years` - Academic year management
- `exercises` - Exercise library

## Build & Deployment

**Development:**
```bash
# Backend
cd backend && npm install && npm run dev

# Frontend
cd frontend && npm install && npm run dev
```

**Production:**
```bash
# Backend
cd backend && npm install && npm start

# Frontend
cd frontend && npm run build && npm start # or deploy to your hosting
```

## Git Workflow

This project uses Git for version control.

**Branches:**
- `main` - Primary development branch
- Feature branches should follow pattern: `feature/description`
- Hotfix branches: `hotfix/description`

**Commits:**
- Use conventional commits: `type(scope): description`
- Types: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`
- Examples:
  - `feat(admin): add user management page`
  - `fix(dashboard): resolve API timeout issue`
  - `refactor(ui): extract card components to shared library`

## Documentation

**Design System Guide:** `DESIGN_SYSTEM_GUIDE.md` - Complete color palette and component usage patterns
**Refactoring Summary:** `DESIGN_SYSTEM_SUMMARY.md` - Summary of UI/UX improvements made

## Key Dependencies

**Frontend:**
```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0",
    "lucide-react": "^0.263.0",
    "recharts": "^2.8.0"
  }
}
```

**Backend:**
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "mongoose": "^7.0.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.0",
    "dotenv": "^16.0.0"
  }
}
```

## Environment Variables

Create `.env` file in `backend/` directory:

```env
MONGO_URI=mongodb+srv://<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret-key>
PORT=5000
```

**Security:**
- Never commit `.env` file to version control
- Add `.env.example` with placeholder values
- Use strong JWT secrets in production
- Implement rate limiting for API routes
- Validate all user inputs
- Use HTTPS in production
