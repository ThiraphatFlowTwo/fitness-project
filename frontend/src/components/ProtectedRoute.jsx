import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // ยังไม่ login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // เช็ค role
  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}