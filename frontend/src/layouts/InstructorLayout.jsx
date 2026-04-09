import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, FileText, User, LogOut, ChevronRight, Menu, X } from "lucide-react";
import { useState } from "react";

export default function InstructorLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    if (!confirm("ต้องการออกจากระบบใช่หรือไม่?")) return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    { path: "/instructor", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: "/instructor/trainees", label: "เทรนเนอร์", icon: <Users className="w-5 h-5" /> },
    { path: "/instructor/programs", label: "โปรแกรมฝึก", icon: <FileText className="w-5 h-5" /> },
    { path: "/instructor/profile", label: "โปรไฟล์อาจารย์", icon: <User className="w-5 h-5" /> },
  ];

  const isActive = (path) => {
    if (path === "/instructor") {
      return location.pathname === "/instructor";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-steel-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gradient-to-r from-navy-700 to-sky-600 text-white rounded-xl shadow-lg hover:scale-105 transition-all"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ===== Sidebar ===== */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-72 bg-gradient-to-b from-navy-900 via-navy-800 to-steel-900
          text-white shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center shadow-lg">
              <LayoutDashboard className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-white to-sky-200 bg-clip-text text-transparent">
                Instructor Panel
              </h2>
              <p className="text-xs text-steel-300">ระบบจัดการอาจารย์</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive: isActiveLink }) =>
                `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden ${
                  isActiveLink
                    ? "bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30"
                    : "text-navy-200 hover:bg-white/10 hover:text-navy-700"
                }`
              }
            >
              {/* Active indicator */}
              {isActive(item.path) && (
                <div className="absolute inset-0 bg-white/10 animate-pulse rounded-xl" />
              )}

              {/* Icon */}
              <span className={`relative z-10 transition-transform duration-200 group-hover:scale-110 ${isActive(item.path) ? "text-white" : "text-navy-400"}`}>
                {item.icon}
              </span>

              {/* Label */}
              <span className="relative z-10 flex-1 font-medium">
                {item.label}
              </span>

              {/* Arrow indicator */}
              <ChevronRight className={`relative z-10 w-4 h-4 ${isActive(item.path) ? "text-white" : "text-navy-400"} opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200`} />
            </NavLink>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 space-y-3 border-t border-white/10">
          {/* User Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-sky-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                {user?.name?.charAt(0) || "I"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">
                  {user?.name || "Instructor"}
                </p>
                <p className="text-xs text-navy-300">อาจารย์</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="
              w-full group relative overflow-hidden
              bg-gradient-to-r from-rose-500 to-rose-600
              hover:from-rose-600 hover:to-rose-700
              text-white py-3 rounded-xl
              font-semibold transition-all duration-200
              shadow-lg shadow-rose-500/30
              hover:shadow-xl hover:shadow-rose-500/40
              hover:scale-105
              flex items-center justify-center gap-2
            "
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <LogOut className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform duration-200" />
            <span className="relative z-10">ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="flex-1 overflow-auto lg:ml-0">
        {/* Top Bar (Mobile) */}
        <div className="lg:hidden h-16 bg-white/80 backdrop-blur-md border-b border-steel-200 flex items-center px-16">
          <h1 className="text-lg font-semibold bg-gradient-to-r from-navy-600 to-sky-600 bg-clip-text text-transparent">
            Instructor Dashboard
          </h1>
        </div>

        {/* Content Area */}
        <div className="min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
}