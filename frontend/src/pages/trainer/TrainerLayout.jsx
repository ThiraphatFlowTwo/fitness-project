import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Home, Users, ClipboardList, Dumbbell,
  Edit, TrendingUp, User, LogOut,
  Bell, Menu, X, ChevronRight, Scale
} from 'lucide-react';
import { useTopbarData } from '../../hooks/useTopbarData';
import NotificationDropdown from '../../components/ui/NotificationDropdown';

const menuItems = [
  { id: 'dashboard', label: 'หน้าหลัก',           icon: Home,          path: '/trainer' }, 
  { id: 'trainees',  label: 'จัดการผู้รับการฝึก',  icon: Users,         path: '/trainer/trainees'  },
  { id: 'programs',  label: 'โปรแกรมการฝึก',        icon: ClipboardList, path: '/trainer/programs'  },
  { id: 'exercises', label: 'ท่าในการฝึก',           icon: Dumbbell,      path: '/trainer/exercises' },
  { id: 'results',   label: 'บันทึกการฝึกรายวัน',    icon: Edit,          path: '/trainer/results'   },
  { id: 'progress',  label: 'พัฒนาการ (กราฟ)',       icon: TrendingUp,    path: '/trainer/progress'  },
  { id: 'profile',   label: 'โปรไฟล์ส่วนตัว',        icon: User,          path: '/trainer/profile'   },
];

const pageTitles = {
  '/trainer':           { th: 'หน้าหลัก',             en: 'Dashboard'      },
  '/trainer/trainees':  { th: 'จัดการผู้รับการฝึก',   en: 'Trainees'       },
  '/trainer/programs':  { th: 'โปรแกรมการฝึก',         en: 'Programs'       },
  '/trainer/exercises': { th: 'ท่าในการฝึก',            en: 'Exercises'      },
  '/trainer/results':   { th: 'บันทึกการฝึกรายวัน',    en: 'Daily Results'  },
  '/trainer/progress':  { th: 'พัฒนาการผู้รับการฝึก',  en: 'Progress'       },
  '/trainer/profile':   { th: 'โปรไฟล์ส่วนตัว',       en: 'Profile'        },
};

// ✅ อักษรย่อจากชื่อเต็ม เช่น "สมชาย ใจดี" → "สใ"
const getInitials = (name = "") =>
  name.trim().split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "?";

export default function TrainerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [collapsed, setCollapsed]     = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();

  // ✅ ดึง user จาก localStorage
  const [user, setUser] = useState(null);
  const { activeYear, notifCount, notifList, markAllRead, markRead } = useTopbarData("trainer");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  const isActive = (path) => location.pathname === path;
  const page = pageTitles[location.pathname] || { th: 'ระบบเทรนเนอร์', en: 'Trainer' };

  const handleLogout = () => {
    if (!confirm("ต้องการออกจากระบบใช่หรือไม่?")) return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">

      {/* ── Sidebar ── */}
      <aside
        style={{ background: 'linear-gradient(160deg, #0B1F3A 0%, #1E293B 50%, #0EA5E9 100%)' }}
        className={`
          flex-shrink-0 flex flex-col h-full shadow-2xl transition-all duration-300
          ${sidebarOpen ? (collapsed ? 'w-20' : 'w-64') : 'w-0 overflow-hidden'}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-5 py-5 border-b border-white/10 ${collapsed ? 'justify-center px-0' : ''}`}>
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0 shadow-lg">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="font-bold text-white text-sm leading-tight">ระบบเทรนเนอร์</p>
              <p className="text-slate-300 text-xs truncate">ม.ราชภัฏเลย</p>
            </div>
          )}
        </div>

        {/* ✅ User Card — ชื่อจาก localStorage */}
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
                  ${collapsed ? 'justify-center' : ''}
                  ${active
                    ? 'bg-white text-sky-700 shadow-lg'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'}
                `}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-105'}`} />
                {!collapsed && <span className="truncate">{label}</span>}
                {!collapsed && active && <ChevronRight className="w-4 h-4 ml-auto shrink-0 text-indigo-400" />}
              </button>
            );
          })}
        </nav>

        {/* Collapse toggle + Logout */}
        <div className="px-3 pb-5 space-y-2 border-t border-white/10 pt-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300
                        hover:bg-white/10 hover:text-white transition-all ${collapsed ? 'justify-center' : ''}`}
          >
            <Menu className="w-5 h-5 shrink-0" />
            {!collapsed && <span>ย่อเมนู</span>}
          </button>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                        bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white
                        transition-all duration-200 ${collapsed ? 'justify-center' : ''}`}
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
                {sidebarOpen ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
              </button>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">เทรนเนอร์</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                <span className="text-slate-800 font-semibold text-sm">{page.th}</span>
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

              {/* ✅ Header — ชื่อจาก localStorage */}
              <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-500 to-blue-500
                                 flex items-center justify-center text-white text-xs font-bold shadow">
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