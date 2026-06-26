import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, FileText, User,
  LogOut, ChevronRight, Menu, X, Bell, GraduationCap, BarChart2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTopbarData } from "../hooks/useTopbarData";
import NotificationDropdown from "../components/ui/NotificationDropdown";

const menuItems = [
  { path: "/instructor",          label: "Dashboard",      icon: LayoutDashboard },
  { path: "/instructor/trainees", label: "เทรนเนอร์",      icon: Users           },
  { path: "/instructor/programs", label: "โปรแกรมฝึก",     icon: FileText        },
  { path: "/instructor/logs",     label: "ผลการฝึก",       icon: BarChart2       },
  { path: "/instructor/profile",  label: "โปรไฟล์อาจารย์", icon: User            },
];

const pageTitles = {
  "/instructor": "Dashboard",
  "/instructor/trainees": "เทรนเนอร์",
  "/instructor/programs": "โปรแกรมฝึก",
  "/instructor/logs":     "ผลการฝึก",
  "/instructor/profile":  "โปรไฟล์อาจารย์",
};

const getInitials = (name = "") =>
  name
    .trim()
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

export default function InstructorLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [collapsed,   setCollapsed]   = useState(false);
  const [user,        setUser]        = useState(null);
  const { activeYear, notifCount, notifList, markAllRead, markRead } = useTopbarData("instructor");

  // กำหนด Base URL ไว้ที่เดียวเพื่อความง่ายในการดูแลจัดการ
  const API_BASE = "http://localhost:5000"; 

  // 🔔 1. ดึงข้อมูลผู้ใช้และตั้ง Polling สำหรับแจ้งเตือนอัตโนมัติทุกๆ 30 วินาที
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        /* ignore */
      }
    }
    
    fetchNotifications();
    // ดึงซ้ำอัตโนมัติเผื่อมีเทรนเนอร์กดส่งงานใหม่เข้ามาในขณะที่อาจารย์เปิดหน้านี้อยู่
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (path) =>
    path === "/instructor"
      ? location.pathname === "/instructor"
      : location.pathname.startsWith(path);

  const currentTitle = (() => {
    if (pageTitles[location.pathname]) return pageTitles[location.pathname];
    if (location.pathname.startsWith("/instructor/trainees/"))
      return "รายละเอียดเทรนเนอร์";
    return "Instructor Panel";
  })();

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(`${API_BASE}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE}/api/notifications/${id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      
      setNotifications((prev) =>
        prev.map((noti) =>
          noti._id === id ? { ...noti, isRead: true } : noti,
        ),
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // ➕ 2. เพิ่มฟังก์ชันเมื่อคลิกที่ตัวกล่องข้อความแจ้งเตือน ให้เคลียร์สถานะอ่านแล้ว และเด้งไปหน้านั้นทันที
  const handleNotificationClick = async (noti) => {
    console.log("🔍 ตรวจสอบข้อมูล Notification ที่กด:", noti);
    if (!noti.isRead) {
      await handleMarkAsRead(noti._id);
    }
    setNotiOpen(false); // ปิด Dropdown
    if (noti.url) {
      if (noti.url === "/admin" || noti.url.startsWith("/trainer")) {
      navigate("/instructor/programs"); // ➕ เปลี่ยนเส้นทางไปยังหน้าโปรแกรมฝึกซ้อมของอาจารย์
      } else {
      navigate(noti.url); // ลิงก์ไปยังหน้าเป้าหมาย เช่น /instructor/programs
      }
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleLogout = () => {
    if (!confirm("ต้องการออกจากระบบใช่หรือไม่?")) return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        style={{
          background:
            "linear-gradient(160deg, #0B1F3A 0%, #1E293B 50%, #0EA5E9 100%)",
        }}
        className={`flex-shrink-0 flex flex-col h-full shadow-2xl transition-all duration-300 ${
          sidebarOpen ? (collapsed ? "w-20" : "w-64") : "w-0 overflow-hidden"
        }`}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-5 py-5 border-b border-white/10 ${collapsed ? "justify-center px-0" : ""}`}>
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0 shadow-lg">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="font-bold text-white text-sm leading-tight">Instructor Panel</p>
              <p className="text-slate-300 text-xs truncate">ม.ราชภัฏเลย</p>
            </div>
          )}
        </div>

        {/* User Card */}
        {!collapsed && (
          <div className="mx-4 mt-5 mb-2 rounded-2xl bg-white/10 border border-white/15 p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-400 flex items-center justify-center shrink-0 shadow">
              <span className="text-white text-sm font-bold">{getInitials(user?.name)}</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-sm font-semibold truncate">{user?.name ?? "..."}</p>
              <p className="text-slate-300 text-xs">อาจารย์</p>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {menuItems.map(({ path, label, icon: Icon }) => {
            const active = isActive(path);
            return (
              <button
                key={path}
                onClick={() => {
                  navigate(path);
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                title={collapsed ? label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  collapsed ? "justify-center" : ""
                } ${active ? "bg-white text-sky-700 shadow-lg" : "text-slate-200 hover:bg-white/10 hover:text-white"}`}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-transform duration-200 ${active ? "scale-110" : "group-hover:scale-105"}`} />
                {!collapsed && <span className="truncate">{label}</span>}
                {!collapsed && active && <ChevronRight className="w-4 h-4 ml-auto shrink-0 text-sky-400" />}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-5 space-y-2 border-t border-white/10 pt-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-sky-200 hover:bg-white/10 hover:text-white transition-all ${collapsed ? "justify-center" : ""}`}
          >
            <Menu className="w-5 h-5 shrink-0" />
            {!collapsed && <span>ย่อเมนู</span>}
          </button>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white transition-all duration-200 ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>ออกจากระบบ</span>}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 shadow-sm z-10">
          <div className="px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
              </button>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">Instructor</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                {location.pathname.startsWith("/instructor/trainees/") ? (
                  <>
                    <button
                      onClick={() => navigate("/instructor/trainees")}
                      className="text-slate-400 text-sm hover:text-blue-600 transition-colors"
                    >
                      เทรนเนอร์
                    </button>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                    <span className="text-slate-800 font-semibold text-sm">รายละเอียดเทรนเนอร์</span>
                  </>
                ) : (
                  <span className="text-slate-800 font-semibold text-sm">{currentTitle}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-semibold text-slate-700">
                  {activeYear ? `ปีการศึกษา ${activeYear.academic_year}` : "ไม่มีปีการศึกษา"}
                </span>
                <span className="text-xs text-slate-400">
                  {activeYear ? `ภาคเรียนที่ ${activeYear.semester}` : "ที่เปิดใช้งาน"}
                </span>
              </div>
              <NotificationDropdown
                notifCount={notifCount}
                notifList={notifList}
                markAllRead={markAllRead}
                markRead={markRead}
              />
              <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow">
                  {getInitials(user?.name)}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-slate-800 leading-tight">{user?.name ?? "..."}</p>
                  <p className="text-xs text-slate-400">อาจารย์</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}