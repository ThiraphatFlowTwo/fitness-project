import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios"; // ➕ เพิ่ม axios สำหรับดึงข้อมูลแจ้งเตือน
import {
<<<<<<< HEAD
  Home,
  Users,
  ClipboardList,
  Dumbbell,
  Edit,
  TrendingUp,
  User,
  LogOut,
  Bell,
  Menu,
  X,
  ChevronRight,
  Check,
} from "lucide-react";
=======
  Home, Users, ClipboardList, Dumbbell,
  Edit, TrendingUp, User, LogOut,
  Bell, Menu, X, ChevronRight, Scale
} from 'lucide-react';
import { useTopbarData } from '../../hooks/useTopbarData';
import NotificationDropdown from '../../components/ui/NotificationDropdown';
>>>>>>> 4df110b1cf6b54998519fb5a0c4e4f330717be2f

const menuItems = [
  { id: "dashboard", label: "หน้าหลัก", icon: Home, path: "/trainer" },
  {
    id: "trainees",
    label: "จัดการผู้รับการฝึก",
    icon: Users,
    path: "/trainer/trainees",
  },
  {
    id: "programs",
    label: "โปรแกรมการฝึก",
    icon: ClipboardList,
    path: "/trainer/programs",
  },
  {
    id: "exercises",
    label: "ท่าในการฝึก",
    icon: Dumbbell,
    path: "/trainer/exercises",
  },
  {
    id: "results",
    label: "บันทึกการฝึกรายวัน",
    icon: Edit,
    path: "/trainer/results",
  },
  {
    id: "progress",
    label: "พัฒนาการ (กราฟ)",
    icon: TrendingUp,
    path: "/trainer/progress",
  },
  {
    id: "profile",
    label: "โปรไฟล์ส่วนตัว",
    icon: User,
    path: "/trainer/profile",
  },
];

const pageTitles = {
  "/trainer": { th: "หน้าหลัก", en: "Dashboard" },
  "/trainer/trainees": { th: "จัดการผู้รับการฝึก", en: "Trainees" },
  "/trainer/programs": { th: "โปรแกรมการฝึก", en: "Programs" },
  "/trainer/exercises": { th: "ท่าในการฝึก", en: "Exercises" },
  "/trainer/results": { th: "บันทึกการฝึกรายวัน", en: "Daily Results" },
  "/trainer/progress": { th: "พัฒนาการผู้รับการฝึก", en: "Progress" },
  "/trainer/profile": { th: "โปรไฟล์ส่วนตัว", en: "Profile" },
};

const getInitials = (name = "") =>
  name
    .trim()
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

