import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Eye, Users, Activity,
  Clock, Loader2, AlertCircle, Dumbbell,
} from "lucide-react";
import api from "../../services/api"; // ✅ ใช้ axios แทน fetch

const GRADIENTS = [
  "from-teal-400 to-cyan-500",
  "from-blue-400 to-indigo-500",
  "from-amber-400 to-orange-500",
  "from-violet-400 to-purple-500",
  "from-rose-400 to-pink-500",
  "from-green-400 to-emerald-500",
  "from-sky-400 to-blue-500",
];

const STATUS_CONFIG = {
  active:   { label: "ใช้งานอยู่", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  pending:  { label: "รออนุมัติ",  bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500"   },
  inactive: { label: "ปิดใช้งาน", bg: "bg-slate-100",  text: "text-slate-500",   dot: "bg-slate-400"   },
};

export default function ManageTrainees() {
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState("all");

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await api.get("/instructor/trainers"); // ✅
        setTrainers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError(err.response?.data?.message || "โหลดข้อมูลไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };
    fetchTrainers();
  }, []);

  const total   = trainers.length;
  const active  = trainers.filter(t => t.status === "active").length;
  const pending = trainers.filter(t => t.status === "pending").length;

  const filtered = trainers.filter(t => {
    const q = search.trim().toLowerCase();
    const matchSearch =
      t.name?.toLowerCase().includes(q) ||
      t.email?.toLowerCase().includes(q) ||
      t.username?.toLowerCase().includes(q);
    const matchFilter = filter === "all" || t.status === filter;
    return matchSearch && matchFilter;
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      <span className="ml-2 text-gray-600">กำลังโหลดข้อมูล...</span>
    </div>
  );

  return (
    <div className="w-full min-h-screen p-6 bg-slate-50">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">รายชื่อเทรนเนอร์</h1>
          <p className="text-sm text-slate-400 mt-0.5">ทั้งหมด {total} คน</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 mr-2" />{error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "ทั้งหมด",   value: total,   icon: Users,    from: "from-blue-500",    to: "to-violet-500"  },
          { label: "ใช้งานอยู่", value: active,  icon: Activity, from: "from-emerald-500", to: "to-teal-500"    },
          { label: "รออนุมัติ",  value: pending, icon: Clock,    from: "from-amber-500",   to: "to-orange-500"  },
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

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อ อีเมล หรือรหัสผู้ใช้..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-slate-100 rounded-xl text-sm outline-none focus:border-blue-400 transition-all"
          />
        </div>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border-2 border-slate-100 rounded-xl text-sm text-slate-600 outline-none focus:border-blue-400 transition-all"
        >
          <option value="all">ทุกสถานะ</option>
          <option value="active">ใช้งานอยู่</option>
          <option value="pending">รออนุมัติ</option>
          <option value="inactive">ปิดใช้งาน</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>ไม่พบข้อมูลเทรนเนอร์</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((t, i) => {
            const st       = STATUS_CONFIG[t.status] || STATUS_CONFIG.pending;
            const gradient = GRADIENTS[i % GRADIENTS.length];
            return (
              <div key={t._id}
                className="flex items-center gap-4 bg-white border-2 border-slate-100 rounded-2xl px-4 py-3 hover:border-blue-200 hover:shadow-md transition-all group">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm`}>
                  {t.name?.charAt(0) || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">{t.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{t.email}</p>
                </div>
                <div className="hidden md:flex items-center gap-4 text-xs text-slate-500 shrink-0">
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    <span>{t.traineeCount || 0} ลูกเทรน</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Dumbbell className="w-3.5 h-3.5 text-purple-400" />
                    <span>{t.programCount || 0} โปรแกรม</span>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium shrink-0 ${st.bg} ${st.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                  {st.label}
                </span>
                <button
                  onClick={() => navigate(`/instructor/trainees/${t._id}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-slate-100 rounded-xl text-xs text-slate-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all shrink-0">
                  <Eye className="w-3.5 h-3.5" />รายละเอียด
                </button>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-5 text-center text-xs text-slate-400">
        แสดง {filtered.length} จาก {total} รายการ
      </p>
    </div>
  );
}