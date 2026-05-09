// ManageTrainees.jsx
import { useState } from "react";
import { Search, Plus, Eye, Users, Activity, Clock } from "lucide-react";

const trainees = [
  { id: 1, name: "สมชาย ใจดี",      email: "somchai@test.com",        status: "active",  day: 12,   initials: "สจ", gradient: "from-teal-400 to-cyan-500"    },
  { id: 2, name: "วิภา สมใจ",        email: "wipa@company.co.th",      status: "active",  day: 8,    initials: "วส", gradient: "from-blue-400 to-indigo-500"  },
  { id: 3, name: "นรินทร์ รักเรียน", email: "narin.r@email.com",       status: "waiting", day: null, initials: "นร", gradient: "from-amber-400 to-orange-500"  },
  { id: 4, name: "มานิต จันทร์ดี",   email: "manit.chan@test.com",     status: "active",  day: 21,   initials: "มจ", gradient: "from-violet-400 to-purple-500" },
  { id: 5, name: "กาญจนา สุขใส",     email: "kanjana.s@email.co.th",  status: "done",    day: 30,   initials: "กส", gradient: "from-rose-400 to-pink-500"     },
];

const statusConfig = {
  active:  { label: "กำลังฝึก",    bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  waiting: { label: "รอดำเนินการ", bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500"   },
  done:    { label: "เสร็จสิ้น",   bg: "bg-slate-100",  text: "text-slate-500",   dot: "bg-slate-400"   },
};

export default function ManageTrainees() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const total   = trainees.length;
  const active  = trainees.filter(t => t.status === "active").length;
  const waiting = trainees.filter(t => t.status === "waiting").length;

  const filtered = trainees.filter(t => {
    const matchSearch = t.name.includes(search) || t.email.includes(search);
    const matchFilter = filter === "all" || t.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="w-full min-h-screen p-6 bg-slate-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">จัดการเทรนเนอร์</h1>
          <p className="text-sm text-slate-400 mt-0.5">ทั้งหมด {total} คน</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all">
          <Plus className="w-4 h-4" />
          เพิ่มเทรนเนอร์
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "ทั้งหมด",     value: total,   icon: Users,    from: "from-blue-500",    to: "to-violet-500"  },
          { label: "กำลังฝึก",    value: active,  icon: Activity, from: "from-emerald-500", to: "to-teal-500"    },
          { label: "รอดำเนินการ", value: waiting, icon: Clock,    from: "from-amber-500",   to: "to-orange-500"  },
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

      {/* Search & Filter */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อหรืออีเมล..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-slate-100 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all"
          />
        </div>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border-2 border-slate-100 rounded-xl text-sm text-slate-600 outline-none focus:border-blue-400 transition-all"
        >
          <option value="all">ทุกสถานะ</option>
          <option value="active">กำลังฝึก</option>
          <option value="waiting">รอดำเนินการ</option>
          <option value="done">เสร็จสิ้น</option>
        </select>
      </div>

      {/* Trainee List */}
      <div className="flex flex-col gap-2">
        {filtered.map(t => {
          const st = statusConfig[t.status];
          return (
            <div key={t.id}
              className="flex items-center gap-4 bg-white border-2 border-slate-100 rounded-2xl px-4 py-3 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm`}>
                {t.initials}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">{t.name}</p>
                <p className="text-xs text-slate-400 mt-0.5 truncate">{t.email}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium ${st.bg} ${st.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                  {st.label}
                </span>
                <span className="text-xs text-slate-400 min-w-[60px] text-right">
                  {t.day ? `วันที่ ${t.day}` : "—"}
                </span>
                <button className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-slate-100 rounded-xl text-xs text-slate-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all">
                  <Eye className="w-3.5 h-3.5" />
                  รายละเอียด
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-center text-xs text-slate-400">
        แสดง {filtered.length} จาก {total} รายการ
      </p>
    </div>
  );
}