import { useState, useRef, useEffect } from "react";
import { Bell, CheckCheck, Inbox } from "lucide-react";
import { useNavigate } from "react-router-dom";

const typeIcon = {
  program_submitted:  "📋",
  training_log_new:   "💪",
  program_approved:   "✅",
  program_rejected:   "🔄",
  account_activated:  "🎉",
  user_pending:       "👤",
};

// แต่ละ type ไปหน้าไหน
const typeRoute = {
  program_submitted: "/instructor/programs",  // อาจารย์ดูโปรแกรมรออนุมัติ
  training_log_new:  "/instructor/logs",       // อาจารย์ดูผลการฝึก
  program_approved:  "/trainer/programs",      // เทรนเนอร์ดูโปรแกรมตัวเอง
  program_rejected:  "/trainer/programs",      // เทรนเนอร์ดูโปรแกรมตัวเอง
  account_activated: null,                     // ไม่ต้อง navigate (แค่แจ้งให้รู้)
  user_pending:      "/admin/users",           // แอดมินดูรายชื่อ user
};

const formatTime = (dateStr) => {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60)   return "เมื่อกี้";
  if (diff < 3600) return `${Math.floor(diff / 60)} นาทีที่แล้ว`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ชั่วโมงที่แล้ว`;
  return d.toLocaleDateString("th-TH", { day: "numeric", month: "short" });
};

export default function NotificationDropdown({ notifCount, notifList, markAllRead, markRead }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  // ปิดเมื่อคลิกนอก
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleClick = (n) => {
    if (!n.is_read) markRead(n._id);
    const route = typeRoute[n.type];
    if (route) {
      setOpen(false);
      navigate(route);
    }
  };

  return (
    <div className="relative" ref={ref}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors"
      >
        <Bell className="w-5 h-5 text-slate-600" />
        {notifCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold
                           rounded-full flex items-center justify-center leading-none">
            {notifCount > 99 ? "99+" : notifCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <span className="font-bold text-slate-800 text-sm">การแจ้งเตือน</span>
            {notifCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 font-medium"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                อ่านทั้งหมด
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {notifList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <Inbox className="w-10 h-10 mb-2 text-slate-200" />
                <p className="text-sm">ไม่มีการแจ้งเตือน</p>
              </div>
            ) : (
              notifList.map(n => (
                <div
                  key={n._id}
                  onClick={() => handleClick(n)}
                  className={`flex gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0
                    ${!n.is_read ? "bg-indigo-50/50" : ""}`}
                >
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-lg flex-shrink-0 shadow-sm">
                    {typeIcon[n.type] ?? "🔔"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm leading-snug ${!n.is_read ? "font-semibold text-slate-800" : "font-medium text-slate-600"}`}>
                        {n.title}
                      </p>
                      {!n.is_read && (
                        <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{formatTime(n.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}