import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Dumbbell,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    if (!confirm("ต้องการออกจากระบบใช่หรือไม่?")) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      path: "/admin/users",
      label: "จัดการผู้ใช้",
      icon: <Users className="w-5 h-5" />,
    },
    {
      path: "/admin/academic-year",
      label: "จัดการปีการศึกษา",
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      path: "/admin/exercises",
      label: "จัดการท่าออกกำลังกาย",
      icon: <Dumbbell className="w-5 h-5" />,
    },
  ];

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg hover:bg-slate-800 transition-colors"
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
          w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 
          text-white shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Admin Panel
              </h2>
              <p className="text-xs text-slate-400">ระบบจัดการ</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`
                group flex items-center gap-3 px-4 py-3 rounded-xl
                transition-all duration-200 relative overflow-hidden
                ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                }
              `}
            >
              {/* Active indicator */}
              {isActive(item.path) && (
                <div className="absolute inset-0 bg-white/10 animate-pulse rounded-xl" />
              )}

              {/* Icon */}
              <span
                className={`
                relative z-10 transition-transform duration-200
                ${isActive(item.path) ? "scale-110" : "group-hover:scale-110"}
              `}
              >
                {item.icon}
              </span>

              {/* Label */}
              <span className="relative z-10 flex-1 font-medium">
                {item.label}
              </span>

              {/* Arrow indicator */}
              <ChevronRight
                className={`
                  relative z-10 w-4 h-4 transition-all duration-200
                  ${
                    isActive(item.path)
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                  }
                `}
              />
            </Link>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 space-y-3 border-t border-slate-700/50">
          {/* User Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">
                  Admin User
                </p>
                <p className="text-xs text-slate-400">ผู้ดูแลระบบ</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="
              w-full group relative overflow-hidden
              bg-gradient-to-r from-red-600 to-red-700 
              hover:from-red-700 hover:to-red-800
              text-white py-3 rounded-xl 
              font-semibold transition-all duration-200
              shadow-lg shadow-red-500/30
              hover:shadow-xl hover:shadow-red-500/40
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
        <div className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center px-16">
          <h1 className="text-lg font-semibold text-slate-800">
            Admin Dashboard
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
