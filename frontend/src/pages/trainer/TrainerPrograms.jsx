import React, { useState, useEffect } from "react";
import { Loader2, XCircle, Plus, Pencil, Trash2, Search, Save, Send, Undo2, X, CheckCircle2, Clock, AlertCircle, FileText } from "lucide-react";

const API = "http://localhost:5000/api/programs";
const TRAINEE_API = "http://localhost:5000/api/trainees";
const EXERCISE_API = "http://localhost:5000/api/exercises";

const EMPTY_FORM = {
  name: "",
  description: "",
  trainee_id: "",
  duration_weeks: 4,
  exercises: [],
};

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
};

const STATUS_CONFIG = {
  draft:    { label: "แบบร่าง",            cls: "bg-slate-100 text-slate-600",   icon: <FileText className="w-3 h-3" /> },
  pending:  { label: "รออาจารย์อนุมัติ",   cls: "bg-amber-100 text-amber-700",   icon: <Clock className="w-3 h-3" /> },
  approved: { label: "อนุมัติแล้ว",         cls: "bg-emerald-100 text-emerald-700", icon: <CheckCircle2 className="w-3 h-3" /> },
  rejected: { label: "ส่งกลับให้แก้ไข",    cls: "bg-red-100 text-red-700",       icon: <AlertCircle className="w-3 h-3" /> },
};

// ── Reusable field ──────────────────────────────────────────────────────────
const Field = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
    {children}
  </div>
);

const inputCls =
  "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all";

