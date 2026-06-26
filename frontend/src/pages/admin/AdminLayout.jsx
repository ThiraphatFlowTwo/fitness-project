import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Dumbbell,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Bell,
  Shield,
  Check,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

const menuItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/users", label: "จัดการผู้ใช้", icon: Users },
  { path: "/admin/academic-year", label: "จัดการปีการศึกษา", icon: Calendar },
  { path: "/admin/exercises", label: "จัดการท่าออกกำลังกาย", icon: Dumbbell },
];

const pageTitles = {
  "/admin": "Dashboard",
  "/admin/users": "จัดการผู้ใช้",
  "/admin/academic-year": "จัดการปีการศึกษา",
  "/admin/exercises": "จัดการท่าออกกำลังกาย",
};

const roleLabel = {
  admin: "ผู้ดูแลระบบ",
  trainer: "ผู้ฝึกสอน",
  instructor: "อาจารย์",
  trainee: "นักศึกษา",
};

const getInitials = (name = "") =>
  name.trim().split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "?";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  // 🔔 ส่วนจัดการระบบแจ้งเตือน (Notification State)
  const [notifications, setNotifications] = useState([]);
  const [notiOpen, setNotiOpen] = useState(false);
  const notiRef = useRef(null);

  // ✅ ดึงข้อมูล user จาก localStorage
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (err) {
        console.error("Parsing user data failed:", err);
      }
    }
  }, []);

  // 🔔 ดึงรายการแจ้งเตือนของ Admin จากหลังบ้าน
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error("ดึงข้อมูลการแจ้งเตือนแอดมินผิดพลาด:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // ทำ Polling คอยวิ่งตรวจเช็คการแจ้งเตือนใหม่เงียบๆ ทุก 30 วินาที
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // 🔔 ฟังก์ชันกดเปลี่ยนสถานะเป็นอ่านแจ้งเตือนแล้ว
  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/notifications/${id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // อัปเดตสถานะในตัวแปร state บนหน้าจอทันที ไม่ต้องโหลดใหม่
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("ปรับสถานะการอ่านแจ้งเตือนผิดพลาด:", err);
    }
  };

  // 🔔 ฟังก์ชันเมื่อ "คลิกที่ตัวแจ้งเตือน" -> มาร์กอ่านทันที + ลิงก์ไปยังหน้านั้นๆ + ปิดหน้าต่างแจ้งเตือน
  const handleNotificationClick = async (noti) => {
    // 1. ถ้ายังไม่ได้อ่าน ให้ยิง API ไปเปลี่ยนสถานะเป็นอ่านแล้ว
    if (!noti.isRead) {
      await handleMarkAsRead(noti._id);
    }
    // 2. ปิดกล่องแจ้งเตือน
    setNotiOpen(false);
    // 3. ไปยังเส้นทาง Link บนเว็บที่แนบมาจากหลังบ้าน (ถ้ามีส่งมา เช่น "/admin/users" หรือ "/admin")
    if (noti.url) {
      navigate(noti.url);
    }
  };

  // ดักจับเหตุการณ์คลิกนอกพื้นที่ของกล่องกระดิ่งแจ้งเตือน ให้ทำการหุบเก็บออโต้
  useEffect(() => {
    function handleClickOutside(event) {
      if (notiRef.current && !notiRef.current.contains(event.target)) {
        setNotiOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // นับจำนวนรายการที่ยังไม่ได้เปิดอ่าน
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const isActive = (path) =>
    path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(path);

  const currentTitle = pageTitles[location.pathname] ?? "Admin Panel";

  const handleLogout = () => {
    if (!confirm("ต้องการออกจากระบบใช่หรือไม่?")) return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        style={{
          background: "linear-gradient(160deg, #0B1F3A 0%, #1E293B 50%, #0EA5E9 100%)",
        }}
        className={`
          flex-shrink-0 flex flex-col h-full shadow-2xl transition-all duration-300
          ${sidebarOpen ? (collapsed ? "w-20" : "w-64") : "w-0 overflow-hidden"}
        `}
      >
        {/* Logo */}
        <div
          className={`flex items-center gap-3 px-5 py-5 border-b border-white/10 ${collapsed ? "justify-center px-0" : ""}`}
        >
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0 shadow-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="font-bold text-white text-sm leading-tight">Admin Panel</p>
              <p className="text-slate-300 text-xs truncate">ม.ราชภัฏเลย</p>
            </div>
          )}
        </div>

        {/* User Card */}
        {!collapsed && (
          <div className="mx-4 mt-5 mb-2 rounded-2xl bg-white/10 border border-white/15 p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-indigo-400 flex items-center justify-center shrink-0 shadow">
              <span className="text-white text-sm font-bold">
                {getInitials(user?.name)}
              </span>
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-sm font-semibold truncate">
                {user?.name ?? "..."}
              </p>
              <p className="text-slate-300 text-xs">
                {roleLabel[user?.role] ?? user?.role ?? "..."}
              </p>
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
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 group
                  ${collapsed ? "justify-center" : ""}
                  ${active ? "bg-white text-sky-700 shadow-lg" : "text-slate-200 hover:bg-white/10 hover:text-white"}
                `}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform duration-200 ${active ? "scale-110" : "group-hover:scale-105"}`}
                />
                {!collapsed && <span className="truncate">{label}</span>}
                {!collapsed && active && (
                  <ChevronRight className="w-4 h-4 ml-auto shrink-0 text-violet-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-5 space-y-2 border-t border-white/10 pt-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300
                        hover:bg-white/10 hover:text-white transition-all ${collapsed ? "justify-center" : ""}`}
          >
            <Menu className="w-5 h-5 shrink-0" />
            {!collapsed && <span>ย่อเมนู</span>}
          </button>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                        bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white
                        transition-all duration-200 ${collapsed ? "justify-center" : ""}`}
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
                {sidebarOpen ? (
                  <X className="w-5 h-5 text-slate-600" />
                ) : (
                  <Menu className="w-5 h-5 text-slate-600" />
                )}
              </button>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">Admin</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                <span className="text-slate-800 font-semibold text-sm">
                  {currentTitle}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-semibold text-slate-700">
                  ปีการศึกษา 2568
                </span>
                <span className="text-xs text-slate-400">ภาคเรียนที่ 1</span>
              </div>

              {/* 🔔 ส่วนกระดิ่งแจ้งเตือน Dropdown List ของ Admin */}
              <div className="relative" ref={notiRef}>
                <button
                  onClick={() => setNotiOpen(!notiOpen)}
                  className={`relative p-2 rounded-xl transition-colors ${notiOpen ? "bg-slate-100" : "hover:bg-slate-100"}`}
                >
                  <Bell className="w-5 h-5 text-slate-600" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold 
                                    rounded-full flex items-center justify-center leading-none animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* กล่องรายการ Notification Dropdown */}
                {notiOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                      <span className="font-semibold text-slate-700 text-sm">การแจ้งเตือน</span>
                      {unreadCount > 0 && (
                        <span className="text-xs bg-red-100 text-red-600 font-medium px-2 py-0.5 rounded-full">
                          ใหม่ {unreadCount} รายการ
                        </span>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 text-sm">
                          ไม่มีข้อความแจ้งเตือนในขณะนี้
                        </div>
                      ) : (
                        notifications.map((noti) => (
                          <div
                            key={noti._id}
                            onClick={() => handleNotificationClick(noti)} // 👈 คลิกที่กล่องจะทำฟังก์ชันคลิกไปที่หน้าเว็บทันที
                            className={`p-3.5 transition-colors relative group flex gap-2.5 items-start cursor-pointer
                              ${!noti.isRead ? "bg-indigo-50/50 hover:bg-indigo-100/70" : "hover:bg-slate-50"}`}
                          >
                            {/* สีแถบสัญลักษณ์ข้างหน้าแยกตามประเภทแจ้งเตือน */}
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 mt-1.5
                              ${noti.type === "success" ? "bg-green-500" : noti.type === "warning" ? "bg-amber-500" : "bg-indigo-500"}`}
                            />

                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-semibold text-slate-800 truncate ${!noti.isRead ? "text-indigo-900" : ""}`}>
                                {noti.title}
                              </p>
                              <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                                {noti.message}
                              </p>
                              
                              {/* 👤 แสดงข้อมูล User ต้นเรื่อง (ถ้าถูกส่งมาจาก Backend ใน Object 'senderId' หรือ 'senderName') */}
                              {noti.senderId && (
                                <span className="inline-block mt-1 text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                                  โดย: {noti.senderId.name || "ไม่ระบุชื่อ"} ({roleLabel[noti.senderId.role] || noti.senderId.role})
                                </span>
                              )}

                              <span className="text-[10px] text-slate-400 block mt-1">
                                {new Date(noti.created_at).toLocaleDateString("th-TH", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>

                            {/* ปุ่มไอคอนทำเครื่องหมายว่าอ่านแล้วเฉยๆ โดยไม่อยากกดเข้าไปดูหน้าเว็บ */}
                            {!noti.isRead && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // ป้องกันไม่ให้ส่งผลต่อการเปลี่ยนหน้าเว็บบนกล่องใหญ่
                                  handleMarkAsRead(noti._id);
                                }}
                                title="ทำเป็นอ่านแล้ว"
                                className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-100/60 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Card */}
              <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow">
                  {getInitials(user?.name)}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-slate-800 leading-tight">
                    {user?.name ?? "..."}
                  </p>
                  <p className="text-xs text-slate-400">
                    {roleLabel[user?.role] ?? user?.role ?? "..."}
                  </p>
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