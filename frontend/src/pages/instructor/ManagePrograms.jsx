import { useState, useEffect } from "react";
import { Search, ClipboardList, Clock, CheckCircle, XCircle, Eye, Check, X, Loader2, Dumbbell } from "lucide-react";

const API = "http://localhost:5000/api/programs";

const getToken    = () => localStorage.getItem("token");
const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

const statusConfig = {
  pending:  { label: "รออนุมัติ",   bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500",   border: "border-amber-300"  },
  approved: { label: "อนุมัติแล้ว", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-400" },
  rejected: { label: "ไม่อนุมัติ",  bg: "bg-red-50",     text: "text-red-700",     dot: "bg-red-500",     border: "border-red-400"    },
};

export default function ManagePrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState("all");

  // Modal ดูรายละเอียด
  const [viewModal,   setViewModal]   = useState(false);
  const [viewProgram, setViewProgram] = useState(null);

  // Modal อนุมัติ/ปฏิเสธ
  const [actionModal,   setActionModal]   = useState(false);
  const [actionType,    setActionType]    = useState(''); // 'approve' | 'reject'
  const [actionProgram, setActionProgram] = useState(null);
  const [comment,       setComment]       = useState('');
  const [submitting,    setSubmitting]    = useState(false);

  // ── โหลดข้อมูล ────────────────────────────────────────────────
  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      try {
        const res  = await fetch(`${API}/pending`, { headers: authHeaders() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setPrograms(data);
      } catch (err) {
        setError(err.message || 'โหลดข้อมูลไม่สำเร็จ');
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  // ── คำนวณสถิติ ────────────────────────────────────────────────
  const total    = programs.length;
  const pending  = programs.filter(p => p.status === "pending").length;
  const approved = programs.filter(p => p.status === "approved").length;
  const rejected = programs.filter(p => p.status === "rejected").length;

  const filtered = programs.filter(p => {
    const trainerName = p.trainer_id?.name || '';
    const traineeName = p.trainee_id?.name || '';
    const matchSearch = p.program_name.includes(search) || trainerName.includes(search) || traineeName.includes(search);
    const matchFilter = filter === "all" || p.status === filter;
    return matchSearch && matchFilter;
  });

  // ── เปิด Modal ────────────────────────────────────────────────
  const openApprove = (p) => {
    setActionProgram(p);
    setActionType('approve');
    setComment('');
    setActionModal(true);
  };

  const openReject = (p) => {
    setActionProgram(p);
    setActionType('reject');
    setComment('');
    setActionModal(true);
  };

  const openView = (p) => {
    setViewProgram(p);
    setViewModal(true);
  };

  // ── อนุมัติ / ปฏิเสธ ─────────────────────────────────────────
  const handleAction = async () => {
    if (actionType === 'reject' && !comment.trim()) {
      alert('กรุณากรอกเหตุผลที่ไม่อนุมัติ');
      return;
    }
    setSubmitting(true);
    try {
      const endpoint = actionType === 'approve' ? 'approve' : 'reject';
      const res  = await fetch(`${API}/${actionProgram._id}/${endpoint}`, {
        method:  'PATCH',
        headers: authHeaders(),
        body:    JSON.stringify({ comment })
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message); return; }

      setPrograms(prev => prev.map(p =>
        p._id === actionProgram._id
          ? { ...p, status: actionType === 'approve' ? 'approved' : 'rejected', instructor_comment: comment }
          : p
      ));
      setActionModal(false);
    } catch { alert('เกิดข้อผิดพลาด'); }
    finally { setSubmitting(false); }
  };

  // ── Render ────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      <span className="ml-2 text-gray-600">กำลังโหลดข้อมูล...</span>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>
  );

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
          { label: "ทั้งหมด",     value: total,    icon: ClipboardList, from: "from-blue-500",    to: "to-violet-500"  },
          { label: "รออนุมัติ",   value: pending,  icon: Clock,         from: "from-amber-500",   to: "to-orange-500"  },
          { label: "อนุมัติแล้ว", value: approved, icon: CheckCircle,   from: "from-emerald-500", to: "to-teal-500"    },
          { label: "ไม่อนุมัติ",  value: rejected, icon: XCircle,       from: "from-red-500",     to: "to-rose-500"    },
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
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="ค้นหาโปรแกรม เทรนเนอร์ หรือลูกเทรน..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-slate-100 rounded-xl text-sm outline-none focus:border-blue-400 transition-all" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border-2 border-slate-100 rounded-xl text-sm text-slate-600 outline-none focus:border-blue-400 transition-all">
          <option value="all">ทุกสถานะ</option>
          <option value="pending">รออนุมัติ</option>
          <option value="approved">อนุมัติแล้ว</option>
          <option value="rejected">ไม่อนุมัติ</option>
        </select>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <p className="text-center text-slate-400 py-16">ไม่พบโปรแกรม</p>
        ) : filtered.map(p => {
          const st = statusConfig[p.status] || statusConfig.pending;
          return (
            <div key={p._id} className={`bg-white rounded-2xl border-2 ${st.border} shadow-sm overflow-hidden`}>
              <div className="p-5">

                {/* Top */}
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-1">{p.program_name}</h3>
                    <p className="text-xs text-slate-400">
                      เทรนเนอร์: <span className="text-slate-600 font-medium">{p.trainer_id?.name || '-'}</span>
                      {" → "}
                      ลูกเทรน: <span className="text-slate-600 font-medium">{p.trainee_id?.name || '-'}</span>
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold shrink-0 ${st.bg} ${st.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                    {st.label}
                  </span>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {[
                    `📅 ${new Date(p.created_date || p.createdAt).toLocaleDateString('th-TH')}`,
                    `🏋️ ${p.exercises?.length || 0} ท่า`,
                    p.academic_year_id ? `📚 ปี ${p.academic_year_id.academic_year} เทอม ${p.academic_year_id.semester}` : null,
                    p.trainee_id?.goal ? `🎯 ${p.trainee_id.goal}` : null,
                  ].filter(Boolean).map(m => (
                    <span key={m} className="text-xs bg-slate-50 border border-slate-200 text-slate-500 px-2.5 py-1 rounded-lg">{m}</span>
                  ))}
                </div>

                {/* Exercise tags */}
                {p.exercises?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {p.exercises.slice(0, 3).map(ex => (
                      <span key={ex._id} className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-lg font-medium">
                        {ex.exercise_id?.exercise_name || '-'}
                      </span>
                    ))}
                    {p.exercises.length > 3 && (
                      <span className="text-xs bg-slate-50 text-slate-500 border border-slate-200 px-2.5 py-1 rounded-lg">
                        +{p.exercises.length - 3} รายการ
                      </span>
                    )}
                  </div>
                )}

                {/* ความเห็นอาจารย์ */}
                {p.instructor_comment && (
                  <div className={`flex items-start gap-2 text-xs rounded-xl px-3 py-2 mb-3 ${
                    p.status === 'rejected'
                      ? 'text-red-600 bg-red-50 border border-red-100'
                      : 'text-emerald-700 bg-emerald-50 border border-emerald-100'
                  }`}>
                    {p.status === 'rejected'
                      ? <XCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      : <CheckCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    }
                    ความเห็น: {p.instructor_comment}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  {p.status === "pending" && (
                    <>
                      <button onClick={() => openApprove(p)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl hover:bg-emerald-100 transition-colors">
                        <Check className="w-3.5 h-3.5" /> อนุมัติ
                      </button>
                      <button onClick={() => openReject(p)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 text-xs font-semibold rounded-xl hover:bg-red-100 transition-colors">
                        <X className="w-3.5 h-3.5" /> ไม่อนุมัติ
                      </button>
                    </>
                  )}
                  <button onClick={() => openView(p)}
                    className="flex items-center gap-1.5 px-4 py-2 border-2 border-slate-100 text-slate-500 text-xs font-medium rounded-xl hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all ml-auto">
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

      {/* ===== Modal อนุมัติ / ปฏิเสธ ===== */}
      {actionModal && actionProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="font-bold text-slate-800">
                {actionType === 'approve' ? '✅ อนุมัติโปรแกรม' : '❌ ไม่อนุมัติโปรแกรม'}
              </h3>
              <button onClick={() => setActionModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-sm font-semibold text-slate-700">{actionProgram.program_name}</p>
                <p className="text-xs text-slate-400 mt-1">
                  เทรนเนอร์: {actionProgram.trainer_id?.name} → ลูกเทรน: {actionProgram.trainee_id?.name}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  ความเห็น {actionType === 'reject' && <span className="text-red-500">*</span>}
                  {actionType === 'approve' && <span className="text-slate-400 text-xs ml-1">(ไม่บังคับ)</span>}
                </label>
                <textarea value={comment} onChange={e => setComment(e.target.value)} rows="3"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 resize-none"
                  placeholder={actionType === 'approve'
                    ? "ความเห็นเพิ่มเติม (ถ้ามี)..."
                    : "กรุณาระบุเหตุผลที่ไม่อนุมัติ..."
                  } />
              </div>

              <div className="flex space-x-3 pt-2">
                <button onClick={handleAction} disabled={submitting}
                  className={`flex-1 py-3 rounded-xl font-semibold text-white flex items-center justify-center space-x-2 disabled:opacity-60 ${
                    actionType === 'approve'
                      ? 'bg-emerald-500 hover:bg-emerald-600'
                      : 'bg-red-500 hover:bg-red-600'
                  }`}>
                  {submitting
                    ? <><Loader2 className="w-4 h-4 animate-spin" /><span>กำลังบันทึก...</span></>
                    : actionType === 'approve'
                      ? <><Check className="w-4 h-4" /><span>ยืนยันอนุมัติ</span></>
                      : <><X className="w-4 h-4" /><span>ยืนยันไม่อนุมัติ</span></>
                  }
                </button>
                <button onClick={() => setActionModal(false)}
                  className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold">
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Modal ดูรายละเอียด ===== */}
      {viewModal && viewProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <h3 className="font-bold text-slate-800">👁️ รายละเอียดโปรแกรม</h3>
              <button onClick={() => setViewModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">

              {/* ข้อมูลหลัก */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400 mb-1">ชื่อโปรแกรม</p>
                  <p className="text-sm font-semibold text-slate-800">{viewProgram.program_name}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400 mb-1">สถานะ</p>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusConfig[viewProgram.status]?.bg} ${statusConfig[viewProgram.status]?.text}`}>
                    {statusConfig[viewProgram.status]?.label}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400 mb-1">เทรนเนอร์</p>
                  <p className="text-sm font-semibold text-slate-800">{viewProgram.trainer_id?.name || '-'}</p>
                  <p className="text-xs text-slate-400">{viewProgram.trainer_id?.email || ''}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400 mb-1">ลูกเทรน</p>
                  <p className="text-sm font-semibold text-slate-800">{viewProgram.trainee_id?.name || '-'}</p>
                  <p className="text-xs text-slate-400">เป้าหมาย: {viewProgram.trainee_id?.goal || '-'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400 mb-1">ปีการศึกษา</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {viewProgram.academic_year_id
                      ? `ปี ${viewProgram.academic_year_id.academic_year} เทอม ${viewProgram.academic_year_id.semester}`
                      : '-'}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400 mb-1">วันที่สร้าง</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {new Date(viewProgram.created_date || viewProgram.createdAt).toLocaleDateString('th-TH')}
                  </p>
                </div>
              </div>

              {/* ท่าออกกำลังกาย */}
              {viewProgram.exercises?.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">
                    💪 ท่าออกกำลังกาย ({viewProgram.exercises.length} ท่า)
                  </p>
                  <div className="space-y-2">
                    {viewProgram.exercises
                      .sort((a, b) => a.order - b.order)
                      .map((ex, i) => (
                        <div key={ex._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex items-center space-x-3">
                            <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-bold">
                              {i + 1}
                            </span>
                            <div>
                              <p className="text-sm font-medium text-slate-800">
                                {ex.exercise_id?.exercise_name || '-'}
                              </p>
                              <p className="text-xs text-slate-400">
                                {ex.exercise_id?.exercise_type} • {ex.exercise_id?.equipment_type}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            {ex.sets && <span className="bg-white border border-slate-200 px-2 py-1 rounded-lg">{ex.sets} sets</span>}
                            {ex.reps && <span className="bg-white border border-slate-200 px-2 py-1 rounded-lg">{ex.reps} reps</span>}
                            {ex.rpe  && <span className="bg-orange-50 border border-orange-200 text-orange-600 px-2 py-1 rounded-lg">RPE {ex.rpe}</span>}
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}

              {/* ความเห็นอาจารย์ */}
              {viewProgram.instructor_comment && (
                <div className={`p-3 rounded-xl border text-sm ${
                  viewProgram.status === 'rejected'
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                }`}>
                  <p className="font-semibold mb-1">💬 ความเห็นจากอาจารย์:</p>
                  <p>{viewProgram.instructor_comment}</p>
                </div>
              )}

              {/* ปุ่มอนุมัติ/ปฏิเสธในหน้า view ถ้ายังเป็น pending */}
              {viewProgram.status === 'pending' && (
                <div className="flex gap-3 pt-2 border-t">
                  <button onClick={() => { setViewModal(false); openApprove(viewProgram); }}
                    className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 text-sm">
                    <Check className="w-4 h-4" /> อนุมัติ
                  </button>
                  <button onClick={() => { setViewModal(false); openReject(viewProgram); }}
                    className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 text-sm">
                    <X className="w-4 h-4" /> ไม่อนุมัติ
                  </button>
                </div>
              )}

              <button onClick={() => setViewModal(false)}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold">
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}