export default function TrainerPrograms() {
  const [programs, setPrograms]               = useState([]);
  const [trainees, setTrainees]               = useState([]);
  const [exercises, setExercises]             = useState([]);
  const [activeYear, setActiveYear]           = useState(null);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState("");
  const [formData, setFormData]               = useState(EMPTY_FORM);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exSearch, setExSearch]               = useState("");
  const [exTypeFilter, setExTypeFilter]       = useState("");
  const [exEquipFilter, setExEquipFilter]     = useState("");
  const [hasAdvisor, setHasAdvisor]           = useState(true);
  const [isModalOpen, setIsModalOpen]         = useState(false);
  const [editingId, setEditingId]             = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === "trainer" && !user.advisor_id) {
        setHasAdvisor(false);
        setLoading(false);
        return;
      }
    }
    const loadAll = async () => {
      setLoading(true);
      try {
        const [pRes, tRes, eRes, yRes] = await Promise.all([
          fetch(API, { headers: authHeaders() }),
          fetch(TRAINEE_API, { headers: authHeaders() }),
          fetch(EXERCISE_API, { headers: authHeaders() }),
          fetch(`${API}/active-year`, { headers: authHeaders() }),
        ]);
        const [pData, tData, eData, yData] = await Promise.all([
          pRes.json(), tRes.json(), eRes.json(),
          yRes.ok ? yRes.json() : null,
        ]);
        if (!pRes.ok || !tRes.ok || !eRes.ok) throw new Error("โหลดข้อมูลไม่สำเร็จ");
        setPrograms(Array.isArray(pData) ? pData : []);
        setTrainees(Array.isArray(tData) ? tData : []);
        setExercises(Array.isArray(eData) ? eData : []);
        setActiveYear(yData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  const filteredExercises = exercises.filter((ex) => {
    const matchSearch = (ex.exercise_name || "").toLowerCase().includes(exSearch.toLowerCase());
    const matchType   = exTypeFilter  ? ex.exercise_type   === exTypeFilter  : true;
    const matchEquip  = exEquipFilter ? ex.equipment_type  === exEquipFilter : true;
    return matchSearch && matchType && matchEquip;
  });

  const handleOpenCreate = () => {
    setFormData(EMPTY_FORM);
    setSelectedExercises([]);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (program) => {
    setEditingId(program._id);
    setFormData({
      name: program.program_name,
      description: program.description || "",
      trainee_id: program.trainee_id?._id || program.trainee_id,
      duration_weeks: program.duration_weeks,
    });
    setSelectedExercises(program.exercises || []);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("คุณต้องการลบโปรแกรมนี้ใช่หรือไม่?")) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE", headers: authHeaders() });
      if (res.ok) setPrograms(programs.filter((p) => p._id !== id));
      else alert("ไม่สามารถลบโปรแกรมได้");
    } catch { alert("เกิดข้อผิดพลาดในการลบ"); }
  };

  const handleWorkflowAction = async (id, action) => {
    const isSubmit = action === "submit";
    if (!window.confirm(isSubmit ? "ส่งโปรแกรมให้อาจารย์ที่ปรึกษาตรวจสอบหรือไม่?" : "ยกเลิกการส่งโปรแกรมหรือไม่?")) return;
    try {
      const res  = await fetch(`${API}/${id}/${action}`, { method: "PATCH", headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPrograms((cur) => cur.map((p) => (p._id === id ? { ...p, ...data } : p)));
    } catch (err) { alert(err.message || "ทำรายการไม่สำเร็จ"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      program_name: formData.name,
      description: formData.description,
      trainee_id: formData.trainee_id,
      duration_weeks: formData.duration_weeks,
      exercises: selectedExercises.map((ex, i) => ({
        exercise_id: ex.exercise_id?._id || ex.exercise_id || ex._id || ex.id,
        order: i + 1,
        sets: Number(ex.sets),
        reps: Number(ex.reps),
        rest_seconds: Number(ex.rest_seconds),
        rpe: ex.rpe ? Number(ex.rpe) : undefined,
      })),
    };
    try {
      const url    = editingId ? `${API}/${editingId}` : API;
      const method = editingId ? "PUT" : "POST";
      const res    = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(payload) });
      if (res.ok) {
        const saved = await res.json();
        setPrograms(editingId ? programs.map((p) => (p._id === editingId ? saved : p)) : [saved, ...programs]);
        setIsModalOpen(false);
        setFormData(EMPTY_FORM);
        setSelectedExercises([]);
      } else alert("บันทึกข้อมูลไม่สำเร็จ");
    } catch { alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล"); }
  };

  const exId = (ex) => ex.exercise_id?._id || ex.exercise_id || ex._id || ex.id;

  const handleAddExercise = (ex) => {
    if (selectedExercises.some((item) => exId(item) === exId(ex))) return;
    setSelectedExercises([...selectedExercises, { ...ex, exercise_id: exId(ex), sets: 3, reps: 12, rest_seconds: 60 }]);
  };

  const handleRemoveExercise = (id) => setSelectedExercises(selectedExercises.filter((ex) => exId(ex) !== id));

  const handleExDetailChange = (id, field, value) =>
    setSelectedExercises(selectedExercises.map((ex) => (exId(ex) === id ? { ...ex, [field]: value } : ex)));

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      <span className="ml-2 text-sm text-gray-500">กำลังโหลดข้อมูล...</span>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <p className="text-sm text-red-500">{error}</p>
    </div>
  );

  // ── No advisor ───────────────────────────────────────────────────────────
  if (!hasAdvisor) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-amber-200 p-8 max-w-md w-full text-center shadow-sm">
        <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <XCircle className="w-7 h-7 text-amber-500" />
        </div>
        <h3 className="text-base font-semibold text-gray-800 mb-2">ยังไม่ได้เลือกอาจารย์ที่ปรึกษา</h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          คุณจำเป็นต้องเลือกอาจารย์ที่ปรึกษาก่อน จึงจะสร้างหรือแก้ไขโปรแกรมฝึกได้
        </p>
        <a
          href="/trainer/profile"
          className="block w-full bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors text-center"
        >
          ไปที่หน้าโปรไฟล์
        </a>
      </div>
    </div>
  );

  // ── Main ─────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">โปรแกรมฝึกซ้อมของฉัน</h1>
          <p className="text-sm text-gray-400 mt-1">จัดการโปรแกรมการออกกำลังกายสำหรับนักกีฬาของคุณ</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 md:px-6 md:py-2.5 rounded-xl font-bold flex items-center gap-1 md:gap-2 shadow-lg text-sm md:text-base"
        >
          <Plus className="w-4 h-4"  /> สร้างโปรแกรมใหม่
        </button>
      </div>

      {/* Empty state */}
      {programs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
          <p className="text-sm text-gray-400">ยังไม่มีโปรแกรมฝึกซ้อมในระบบ</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {programs.map((program) => {
            const st = STATUS_CONFIG[program.status] || STATUS_CONFIG.draft;
            return (
              <div key={program._id} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col hover:border-gray-200 transition-colors">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 leading-snug">{program.program_name}</h3>
                  <p className="text-xs text-gray-400 mb-4 leading-relaxed line-clamp-2">
                    {program.description || "ไม่มีรายละเอียด"}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="inline-flex items-center gap-1 text-xs bg-violet-50 text-violet-600 px-2.5 py-1 rounded-full font-medium">
                      {program.duration_weeks} สัปดาห์
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-medium">
                      {program.trainee_id?.name || trainees.find((t) => t._id === program.trainee_id)?.name || "ทั่วไป"}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${st.cls}`}>
                      {st.icon} {st.label}
                    </span>
                  </div>
                  {program.status === "rejected" && program.instructor_comment && (
                    <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-3 py-2.5 text-xs text-red-700 leading-relaxed">
                      <span className="font-medium">ความเห็นอาจารย์:</span> {program.instructor_comment}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-gray-50 flex gap-2">
                  {(program.status === "draft" || program.status === "rejected") && <>
                    <button
                      onClick={() => handleEdit(program)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-xl transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" /> แก้ไข
                    </button>
                    <button
                      onClick={() => handleWorkflowAction(program._id, "submit")}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" /> ส่งอนุมัติ
                    </button>
                    <button
                      onClick={() => handleDelete(program._id)}
                      className="flex items-center justify-center px-3 py-2 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>}
                  {program.status === "pending" && (
                    <button
                      onClick={() => handleWorkflowAction(program._id, "cancel")}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors"
                    >
                      <Undo2 className="w-3.5 h-3.5" /> ยกเลิกการส่ง
                    </button>
                  )}
                  {program.status === "approved" && (
                    <p className="w-full py-2 text-center text-xs font-medium text-emerald-700">
                      ✅ นำไปบันทึกผลการฝึกได้แล้ว
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modal ──────────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
        >
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">
                {editingId ? "แก้ไขโปรแกรมฝึกซ้อม" : "สร้างโปรแกรมฝึกซ้อมใหม่"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">

                {/* Left: Program Info */}
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 pb-3 border-b border-gray-100">
                    ข้อมูลทั่วไป
                  </p>
                  <Field label="ชื่อโปรแกรม">
                    <input
                      type="text" required className={inputCls}
                      placeholder="เช่น สร้างกล้ามเนื้อระยะเริ่มต้น"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </Field>
                  <Field label="รายละเอียด">
                    <textarea
                      rows={3} className={inputCls}
                      placeholder="รายละเอียดเป้าหมายโปรแกรม..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="นักกีฬาเป้าหมาย">
                      <select required className={inputCls}
                        value={formData.trainee_id}
                        onChange={(e) => setFormData({ ...formData, trainee_id: e.target.value })}
                      >
                        <option value="">เลือกนักกีฬา</option>
                        {trainees.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
                      </select>
                    </Field>
                    <Field label="ระยะเวลา (สัปดาห์)">
                      <input
                        type="number" min="1" required className={inputCls}
                        value={formData.duration_weeks}
                        onChange={(e) => setFormData({ ...formData, duration_weeks: parseInt(e.target.value) })}
                      />
                    </Field>
                  </div>

                  {/* Selected exercises */}
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-3 pb-3 border-b border-gray-100">
                    ท่าที่เลือกแล้ว ({selectedExercises.length})
                  </p>
                  {selectedExercises.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">ยังไม่ได้เลือกท่าออกกำลังกาย</p>
                  ) : (
                    <div className="space-y-2.5 max-h-64 overflow-y-auto pr-0.5">
                      {selectedExercises.map((ex) => (
                        <div key={exId(ex)} className="bg-gray-50 rounded-xl border border-gray-100 p-3 relative">
                          <button
                            type="button"
                            onClick={() => handleRemoveExercise(exId(ex))}
                            className="absolute top-2.5 right-2.5 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <p className="text-xs font-semibold text-gray-800 mb-2.5 pr-5">
                            {ex.exercise_name || ex.exercise_id?.exercise_name}
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { label: "เซ็ต", field: "sets", val: ex.sets ?? 3 },
                              { label: "ครั้ง", field: "reps", val: ex.reps ?? 12 },
                              { label: "พัก (วิ)", field: "rest_seconds", val: ex.rest_seconds ?? 60 },
                            ].map(({ label, field, val }) => (
                              <div key={field}>
                                <label className="block text-[10px] text-gray-400 mb-1">{label}</label>
                                <input
                                  type="number" min="1"
                                  className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white outline-none focus:ring-1 focus:ring-gray-200"
                                  value={val}
                                  onChange={(e) => handleExDetailChange(exId(ex), field, parseInt(e.target.value))}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Exercise picker */}
                <div className="bg-gray-50 rounded-2xl p-4 flex flex-col">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 pb-3 border-b border-gray-200">
                    ค้นหาท่าออกกำลังกาย
                  </p>
                  <div className="relative mb-2.5">
                    <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text" placeholder="ค้นหาชื่อท่า..."
                      className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-xs bg-white outline-none focus:ring-1 focus:ring-gray-200"
                      value={exSearch}
                      onChange={(e) => setExSearch(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {[
                      { val: exTypeFilter, set: setExTypeFilter, opts: [["", "ทุกกลุ่มกล้ามเนื้อ"], ["Chest", "อก"], ["Back", "หลัง"], ["Legs", "ขา"], ["Arms", "แขน"]] },
                      { val: exEquipFilter, set: setExEquipFilter, opts: [["", "ทุกอุปกรณ์"], ["Barbell", "บาร์เบล"], ["Dumbbell", "ดัมเบล"], ["Machine", "เครื่องฝึก"], ["Bodyweight", "น้ำหนักตัว"]] },
                    ].map((sel, i) => (
                      <select key={i} className="text-xs border border-gray-200 rounded-lg p-1.5 bg-white outline-none text-gray-500"
                        value={sel.val} onChange={(e) => sel.set(e.target.value)}>
                        {sel.opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    ))}
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-2 max-h-72 pr-0.5">
                    {filteredExercises.length === 0 ? (
                      <p className="text-center text-xs text-gray-400 py-8">ไม่พบข้อมูลท่าออกกำลังกาย</p>
                    ) : (
                      filteredExercises.map((ex) => {
                        const id      = ex._id || ex.id;
                        const isAdded = selectedExercises.some((item) => exId(item) === id);
                        return (
                          <div key={id} className="bg-white rounded-xl border border-gray-100 p-3 flex justify-between items-center hover:border-gray-200 transition-colors">
                            <div>
                              <p className="text-xs font-semibold text-gray-800 mb-1.5">{ex.exercise_name}</p>
                              <div className="flex gap-1.5">
                                <span className="text-[10px] bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full font-medium">{ex.exercise_type}</span>
                                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{ex.equipment_type}</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              disabled={isAdded}
                              onClick={() => handleAddExercise(ex)}
                              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                                isAdded
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-gray-900 hover:bg-gray-700 text-white"
                              }`}
                            >
                              {isAdded ? "เลือกแล้ว" : "+ เลือก"}
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  <Save className="w-4 h-4" /> บันทึกข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}