import React, { useState, useEffect } from "react";
import { Loader2, XCircle, Plus, Pencil, Trash2, Search, Save, Send, Undo2, X, CheckCircle2, Clock, AlertCircle, FileText, Info, CheckCircle, AlertTriangle } from "lucide-react";

const API = "http://localhost:5000/api/programs";
const TRAINEE_API = "http://localhost:5000/api/trainees";
const EXERCISE_API = "http://localhost:5000/api/exercises";

const EMPTY_FORM = {
  name: "",
  description: "",
  trainee_id: "",
  exercises: [],
};

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
};

const STATUS_CONFIG = {
  draft:    { label: "แบบร่าง",         cls: "bg-slate-100 text-slate-600",   icon: <FileText className="w-3 h-3" /> },
  pending:  { label: "รออาจารย์อนุมัติ",   cls: "bg-amber-100 text-amber-700",   icon: <Clock className="w-3 h-3" /> },
  approved: { label: "อนุมัติแล้ว",         cls: "bg-emerald-100 text-emerald-700", icon: <CheckCircle2 className="w-3 h-3" /> },
  rejected: { label: "ส่งกลับให้แก้ไข",    cls: "bg-red-100 text-red-700",       icon: <AlertCircle className="w-3 h-3" /> },
};

// ฟังก์ชันช่วยแปลงคำศัพท์เป็นภาษาไทย
const translateToThai = (text) => {
  if (!text) return "";
  const dict = {
    // กลุ่มกล้ามเนื้อ / ประเภท
    chest: "หน้าอก",
    back: "หลัง",
    legs: "ขา",
    shoulders: "ไหล่",
    arms: "แขน",
    biceps: "หน้าแขน",
    triceps: "หลังแขน",
    core: "แกนกลางลำตัว",
    abs: "หน้าท้อง",
    cardio: "คาร์ดิโอ",
    full_body: "ทั่วร่างกาย",
    bodyweight: "น้ำหนักตัว",
    strength: "ความแข็งแรง",
    
    // อุปกรณ์
    dumbbell: "ดัมเบล",
    barbell: "บาร์เบล",
    kettlebell: "เคตเทิลเบล",
    machine: "เครื่องออกกำลังกาย",
    cable: "สายเคเบิล",
    band: "ยางยืด",
    none: "ไม่ต้องใช้อุปกรณ์",
    other: "อื่นๆ"
  };
  const key = String(text).toLowerCase().replace(/\s+/g, "_");
  return dict[key] || text;
};

// Helper ฟังก์ชันดึง ID แบบปลอดภัย (แก้ไขใหม่: รองรับ Object ทุกรูปแบบ + แปลงเป็น String เสมอ)
const getExerciseId = (ex) => {
  if (!ex) return null;
  if (typeof ex === "string") return ex;
  if (typeof ex === "object") {
    if (ex._id) return String(ex._id);
    if (ex.id) return String(ex.id);
    if (ex.exercise_id) {
      if (typeof ex.exercise_id === "string") return ex.exercise_id;
      if (typeof ex.exercise_id === "object") return String(ex.exercise_id._id || ex.exercise_id.id || "");
    }
  }
  return String(ex);
};

// Helper เช็คว่าเป็นท่าประเภทวัดด้วยเวลา (Cardio/Time) หรือไม่
const isTimeBasedExercise = (ex) => {
  const mType = ex.measurement_type?.toLowerCase();
  if (mType === "time" || mType === "duration") return true;
  
  const typeVal = String(ex.exercise_type || ex.category || ex.muscle_group || "").toLowerCase();
  return typeVal.includes("cardio") || typeVal.includes("คาร์ดิโอ");
};

