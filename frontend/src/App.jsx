import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Trainer
import TrainerDashboard from "./pages/trainer/TrainerDashboard";

// Instructor
import InstructorLayout from "./layouts/InstructorLayout";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import ManageTrainees from "./pages/instructor/ManageTrainees";
import ManagePrograms from "./pages/instructor/ManagePrograms";
import InstructorProfile from "./pages/instructor/InstructorProfile";

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

        {/* ===== Trainer (เทรนเนอร์) ===== */}
        <Route
          path="/trainer"
          element={
            <ProtectedRoute role="trainer">
              <TrainerDashboard />
            </ProtectedRoute>
          }
        />

        {/* ===== Instructor (อาจารย์) ===== */}
        <Route
          path="/instructor"
          element={
            <ProtectedRoute role="instructor">
              <InstructorLayout />
            </ProtectedRoute>
          }
        >
          {/* /instructor */}
          <Route index element={<InstructorDashboard />} />
          <Route path="trainees" element={<ManageTrainees />} />
          <Route path="programs" element={<ManagePrograms />} />
          <Route path="profile" element={<InstructorProfile />} />
        </Route>

        {/* ===== Admin ===== */}
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
          <Route path="users" element={<ManageUsers />} />
          <Route path="academic-year" element={<ManageAcademicYear />} />
          <Route path="exercises" element={<ManageExercises />} />
        </Route>

        {/* ===== Fallback ===== */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