export default function TrainerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 🔔 ส่วนจัดการระบบแจ้งเตือน (Notification State)
  const [notifications, setNotifications] = useState([]);
  const [notiOpen, setNotiOpen] = useState(false);
  const notiRef = useRef(null);

  // ✅ ดึง user จาก localStorage
  const [user, setUser] = useState(null);
  const { activeYear, notifCount, notifList, markAllRead, markRead } = useTopbarData("trainer");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        /* ignore */
      }
    }
  }, []);

  // 🔔 ดึงรายการแจ้งเตือนจากหลังบ้าน
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error("ดึงข้อมูลการแจ้งเตือนผิดพลาด:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // ดึงซ้ำอัตโนมัติทุกๆ 30 วินาที (Polling) เผื่อมีอาจารย์กดตรวจงานเข้ามา
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // 🔔 สั่งเปลี่ยนสถานะการอ่านแจ้งเตือน
  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/notifications/${id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      // อัปเดต UI ฝั่งหน้าบ้านทันทีโดยไม่ต้องยิงดึงใหม่
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
    } catch (err) {
      console.error("ปรับสถานะการอ่านผิดพลาด:", err);
    }
  };

  // ➕ ฟังก์ชันเมื่อกดคลิกที่ตัวกล่อง Notification ให้มาร์กว่าอ่านแล้ว และเด้งไปยังหน้านั้นๆ ทันที
  const handleNotificationClick = async (noti) => {
    if (!noti.isRead) {
      await handleMarkAsRead(noti._id);
    }
    setNotiOpen(false); // ปิด dropdown
    if (noti.url) {
      navigate(noti.url); // เปลี่ยนหน้าไปยังเส้นทางที่ระบุมาจากหลังบ้าน
    }
  };

  // ดักจับเมื่อกดนอกกล่อง Dropdown กระดิ่ง ให้ทำการปิดหน้าต่างลง
  useEffect(() => {
    function handleClickOutside(event) {
      if (notiRef.current && !notiRef.current.contains(event.target)) {
        setNotiOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const isActive = (path) => location.pathname === path;
  const page = pageTitles[location.pathname] || {
    th: "ระบบเทรนเนอร์",
    en: "Trainer",
  };

  const handleLogout = () => {
    if (!confirm("ต้องการออกจากระบบใช่หรือไม่?")) return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* ── Sidebar ── */}
      <aside
        style={{
          background:
            "linear-gradient(160deg, #0B1F3A 0%, #1E293B 50%, #0EA5E9 100%)",
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
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="font-bold text-white text-sm leading-tight">
                ระบบเทรนเนอร์
              </p>
              <p className="text-slate-300 text-xs truncate">ม.ราชภัฏเลย</p>
            </div>
          )}
        </div>

        {/* User Card */}
        {!collapsed && (
          <div className="mx-4 mt-5 mb-2 rounded-2xl bg-white/10 border border-white/15 p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-sky-400 flex items-center justify-center shrink-0 shadow">
              <span className="text-white text-sm font-bold">
                {getInitials(user?.name)}
              </span>
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-sm font-semibold truncate">
                {user?.name ?? "..."}
              </p>
              <p className="text-slate-300 text-xs">ผู้ฝึกสอน</p>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {menuItems.map(({ id, label, icon: Icon, path }) => {
            const active = isActive(path);
            return (
              <button
                key={id}
                onClick={() => navigate(path)}
                title={collapsed ? label : undefined}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 relative overflow-hidden group
                  ${collapsed ? "justify-center" : ""}
                  ${
                    active
                      ? "bg-white text-sky-700 shadow-lg"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform duration-200 ${active ? "scale-110" : "group-hover:scale-105"}`}
                />
                {!collapsed && <span className="truncate">{label}</span>}
                {!collapsed && active && (
                  <ChevronRight className="w-4 h-4 ml-auto shrink-0 text-indigo-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Collapse toggle + Logout */}
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
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm z-10">
          <div className="px-6 h-16 flex items-center justify-between">
            {/* Left */}
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
                <span className="text-slate-400 text-sm">เทรนเนอร์</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                <span className="text-slate-800 font-semibold text-sm">
                  {page.th}
                </span>
              </div>
            </div>

            {/* Right */}
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

                {/* กล่องรายการ Notification Dropdown */}
                {notiOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                      <span className="font-semibold text-slate-700 text-sm">
                        การแจ้งเตือน
                      </span>
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
                            onClick={() => handleNotificationClick(noti)} // ➕ เพิ่ม onClick ให้ตัวกล่องเพื่อกดแล้วเด้งหน้าได้ทันที
                            className={`p-3.5 transition-colors relative group flex gap-2.5 items-start cursor-pointer
                              ${!noti.isRead ? "bg-sky-50/40 hover:bg-sky-50/80" : "hover:bg-slate-50"}`}
                          >
                            {/* สีแถบตามประเภท */}
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 mt-1.5
                              ${noti.type === "success" ? "bg-green-500" : noti.type === "warning" ? "bg-amber-500" : "bg-sky-500"}`}
                            />

                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-xs font-semibold text-slate-800 truncate ${!noti.isRead ? "text-sky-900" : ""}`}
                              >
                                {noti.title}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                                {noti.message}
                              </p>
                              <span className="text-[10px] text-slate-400 block mt-1">
                                {new Date(noti.created_at).toLocaleDateString(
                                  "th-TH",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </span>
                            </div>

                            {/* ปุ่มกดอ่านแบบเงียบๆ */}
                            {!noti.isRead && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // ➕ ป้องกัน Event Bubble ไม่ให้คลิกโดนกล่องใหญ่
                                  handleMarkAsRead(noti._id);
                                }}
                                title="ทำเป็นอ่านแล้ว"
                                className="p-1 rounded-md text-slate-400 hover:text-sky-600 hover:bg-sky-100/60 opacity-0 group-hover:opacity-100 transition-all shrink-0"
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

              {/* Header Profile */}
              <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
                <div
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-500 to-blue-500
                                     flex items-center justify-center text-white text-xs font-bold shadow"
                >
                  {getInitials(user?.name)}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-slate-800 leading-tight">
                    {user?.name ?? "..."}
                  </p>
                  <p className="text-xs text-slate-400">ผู้ฝึกสอน</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}