import { Navigate } from "react-router-dom";

function parseUser() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw || raw === "undefined" || raw === "null") return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true; 
  }
}

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const user  = parseUser();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isTokenExpired(token)) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  // 🛡️ ถ้า Role ที่ต้องการเข้างาน ไม่ตรงกับสิทธิ์ของผู้ใช้คนนี้
  if (role && user.role !== role) {
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "instructor") return <Navigate to="/instructor" replace />;
    if (user.role === "trainer") return <Navigate to="/trainer" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
}