// Reusable field
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

  // TOAST STATE
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  // CONFIRM MODAL STATE
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    type: null,
    id: null,
    title: "",
    description: "",
    confirmLabel: "",
    tone: "danger",
  });

  const closeConfirmModal = () =>
    setConfirmModal((prev) => ({ ...prev, show: false }));

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

  // สรุปกลุ่มกล้ามเนื้อที่มีอยู่จริง + จำนวนรายการ
  const categoryCounts = exercises.reduce((acc, ex) => {
    const cat = ex.exercise_type || ex.category || ex.muscle_group;
    if (cat) acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  // สรุปอุปกรณ์ที่มีอยู่จริง + จำนวนรายการ
  const equipmentCounts = exercises.reduce((acc, ex) => {
    const eq = ex.equipment_type || ex.equipment;
    if (eq) acc[eq] = (acc[eq] || 0) + 1;
    return acc;
  }, {});

  // กรองรายการท่าออกกำลังกาย
  const filteredExercises = exercises.filter((ex) => {
    const name = (ex.exercise_name || ex.name || "").toLowerCase();
    const search = exSearch.toLowerCase().trim();
    const matchSearch = !search || name.includes(search);

    const typeVal = ex.exercise_type || ex.category || ex.muscle_group || "";
    const matchType = !exTypeFilter || typeVal === exTypeFilter;

    const equipVal = ex.equipment_type || ex.equipment || "";
    const matchEquip = !exEquipFilter || equipVal === exEquipFilter;

    return matchSearch && matchType && matchEquip;
  });

  const handleOpenCreate = () => {
    setFormData(EMPTY_FORM);
    setSelectedExercises([]);
    setEditingId(null);
    setExSearch("");
    setExTypeFilter("");
    setExEquipFilter("");
    setIsModalOpen(true);
  };

  // แก้ไขฟังก์ชัน handleEdit เพื่อดึงชื่อท่าได้อย่างถูกต้องแม้ถูกตีกลับ
  const handleEdit = (program) => {
    setEditingId(program._id);
    setFormData({
      name: program.program_name,
      description: program.description || "",
      trainee_id: program.trainee_id?._id || program.trainee_id,
    });
    
    const formattedExs = (program.exercises || []).map((item) => {
      const targetId = getExerciseId(item);
      const originalEx = exercises.find((e) => getExerciseId(e) === targetId) || {};

      // ดึงชื่อท่าด้วยวิธี Fallback ครอบคลุมทุกโครงสร้าง Object
      const retrievedName =
        (typeof item.exercise_id === "object" && (item.exercise_id?.exercise_name || item.exercise_id?.name)) ||
        item.exercise_name ||
        item.name ||
        originalEx.exercise_name ||
        originalEx.name ||
        "ท่าออกกำลังกาย";

      return {
        ...originalEx,
        ...item,
        exercise_id: targetId,
        exercise_name: retrievedName,
        sets: item.sets ?? 3,
        reps: item.reps ?? 12,
        duration_minutes: item.duration_minutes ?? item.duration ?? 15,
      };
    });

    setSelectedExercises(formattedExs);
    setExSearch("");
    setExTypeFilter("");
    setExEquipFilter("");
    setIsModalOpen(true);
  };

  // ลบโปรแกรม
  const handleDeleteClick = (program) => {
    setConfirmModal({
      show: true,
      type: "delete",
      id: program._id,
      title: "ยืนยันการลบโปรแกรม",
      description: `ต้องการลบโปรแกรม "${program.program_name}" ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`,
      confirmLabel: "ลบโปรแกรม",
      tone: "danger",
    });
  };

  const confirmDelete = async () => {
    const id = confirmModal.id;
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE", headers: authHeaders() });
      if (res.ok) {
        setPrograms(programs.filter((p) => p._id !== id));
        closeConfirmModal();
        showToast("ลบโปรแกรมแล้ว", "success");
      } else {
        closeConfirmModal();
        showToast("ไม่สามารถลบโปรแกรมได้", "error");
      }
    } catch {
      closeConfirmModal();
      showToast("เกิดข้อผิดพลาดในการลบ", "error");
    }
  };

  // ส่งอนุมัติ / ยกเลิกการส่ง
  const handleWorkflowClick = (program, action) => {
    const isSubmit = action === "submit";
    setConfirmModal({
      show: true,
      type: action,
      id: program._id,
      title: isSubmit ? "ยืนยันการส่งอนุมัติ" : "ยืนยันการยกเลิกการส่ง",
      description: isSubmit
        ? `ต้องการส่งโปรแกรม "${program.program_name}" ให้อาจารย์ที่ปรึกษาตรวจสอบใช่หรือไม่?`
        : `ต้องการยกเลิกการส่งโปรแกรม "${program.program_name}" ใช่หรือไม่?`,
      confirmLabel: isSubmit ? "ส่งอนุมัติ" : "ยกเลิกการส่ง",
      tone: isSubmit ? "success" : "warning",
    });
  };

  const confirmWorkflowAction = async () => {
    const { id, type: action } = confirmModal;
    try {
      const res  = await fetch(`${API}/${id}/${action}`, { method: "PATCH", headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPrograms((cur) => cur.map((p) => (p._id === id ? { ...p, ...data } : p)));
      closeConfirmModal();
      showToast(
        action === "submit" ? "ส่งโปรแกรมให้อาจารย์ตรวจสอบแล้ว" : "ยกเลิกการส่งแล้ว",
        "success",
      );
    } catch (err) {
      closeConfirmModal();
      showToast(err.message || "ทำรายการไม่สำเร็จ", "error");
    }
  };

  const handleConfirmAction = () => {
    if (confirmModal.type === "delete") confirmDelete();
    else if (confirmModal.type === "submit" || confirmModal.type === "cancel") confirmWorkflowAction();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      program_name: formData.name,
      description: formData.description,
      trainee_id: formData.trainee_id,
      exercises: selectedExercises.map((ex, i) => {
        const isTime = isTimeBasedExercise(ex);
        return {
          exercise_id: getExerciseId(ex),
          order: i + 1,
          sets: Number(ex.sets),
          reps: !isTime ? Number(ex.reps || 12) : undefined,
          duration_minutes: isTime ? Number(ex.duration_minutes || 15) : undefined,
          rpe: ex.rpe ? Number(ex.rpe) : undefined,
        };
      }),
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
        showToast(editingId ? "แก้ไขโปรแกรมสำเร็จ" : "สร้างโปรแกรมสำเร็จ", "success");
      } else {
        showToast("บันทึกข้อมูลไม่สำเร็จ", "error");
      }
    } catch {
      showToast("เกิดข้อผิดพลาดในการบันทึกข้อมูล", "error");
    }
  };

  const handleAddExercise = (ex) => {
    const targetId = getExerciseId(ex);
    if (!targetId) return;
    
    if (selectedExercises.some((item) => getExerciseId(item) === targetId)) return;

    const newExItem = {
      ...ex,
      exercise_id: targetId,
      exercise_name: ex.exercise_name || ex.name || "ท่าออกกำลังกาย",
      sets: 3,
      reps: 12,
      duration_minutes: 15,
    };
    setSelectedExercises((prev) => [...prev, newExItem]);
  };

  const handleRemoveExercise = (id) => {
    setSelectedExercises((prev) => prev.filter((ex) => getExerciseId(ex) !== id));
  };

  const handleExDetailChange = (id, field, value) => {
    setSelectedExercises((prev) =>
      prev.map((ex) => (getExerciseId(ex) === id ? { ...ex, [field]: value } : ex))
    );
  };

  const toneStyles = {
    danger: {
      icon: <Trash2 className="w-7 h-7 text-white" />,
      iconBg: "bg-gradient-to-br from-red-500 to-rose-600",
      button: "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700",
      ring: "ring-red-100",
    },
    warning: {
      icon: <AlertTriangle className="w-7 h-7 text-white" />,
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-500",
      button: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600",
      ring: "ring-amber-100",
    },
    success: {
      icon: <CheckCircle className="w-7 h-7 text-white" />,
      iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
      button: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
      ring: "ring-blue-100",
    },
  };
  const activeTone = toneStyles[confirmModal.tone] || toneStyles.danger;

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
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 md:px-6 md:py-2.5 rounded-xl font-bold flex items-center gap-1 md:gap-2 shadow-lg text-sm md:text-base transition-colors"
        >
          <Plus className="w-4 h-4" /> สร้างโปรแกรมใหม่
        </button>
      </div>

      {/* Program List */}
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
                    <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-medium">
                      นักกีฬา: {program.trainee_id?.name || trainees.find((t) => t._id === (program.trainee_id?._id || program.trainee_id))?.name || "ทั่วไป"}
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
                      onClick={() => handleWorkflowClick(program, "submit")}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" /> ส่งอนุมัติ
                    </button>
                    <button
                      onClick={() => handleDeleteClick(program)}
                      className="flex items-center justify-center px-3 py-2 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>}
                  {program.status === "pending" && (
                    <button
                      onClick={() => handleWorkflowClick(program, "cancel")}
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

      {/* Modal Form */}
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
                  <Field label="นักกีฬาเป้าหมาย">
                    <select required className={inputCls}
                      value={formData.trainee_id}
                      onChange={(e) => setFormData({ ...formData, trainee_id: e.target.value })}
                    >
                      <option value="">เลือกนักกีฬา</option>
                      {trainees.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
                    </select>
                  </Field>

                  {/* Selected exercises */}
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-3 pb-3 border-b border-gray-100">
                    ท่าที่เลือกแล้ว ({selectedExercises.length})
                  </p>
                  {selectedExercises.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">ยังไม่ได้เลือกท่าออกกำลังกาย</p>
                  ) : (
                    <div className="space-y-2.5 max-h-64 overflow-y-auto pr-0.5">
                      {selectedExercises.map((ex) => {
                        const currentId = getExerciseId(ex);
                        const isTime = isTimeBasedExercise(ex);

                        return (
                          <div key={currentId} className="bg-gray-50 rounded-xl border border-gray-100 p-3 relative">
                            <button
                              type="button"
                              onClick={() => handleRemoveExercise(currentId)}
                              className="absolute top-2.5 right-2.5 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            <p className="text-xs font-semibold text-gray-800 mb-2.5 pr-5">
                              {ex.exercise_name || "ท่าออกกำลังกาย"}
                            </p>
                            
                            {/* Dynamic Inputs พิจารณาจากประเภทการวัดผล */}
                            <div className="grid grid-cols-2 gap-2">
                              {/* ช่อง เซ็ต (มีทุกประเภท) */}
                              <div>
                                <label className="block text-[10px] text-gray-400 mb-1">เซ็ต</label>
                                <input
                                  type="number" min="1"
                                  className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white outline-none focus:ring-1 focus:ring-gray-200"
                                  value={ex.sets ?? 3}
                                  onChange={(e) => handleExDetailChange(currentId, "sets", parseInt(e.target.value) || 0)}
                                />
                              </div>

                              {/* แยกเป็น เวลา(นาที) หรือ ครั้ง(Reps) */}
                              {isTime ? (
                                <div>
                                  <label className="block text-[10px] text-gray-400 mb-1">เวลา (นาที)</label>
                                  <input
                                    type="number" min="1"
                                    className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white outline-none focus:ring-1 focus:ring-gray-200"
                                    value={ex.duration_minutes ?? 15}
                                    onChange={(e) => handleExDetailChange(currentId, "duration_minutes", parseInt(e.target.value) || 0)}
                                  />
                                </div>
                              ) : (
                                <div>
                                  <label className="block text-[10px] text-gray-400 mb-1">ครั้ง</label>
                                  <input
                                    type="number" min="1"
                                    className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white outline-none focus:ring-1 focus:ring-gray-200"
                                    value={ex.reps ?? 12}
                                    onChange={(e) => handleExDetailChange(currentId, "reps", parseInt(e.target.value) || 0)}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
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

                  {/* Dynamic Filter Selects - ภาษาไทย */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <select
                      className="text-xs border border-gray-200 rounded-lg p-1.5 bg-white outline-none text-gray-600"
                      value={exTypeFilter}
                      onChange={(e) => setExTypeFilter(e.target.value)}
                    >
                      <option value="">ทุกกลุ่มกล้ามเนื้อ ({exercises.length})</option>
                      {Object.entries(categoryCounts).map(([cat, count]) => (
                        <option key={cat} value={cat}>
                          {translateToThai(cat)} ({count})
                        </option>
                      ))}
                    </select>

                    <select
                      className="text-xs border border-gray-200 rounded-lg p-1.5 bg-white outline-none text-gray-600"
                      value={exEquipFilter}
                      onChange={(e) => setExEquipFilter(e.target.value)}
                    >
                      <option value="">ทุกอุปกรณ์ ({exercises.length})</option>
                      {Object.entries(equipmentCounts).map(([eq, count]) => (
                        <option key={eq} value={eq}>
                          {translateToThai(eq)} ({count})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Exercise Results List */}
                  <div className="flex-1 overflow-y-auto space-y-2 max-h-72 pr-0.5">
                    {filteredExercises.length === 0 ? (
                      <p className="text-center text-xs text-gray-400 py-8">ไม่พบข้อมูลท่าออกกำลังกาย</p>
                    ) : (
                      filteredExercises.map((ex) => {
                        const id = getExerciseId(ex);
                        const isAdded = selectedExercises.some((item) => getExerciseId(item) === id);
                        const typeVal = ex.exercise_type || ex.category || ex.muscle_group;
                        const equipVal = ex.equipment_type || ex.equipment;

                        return (
                          <div key={id} className="bg-white rounded-xl border border-gray-100 p-3 flex justify-between items-center hover:border-gray-200 transition-colors">
                            <div>
                              <p className="text-xs font-semibold text-gray-800 mb-1.5">
                                {ex.exercise_name || ex.name}
                              </p>
                              <div className="flex gap-1.5 flex-wrap">
                                {typeVal && (
                                  <span className="text-[10px] bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full font-medium">
                                    {translateToThai(typeVal)}
                                  </span>
                                )}
                                {equipVal && (
                                  <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                    {translateToThai(equipVal)}
                                  </span>
                                )}
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

      {/* Confirmation Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
            <div
              className={`h-16 w-16 mx-auto rounded-2xl flex items-center justify-center shadow-lg ring-8 ${activeTone.iconBg} ${activeTone.ring}`}
            >
              {activeTone.icon}
            </div>
            <h3 className="text-lg font-bold text-gray-800 mt-4">
              {confirmModal.title}
            </h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              {confirmModal.description}
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={closeConfirmModal}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmAction}
                className={`flex-1 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all ${activeTone.button}`}
              >
                {confirmModal.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-6 right-6 z-[70]">
          <div
            className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border-2 backdrop-blur-sm min-w-[280px] ${
              toast.type === "success"
                ? "bg-emerald-500/90 border-emerald-400 text-white"
                : "bg-rose-500/90 border-rose-400 text-white"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}