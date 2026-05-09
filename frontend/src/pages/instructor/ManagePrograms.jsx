// ManagePrograms.jsx
import { useState } from "react";
import { Search, ClipboardList, Clock, CheckCircle, XCircle, Eye, Check, X } from "lucide-react";

const programs = [
  {
    id: 1, title: "โปรแกรมฝึกความแข็งแกร่ง 8 สัปดาห์",
    trainer: "สมชาย ใจดี", trainee: "อภิชาติ มานะ",
    status: "pending", submittedAt: "7 พ.ค. 2568",
    sessions: 16, weeks: 8, category: "ความแข็งแกร่ง",
    exercises: ["Squat", "Deadlift", "Bench Press"], extraCount: 5,
  },
  {
    id: 2, title: "โปรแกรมลดน้ำหนัก Cardio 4 สัปดาห์",
    trainer: "วิภา สมใจ", trainee: "กนกวรรณ ใจงาม",
    status: "pending", submittedAt: "8 พ.ค. 2568",
    sessions: 12, weeks: 4, category: "Cardio",
    exercises: ["วิ่ง", "กระโดดเชือก", "Cycling"], extraCount: 2,
  },
  {
    id: 3, title: "โปรแกรมเพิ่มกล้ามเนื้อ 6 สัปดาห์",
    trainer: "มานิต จันทร์ดี", trainee: "ธนวัฒน์ สุขเกษม",
    status: "approved", submittedAt: "5 พ.ค. 2568",
    sessions: 18, weeks: 6, category: "Hypertrophy",
    exercises: ["Pull Up", "Dumbbell Row", "Overhead Press"], extraCount: 7,
  },
  {
    id: 4, title: "โปรแกรม HIIT เข้มข้น 3 สัปดาห์",
    trainer: "สมชาย ใจดี", trainee: "รัตนาภรณ์ ดีงาม",
    status: "rejected", submittedAt: "2 พ.ค. 2568",
    sessions: 9, weeks: 3, category: "HIIT",
    exercises: [], extraCount: 0,
    rejectReason: "ความเข้มข้นสูงเกินไปสำหรับระดับผู้เริ่มต้น",
  },
];

const statusConfig = {
  pending:  { label: "รออนุมัติ",   bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500",   border: "border-amber-300"  },
  approved: { label: "อนุมัติแล้ว", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-400" },
  rejected: { label: "ไม่อนุมัติ",  bg: "bg-red-50",     text: "text-red-700",     dot: "bg-red-500",     border: "border-red-400"    },
};

export default function ManagePrograms() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const total    = programs.length;
  const pending  = programs.filter(p => p.status === "pending").length;
  const approved = programs.filter(p => p.status === "approved").length;
  const rejected = programs.filter(p => p.status === "rejected").length;

  const filtered = programs.filter(p => {
    const matchSearch = p.title.includes(search) || p.trainer.includes(search);
    const matchFilter = filter === "all" || p.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="w-full min-h-screen p-6 bg-slate-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">โปรแกรมการฝึก</h1>
          <p className="text-sm text-slate-400 mt-0.5">ทั้งหมด {total} โปรแกรม</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "ทั้งหมด",     value: total,    icon: ClipboardList, from: "from-blue-500",    to: "to-violet-500"   },
          { label: "รออนุมัติ",   value: pending,  icon: Clock,         from: "from-amber-500",   to: "to-orange-500"   },
          { label: "อนุมัติแล้ว", value: approved, icon: CheckCircle,   from: "from-emerald-500", to: "to-teal-500"     },
          { label: "ไม่อนุมัติ",  value: rejected, icon: XCircle,       from: "from-red-500",     to: "to-rose-500"     },
        ].map(({ label, value, icon: Icon, from, to }) => (
          <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">{label}</span>
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${from} ${to} flex items-center justify-center`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-800">{value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ค้นหาโปรแกรมหรือชื่อเทรนเนอร์..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-slate-100 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all"
          />
        </div>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border-2 border-slate-100 rounded-xl text-sm text-slate-600 outline-none focus:border-blue-400 transition-all"
        >
          <option value="all">ทุกสถานะ</option>
          <option value="pending">รออนุมัติ</option>
          <option value="approved">อนุมัติแล้ว</option>
          <option value="rejected">ไม่อนุมัติ</option>
        </select>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3">
        {filtered.map(p => {
          const st = statusConfig[p.status];
          return (
            <div key={p.id} className={`bg-white rounded-2xl border-2 ${st.border} shadow-sm overflow-hidden`}>
              <div className="p-5">
                {/* Top */}
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-1">{p.title}</h3>
                    <p className="text-xs text-slate-400">
                      เทรนเนอร์: <span className="text-slate-600 font-medium">{p.trainer}</span>
                      {" → "}
                      ลูกเทรน: <span className="text-slate-600 font-medium">{p.trainee}</span>
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold shrink-0 ${st.bg} ${st.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                    {st.label}
                  </span>
                </div>

                {/* Meta pills */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {[
                    `📅 ${p.submittedAt}`,
                    `📋 ${p.sessions} เซสชัน`,
                    `🕐 ${p.weeks} สัปดาห์`,
                    `🏋️ ${p.category}`,
                  ].map(m => (
                    <span key={m} className="text-xs bg-slate-50 border border-slate-200 text-slate-500 px-2.5 py-1 rounded-lg">
                      {m}
                    </span>
                  ))}
                </div>

                {/* Exercise tags */}
                {p.exercises.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {p.exercises.map(ex => (
                      <span key={ex} className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-lg font-medium">
                        {ex}
                      </span>
                    ))}
                    {p.extraCount > 0 && (
                      <span className="text-xs bg-slate-50 text-slate-500 border border-slate-200 px-2.5 py-1 rounded-lg">
                        +{p.extraCount} รายการ
                      </span>
                    )}
                  </div>
                )}

                {/* Reject reason */}
                {p.status === "rejected" && p.rejectReason && (
                  <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2 mb-3">
                    <XCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    เหตุผล: {p.rejectReason}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  {p.status === "pending" && (
                    <>
                      <button className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl hover:bg-emerald-100 transition-colors">
                        <Check className="w-3.5 h-3.5" /> อนุมัติ
                      </button>
                      <button className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 text-xs font-semibold rounded-xl hover:bg-red-100 transition-colors">
                        <X className="w-3.5 h-3.5" /> ไม่อนุมัติ
                      </button>
                    </>
                  )}
                  <button className="flex items-center gap-1.5 px-4 py-2 border-2 border-slate-100 text-slate-500 text-xs font-medium rounded-xl hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all ml-auto">
                    <Eye className="w-3.5 h-3.5" /> ดูรายละเอียด
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-center text-xs text-slate-400">
        แสดง {filtered.length} จาก {programs.length} รายการ
      </p>
    </div>
  );
}