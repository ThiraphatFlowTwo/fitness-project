import { Navigate } from "react-router-dom";

function parseUser() {
  try {
    const raw = localStorage.getItem("user");
    // ✅ ป้องกัน JSON.parse crash
    if (!raw || raw === "undefined" || raw === "null") return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  try {
    // ✅ decode payload โดยไม่ต้องใช้ library
    const payload = JSON.parse(atob(token.split(".")[1]));
    // exp คือ Unix timestamp หน่วยวินาที
    return payload.exp * 1000 < Date.now();
  } catch {
    return true; // ถ้า decode ไม่ได้ถือว่า expired
  }
}

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const user  = parseUser();

  // ✅ ไม่มี token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ token หมดอายุ — ล้าง localStorage แล้ว redirect
  if (isTokenExpired(token)) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  // ✅ user ข้อมูลเสียหาย
  if (!user) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  // ✅ เช็ค role
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}