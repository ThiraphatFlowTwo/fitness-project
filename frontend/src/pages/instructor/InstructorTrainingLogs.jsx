import { useState, useEffect } from "react";
import {
  Activity, ChevronDown, ChevronRight, Clock, Dumbbell,
  Loader2, AlertCircle, Calendar, User, Search,
  CheckCircle, X, BarChart2, Filter
} from "lucide-react";
import api from "../../services/api";

const formatTime = (s) => {
  if (!s) return "-";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0 ? `${h}ชม. ${m}นาที` : `${m}นาที ${sec}วินาที`;
};

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" }) : "-";

const categoryLabel = {
  weight:     { label: "ใช้น้ำหนัก",   col1: "น้ำหนัก (kg)", col2: "ครั้ง" },
  cardio:     { label: "คาร์ดิโอ",     col1: "ระยะทาง (km)", col2: "เวลา (นาที)" },
  bodyweight: { label: "น้ำหนักตัว",   col1: "เวลา (วินาที)", col2: "ครั้ง" },
  duration:   { label: "จับเวลา",      col1: "เวลา (วินาที)", col2: null },
};

// ── Log Detail Modal ──────────────────────────────────────────────
function LogDetailModal({ logId, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/instructor/log/${logId}`)
      .then(r => setDetail(r.data))
      .catch(() => setDetail(null))
      .finally(() => setLoading(false));
  }, [logId]);

  // จัดกลุ่ม sets ตาม exercise
  const grouped = detail?.sets?.reduce((acc, s) => {
    const id = s.exercise_id?._id || s.exercise_id;
    if (!acc[id]) acc[id] = { info: s.exercise_id, sets: [] };
    acc[id].sets.push(s);
    return acc;
  }, {}) ?? {};

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="font-bold text-slate-800">รายละเอียดการฝึก</p>
              {detail && <p className="text-xs text-slate-400">{formatDate(detail.training_date)}</p>}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
          ) : !detail ? (
            <div className="text-center py-12 text-slate-400">ไม่พบข้อมูล</div>
          ) : (
            <>
              {/* Info row */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-slate-400 mb-1">เทรนเนอร์</p>
                  <p className="font-semibold text-slate-700 text-sm">{detail.trainer_id?.name ?? "-"}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-slate-400 mb-1">ผู้รับการฝึก</p>
                  <p className="font-semibold text-slate-700 text-sm">{detail.trainee_id?.name ?? "-"}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-slate-400 mb-1">เวลาฝึก</p>
                  <p className="font-semibold text-slate-700 text-sm">{formatTime(detail.duration)}</p>
                </div>
              </div>

              {detail.note && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-700">
                  📝 {detail.note}
                </div>
              )}

              {/* ✅ รูปยืนยันการฝึก */}
              {detail.photo && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-slate-500 mb-1.5">📷 รูปยืนยันการฝึก</p>
                  <a href={`http://localhost:5000${detail.photo}`} target="_blank" rel="noreferrer">
                    <img
                      src={`http://localhost:5000${detail.photo}`}
                      alt="รูปยืนยันการฝึก"
                      className="w-full max-h-72 object-cover rounded-xl border border-slate-100 shadow-sm hover:opacity-90 transition-opacity"
                    />
                  </a>
                </div>
              )}

              {/* Exercises */}
              <div className="space-y-4">
                {Object.values(grouped).map((group, idx) => {
                  const cat = group.info?.exercise_category ?? "weight";
                  const cfg = categoryLabel[cat] ?? categoryLabel.weight;
                  return (
                    <div key={idx} className="border border-slate-100 rounded-xl overflow-hidden">
                      <div className="flex items-center gap-3 px-4 py-3 bg-slate-50">
                        <Dumbbell className="w-4 h-4 text-indigo-500" />
                        <span className="font-semibold text-slate-700 text-sm">
                          {group.info?.exercise_name ?? "ไม่ทราบชื่อท่า"}
                        </span>
                        <span className="ml-auto text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                          {cfg.label}
                        </span>
                      </div>
                      <div className="p-3">
                        {/* header */}
                        <div className={`grid ${cfg.col2 ? "grid-cols-4" : "grid-cols-3"} gap-2 text-xs font-semibold text-slate-400 px-2 mb-2`}>
                          <span>เซต</span>
                          <span className="text-center">{cfg.col1}</span>
                          {cfg.col2 && <span className="text-center">{cfg.col2}</span>}
                          <span className="text-center">สถานะ</span>
                        </div>
                        {group.sets.map((s, i) => (
                          <div key={i} className={`grid ${cfg.col2 ? "grid-cols-4" : "grid-cols-3"} gap-2 items-center px-2 py-1.5 rounded-lg ${s.completed ? "bg-emerald-50" : "bg-white"}`}>
                            <span className="text-sm font-medium text-slate-600">เซต {s.set_number}</span>
                            <span className="text-center text-sm text-slate-700">{s.weight ?? "-"}</span>
                            {cfg.col2 && <span className="text-center text-sm text-slate-700">{s.reps ?? "-"}</span>}
                            <span className="flex justify-center">
                              {s.completed
                                ? <CheckCircle className="w-4 h-4 text-emerald-500" />
                                : <span className="w-4 h-4 rounded-full border-2 border-slate-200 inline-block" />}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100">
          <button onClick={onClose}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors">
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────
export default function InstructorTrainingLogs() {
  const [trainers,     setTrainers]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [search,       setSearch]       = useState("");
  const [expanded,     setExpanded]     = useState({});   // trainerId → bool
  const [trainerLogs,  setTrainerLogs]  = useState({});   // trainerId → logs[]
  const [loadingLogs,  setLoadingLogs]  = useState({});   // trainerId → bool
  const [viewLogId,    setViewLogId]    = useState(null);

  useEffect(() => {
    api.get("/instructor/trainers")
      .then(r => setTrainers(Array.isArray(r.data) ? r.data : []))
      .catch(() => setError("โหลดข้อมูลเทรนเนอร์ไม่สำเร็จ"))
      .finally(() => setLoading(false));
  }, []);

  const toggleTrainer = async (trainerId) => {
    const isOpen = expanded[trainerId];
    setExpanded(prev => ({ ...prev, [trainerId]: !isOpen }));

    // โหลด logs ครั้งแรกที่เปิด
    if (!isOpen && !trainerLogs[trainerId]) {
      setLoadingLogs(prev => ({ ...prev, [trainerId]: true }));
      try {
        const r = await api.get(`/instructor/trainer/${trainerId}/logs`);
        setTrainerLogs(prev => ({ ...prev, [trainerId]: Array.isArray(r.data) ? r.data : [] }));
      } catch {
        setTrainerLogs(prev => ({ ...prev, [trainerId]: [] }));
      } finally {
        setLoadingLogs(prev => ({ ...prev, [trainerId]: false }));
      }
    }
  };

  const filtered = trainers.filter(t =>
    t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
    </div>
  );

  return (
    <div className="p-6 lg:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <BarChart2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">ผลการฝึก</h1>
            <p className="text-slate-500 text-sm">ดูประวัติการฝึกของเทรนเนอร์ทั้งหมด</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ค้นหาเทรนเนอร์..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
          />
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
          </div>
        )}

        {/* Trainer list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <User className="w-12 h-12 mx-auto mb-3 text-slate-200" />
            <p>ไม่พบเทรนเนอร์</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(trainer => {
              const isOpen = !!expanded[trainer._id];
              const logs   = trainerLogs[trainer._id] ?? [];
              const isLoadingLog = !!loadingLogs[trainer._id];

              return (
                <div key={trainer._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

                  {/* Trainer row */}
                  <button
                    onClick={() => toggleTrainer(trainer._id)}
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {trainer.name?.[0] ?? "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{trainer.name}</p>
                      <p className="text-xs text-slate-400 truncate">{trainer.email}</p>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {trainer.traineeCount ?? 0} คน
                        </span>
                        <span className="flex items-center gap-1">
                          <Dumbbell className="w-3.5 h-3.5" />
                          {trainer.programCount ?? 0} โปรแกรม
                        </span>
                        {isOpen && !isLoadingLog && (
                          <span className="flex items-center gap-1">
                            <Activity className="w-3.5 h-3.5" />
                            {logs.length} log
                          </span>
                        )}
                      </div>
                      {isOpen
                        ? <ChevronDown className="w-5 h-5 text-slate-400" />
                        : <ChevronRight className="w-5 h-5 text-slate-400" />
                      }
                    </div>
                  </button>

                  {/* Logs section */}
                  {isOpen && (
                    <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-4">
                      {isLoadingLog ? (
                        <div className="flex justify-center py-6">
                          <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                        </div>
                      ) : logs.length === 0 ? (
                        <div className="text-center py-6 text-slate-400 text-sm">
                          <Activity className="w-8 h-8 mx-auto mb-2 text-slate-200" />
                          ยังไม่มีประวัติการฝึก
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {/* header */}
                          <div className="grid grid-cols-5 text-xs font-semibold text-slate-400 px-3 pb-1">
                            <span className="col-span-2">โปรแกรม / ผู้รับการฝึก</span>
                            <span className="text-center">วันที่</span>
                            <span className="text-center">ท่า / เซต</span>
                            <span className="text-center">รายละเอียด</span>
                          </div>
                          {logs.map(log => (
                            <div key={log._id}
                              className="grid grid-cols-5 items-center bg-white border border-slate-100 rounded-xl px-3 py-3 hover:border-indigo-200 transition-colors">
                              <div className="col-span-2 min-w-0 pr-2">
                                <p className="font-medium text-slate-700 text-sm truncate">
                                  {log.program_id?.program_name ?? "ไม่ระบุโปรแกรม"}
                                </p>
                                <p className="text-xs text-slate-400 truncate">{log.trainee_id?.name ?? "-"}</p>
                              </div>
                              <div className="text-center">
                                <span className="text-xs text-slate-500 flex items-center justify-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(log.training_date)}
                                </span>
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-semibold text-slate-700">
                                  {log.exercise_count ?? 0} ท่า
                                </p>
                                <p className="text-xs text-slate-400">
                                  {log.completed_sets ?? 0}/{log.set_count ?? 0} เซต
                                </p>
                              </div>
                              <div className="text-center">
                                <button
                                  onClick={() => setViewLogId(log._id)}
                                  className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold px-3 py-1.5 rounded-lg transition-colors"
                                >
                                  ดูรายละเอียด
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {viewLogId && (
        <LogDetailModal logId={viewLogId} onClose={() => setViewLogId(null)} />
      )}
    </div>
  );
}