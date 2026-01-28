import { Outlet, Link, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (!confirm("ต้องการออกจากระบบใช่หรือไม่?")) return;

    // ลบ token และ user
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // กลับไปหน้า login
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* ===== Sidebar ===== */}
      <aside className="w-64 bg-slate-900 text-white p-4 flex flex-col">
        <div>
          <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

          <Link
            to="/admin"
            className="block px-4 py-2 rounded hover:bg-slate-700"
          >
            Dashboard
          </Link>

          <Link
            to="/admin/users"
            className="block px-4 py-2 rounded hover:bg-slate-700"
          >
            จัดการผู้ใช้
          </Link>

          <Link
            to="/admin/academic-year"
            className="block px-4 py-2 rounded hover:bg-slate-700"
          >
            จัดการปีการศึกษา
          </Link>
        </div>

        {/* ===== Logout Button ===== */}
        <div className="mt-auto pt-6 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition"
          >
            ออกจากระบบ (Logout)
          </button>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}