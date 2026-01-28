import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Trainer
import TrainerDashboard from "./pages/trainer/TrainerDashboard";

// Instructor
import InstructorDashboard from "./pages/instructor/InstructorDashboard";

// Admin
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageAcademicYear from "./pages/admin/ManageAcademicYear";
import ManageExercises from "./pages/admin/ManageExercises";

// Auth
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== Public ===== */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ===== Trainer ===== */}
        <Route
          path="/trainer/dashboard"
          element={
            <ProtectedRoute role="trainer">
              <TrainerDashboard />
            </ProtectedRoute>
          }
        />

        {/* ===== Instructor ===== */}
        <Route
          path="/instructor/dashboard"
          element={
            <ProtectedRoute role="instructor">
              <InstructorDashboard />
            </ProtectedRoute>
          }
        />

        {/* ===== Admin (Nested Routes) ===== */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* /admin */}
          <Route index element={<AdminDashboard />} />

          {/* /admin/users */}
          <Route path="users" element={<ManageUsers />} />

          {/* ✅ /admin/academic-year */}
          <Route path="academic-year" element={<ManageAcademicYear />} />

          <Route path="/admin/exercises" element={<ManageExercises />} />

        </Route>

        {/* ===== Fallback ===== */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
