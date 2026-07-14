import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Public
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Trainer
import TrainerLayout from "./pages/trainer/TrainerLayout";
import TrainerDashboard from "./pages/trainer/TrainerDashboard";
import TrainerPrograms from "./pages/trainer/TrainerPrograms";
import TrainerTrainees from "./pages/trainer/TrainerTrainees";
import TrainerExercises from "./pages/trainer/TrainerExercises";
import TrainerResults from "./pages/trainer/TrainerResults";
import TrainerProgress from "./pages/trainer/TrainerProgress";
import TrainerProfile from "./pages/trainer/TrainerProfile";

// Instructor
import InstructorLayout from "./layouts/InstructorLayout";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import ManageTrainees from "./pages/instructor/ManageTrainees";
import ManagePrograms from "./pages/instructor/ManagePrograms";
import InstructorProfile from "./pages/instructor/InstructorProfile";
import TrainerDetail from "./pages/instructor/TrainerDetail";

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

        {/* ===== Route กลางสำหรับแยกหน้าตามสิทธิ์หลัง Loginสำเร็จ ===== */}
        {/* เมื่อเข้า /dashboard ตัวย่อยนี้จะเช็ค role แล้ว Redirect ไปหน้าของสิทธิ์นั้นอัตโนมัติ */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>
          } 
        />

        {/* ===== Trainer (เทรนเนอร์) ===== */}
        <Route
          path="/trainer"
          element={
            <ProtectedRoute role="trainer">
              <TrainerLayout />
            </ProtectedRoute>
          }
        >
          {/* เข้า /trainer จะแสดงหน้านี้ทันทีภายใต้ Layout */}
          <Route index element={<TrainerDashboard />} />
          <Route path="trainees" element={<TrainerTrainees />} />
          <Route path="programs" element={<TrainerPrograms />} />
          <Route path="exercises" element={<TrainerExercises />} />
          <Route path="results" element={<TrainerResults />} />
          <Route path="progress" element={<TrainerProgress />} />
          <Route path="profile" element={<TrainerProfile />} />
        </Route>

        {/* ===== Instructor (อาจารย์) ===== */}
        <Route
          path="/instructor"
          element={
            <ProtectedRoute role="instructor">
              <InstructorLayout />
            </ProtectedRoute>
          }
        >
          {/* เข้า /instructor จะแสดงหน้านี้ทันทีภายใต้ Layout */}
          <Route index element={<InstructorDashboard />} />
          <Route path="trainees" element={<ManageTrainees />} />
          <Route path="trainees/:trainerId" element={<TrainerDetail />} />
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

// ── ฟังก์ชันผู้ช่วยสลับหน้าแผงควบคุมกลางตามบทบาท (Dashboard Redirector) ──
function DashboardRedirect() {
  const savedUser = localStorage.getItem("user");
  if (!savedUser) return <Navigate to="/login" replace />;

  try {
    const user = JSON.parse(savedUser);
    
    // สลับหน้าทางแยกให้ตรงตาม Role ทันที
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (user.role === "instructor") {
      return <Navigate to="/instructor" replace />;
    } else if (user.role === "trainer") {
      return <Navigate to="/trainer" replace />;
    } else {
      // สำหรับสิทธิ์อื่นๆ หรือสิทธิ์ "pending" ที่ยังไม่ได้รับการอนุมัติ
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-lg font-sans">
            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">⚠️</div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">อยู่ระหว่างรอการอนุมัติสิทธิ์</h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              บัญชีของคุณอยู่ระหว่างรอผู้ดูแลระบบ (Admin) ตรวจสอบและอนุมัติสิทธิ์การใช้งานในระบบ
            </p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm transition-all"
            >
              กลับไปหน้าเข้าสู่ระบบ
            </button>
          </div>
        </div>
      );
    }
  } catch (error) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }
}

export default App;