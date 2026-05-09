import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  Send,
  Save,
  X,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Users,
  Target,
  Calendar,
  Dumbbell,
  GripVertical,
} from "lucide-react";

const API = "http://localhost:5000/api/programs";
const TRAINEE_API = "http://localhost:5000/api/trainees";
const EXERCISE_API = "http://localhost:5000/api/exercises";

const getToken = () => localStorage.getItem("token");
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const STATUS_CONFIG = {
  draft: {
    text: "แบบร่าง",
    bg: "bg-gray-100",
    tc: "text-gray-600",
    border: "border-gray-200",
  },
  pending: {
    text: "รออนุมัติ",
    bg: "bg-yellow-100",
    tc: "text-yellow-700",
    border: "border-yellow-200",
  },
  approved: {
    text: "อนุมัติแล้ว",
    bg: "bg-green-100",
    tc: "text-green-700",
    border: "border-green-200",
  },
  rejected: {
    text: "ไม่อนุมัติ",
    bg: "bg-red-100",
    tc: "text-red-700",
    border: "border-red-200",
  },
};

const EMPTY_FORM = { program_name: "", trainee_id: "", goal: "" };
const EMPTY_EX = { exercise_id: "", sets: "", reps: "", rpe: "", order: 1 };

const TrainerPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [trainees, setTrainees] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [activeYear, setActiveYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  // ท่าออกกำลังกายที่เลือกในโปรแกรม
  const [selectedExercises, setSelectedExercises] = useState([]);

  // ── โหลดข้อมูล ────────────────────────────────────────────────
  useEffect(() => {
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
          pRes.json(),
          tRes.json(),
          eRes.json(),
          yRes.ok ? yRes.json() : null,
        ]);
        setPrograms(Array.isArray(pData) ? pData : []);
        setTrainees(Array.isArray(tData) ? tData : []);
        setExercises(Array.isArray(eData) ? eData : []);
        setActiveYear(yData);
      } catch {
        setError("โหลดข้อมูลไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  // ── เปิด Modal ────────────────────────────────────────────────
  const handleAdd = () => {
    setModalMode("add");
    setFormData(EMPTY_FORM);
    setSelectedExercises([]);
    setSelectedProgram(null);
    setIsModalOpen(true);
  };

  const handleView = (p) => {
    setModalMode("view");
    setSelectedProgram(p);
    setFormData({
      program_name: p.program_name,
      trainee_id: p.trainee_id?._id || p.trainee_id,
      goal: p.trainee_id?.goal || "",
    });
    setSelectedExercises(
      p.exercises?.map((e) => ({
        exercise_id: e.exercise_id?._id || e.exercise_id,
        name: e.exercise_id?.exercise_name || "",
        type: e.exercise_id?.exercise_type || "",
        sets: e.sets || "",
        reps: e.reps || "",
        rpe: e.rpe || "",
        order: e.order || 1,
      })) || [],
    );
    setIsModalOpen(true);
  };

  const handleEdit = (p) => {
    if (p.status === "approved") {
      alert("ไม่สามารถแก้ไขโปรแกรมที่อนุมัติแล้วได้");
      return;
    }
    if (p.status === "pending") {
      alert("ไม่สามารถแก้ไขโปรแกรมที่รออนุมัติอยู่ได้");
      return;
    }
    setModalMode("edit");
    setSelectedProgram(p);
    setFormData({
      program_name: p.program_name,
      trainee_id: p.trainee_id?._id || p.trainee_id,
      goal: p.trainee_id?.goal || "",
    });
    setSelectedExercises(
      p.exercises?.map((e) => ({
        exercise_id: e.exercise_id?._id || e.exercise_id,
        name: e.exercise_id?.exercise_name || "",
        type: e.exercise_id?.exercise_type || "",
        sets: e.sets || "",
        reps: e.reps || "",
        rpe: e.rpe || "",
        order: e.order || 1,
      })) || [],
    );
    setIsModalOpen(true);
  };

  // ── ลบโปรแกรม ────────────────────────────────────────────────
  const handleDelete = async (p) => {
    if (p.status === "approved") {
      alert("ไม่สามารถลบโปรแกรมที่อนุมัติแล้วได้");
      return;
    }
    if (p.status === "pending") {
      alert("ไม่สามารถลบโปรแกรมที่รออนุมัติอยู่ได้");
      return;
    }
    if (!window.confirm("ต้องการลบโปรแกรมนี้ใช่หรือไม่?")) return;
    try {
      const res = await fetch(`${API}/${p._id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message);
        return;
      }
      setPrograms((prev) => prev.filter((x) => x._id !== p._id));
    } catch {
      alert("ลบไม่สำเร็จ");
    }
  };

  // ── ส่งให้อาจารย์ ─────────────────────────────────────────────
  const handleSubmit = async (p) => {
    if (!window.confirm("ส่งโปรแกรมนี้ให้อาจารย์ตรวจสอบใช่หรือไม่?")) return;
    try {
      const res = await fetch(`${API}/${p._id}/submit`, {
        method: "PATCH",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message);
        return;
      }
      setPrograms((prev) =>
        prev.map((x) => (x._id === p._id ? { ...x, status: "pending" } : x)),
      );
    } catch {
      alert("ส่งไม่สำเร็จ");
    }
  };

  const handleCancel = async (p) => {
    if (!window.confirm("ยกเลิกการส่ง และนำโปรแกรมกลับมาแก้ไขใช่หรือไม่?"))
      return;
    try {
      const res = await fetch(`${API}/${p._id}/cancel`, {
        method: "PATCH",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message);
        return;
      }
      setPrograms((prev) =>
        prev.map((x) => (x._id === p._id ? { ...x, status: "draft" } : x)),
      );
    } catch {
      alert("ยกเลิกไม่สำเร็จ");
    }
  };

  // ── บันทึก ────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!formData.program_name || !formData.trainee_id) {
      alert("กรุณากรอกชื่อโปรแกรมและเลือกผู้รับการฝึก");
      return;
    }
    if (selectedExercises.length === 0) {
      alert("กรุณาเลือกท่าออกกำลังกายอย่างน้อย 1 ท่า");
      return;
    }
    setSaving(true);
    try {
      const body = {
        program_name: formData.program_name,
        trainee_id: formData.trainee_id,
        exercises: selectedExercises.map((ex, i) => ({
          exercise_id: ex.exercise_id,
          order: i + 1,
          sets: ex.sets ? Number(ex.sets) : undefined,
          reps: ex.reps ? Number(ex.reps) : undefined,
          rpe: ex.rpe ? Number(ex.rpe) : undefined,
        })),
      };

      const url = modalMode === "add" ? API : `${API}/${selectedProgram._id}`;
      const method = modalMode === "add" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(`บันทึกไม่สำเร็จ: ${data.message}`);
        return;
      }

      if (modalMode === "add") {
        setPrograms((prev) => [data, ...prev]);
      } else {
        setPrograms((prev) =>
          prev.map((x) => (x._id === selectedProgram._id ? data : x)),
        );
      }
      setIsModalOpen(false);
    } catch {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  // ── จัดการ selectedExercises ──────────────────────────────────
  const addExercise = (ex) => {
    if (selectedExercises.find((e) => e.exercise_id === ex._id)) return;
    setSelectedExercises((prev) => [
      ...prev,
      {
        exercise_id: ex._id,
        name: ex.exercise_name,
        type: ex.exercise_type,
        sets: "",
        reps: "",
        rpe: "",
        order: prev.length + 1,
      },
    ]);
  };

  const removeExercise = (exerciseId) => {
    setSelectedExercises((prev) =>
      prev
        .filter((e) => e.exercise_id !== exerciseId)
        .map((e, i) => ({ ...e, order: i + 1 })),
    );
  };

  const updateExerciseField = (exerciseId, field, value) => {
    setSelectedExercises((prev) =>
      prev.map((e) =>
        e.exercise_id === exerciseId ? { ...e, [field]: value } : e,
      ),
    );
  };

  const moveExercise = (index, direction) => {
    const newList = [...selectedExercises];
    const target = index + direction;
    if (target < 0 || target >= newList.length) return;
    [newList[index], newList[target]] = [newList[target], newList[index]];
    setSelectedExercises(newList.map((e, i) => ({ ...e, order: i + 1 })));
  };

  // ── Render ────────────────────────────────────────────────────
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-2 text-gray-600">กำลังโหลดข้อมูล...</span>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">โปรแกรมการฝึก</h3>
          {activeYear && (
            <p className="text-sm text-gray-500 mt-1">
              ปีการศึกษา {activeYear.academic_year} ภาคเรียนที่{" "}
              {activeYear.semester}
            </p>
          )}
          {!activeYear && (
            <p className="text-sm text-red-500 mt-1">
              ⚠️ ไม่พบปีการศึกษาที่ใช้งานอยู่
            </p>
          )}
        </div>
        <button
          onClick={handleAdd}
          disabled={!activeYear}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusCircle className="w-5 h-5" />
          <span>สร้างโปรแกรมใหม่</span>
        </button>
      </div>

      {/* คำอธิบายสถานะ */}
      <div className="mb-6 bg-white rounded-lg p-4 shadow-sm flex flex-wrap gap-3">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <span
            key={key}
            className={`px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.tc}`}
          >
            {cfg.text}
          </span>
        ))}
      </div>

      {/* Grid */}
      {programs.length === 0 ? (
        <p className="text-center text-gray-400 py-20">ยังไม่มีโปรแกรมการฝึก</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((p) => {
            const cfg = STATUS_CONFIG[p.status] || STATUS_CONFIG.draft;
            return (
              <div
                key={p._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className={`p-4 ${cfg.bg} border-b ${cfg.border}`}>
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-800">
                      {p.program_name}
                    </h4>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full bg-white ${cfg.tc}`}
                    >
                      {cfg.text}
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {p.trainee_id?.name || "-"}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Target className="w-4 h-4 mr-2" />
                    {p.trainee_id?.goal || "-"}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {p.academic_year_id
                      ? `ปี ${p.academic_year_id.academic_year} เทอม ${p.academic_year_id.semester}`
                      : "-"}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Dumbbell className="w-4 h-4 mr-2" />
                    {p.exercises?.length || 0} ท่า
                  </div>

                  {/* สถานะ */}
                  <div
                    className={`mt-2 p-2 ${cfg.bg} ${cfg.border} border rounded-lg text-xs ${cfg.tc} flex items-center`}
                  >
                    {p.status === "approved" && (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        อนุมัติแล้ว — ใช้งานได้ ✅
                      </>
                    )}
                    {p.status === "pending" && (
                      <>
                        <Clock className="w-3 h-3 mr-1" />
                        รออาจารย์อนุมัติ...
                      </>
                    )}
                    {p.status === "rejected" && (
                      <>
                        <XCircle className="w-3 h-3 mr-1" />
                        ไม่อนุมัติ — กรุณาแก้ไข
                      </>
                    )}
                    {p.status === "draft" && (
                      <>
                        <Send className="w-3 h-3 mr-1" />
                        แบบร่าง — ส่งอาจารย์เมื่อพร้อม
                      </>
                    )}
                  </div>

                  {p.instructor_comment && (
                    <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
                      <span className="font-semibold">💬 อาจารย์:</span>{" "}
                      {p.instructor_comment}
                    </div>
                  )}

                  {/* ปุ่ม */}
                  <div className="pt-3 border-t space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleView(p)}
                        className="bg-blue-100 text-blue-600 py-2 rounded-lg hover:bg-blue-200 flex items-center justify-center text-sm"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        ดู
                      </button>
                      <button
                        onClick={() => handleEdit(p)}
                        disabled={
                          p.status === "approved" || p.status === "pending"
                        }
                        className={`py-2 rounded-lg flex items-center justify-center text-sm ${
                          p.status === "approved" || p.status === "pending"
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-green-100 text-green-600 hover:bg-green-200"
                        }`}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        disabled={
                          p.status === "approved" || p.status === "pending"
                        }
                        className={`py-2 rounded-lg flex items-center justify-center text-sm ${
                          p.status === "approved" || p.status === "pending"
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-red-100 text-red-600 hover:bg-red-200"
                        }`}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        ลบ
                      </button>
                    </div>
                    {(p.status === "draft" || p.status === "rejected") && (
                      <button
                        onClick={() => handleSubmit(p)}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg flex items-center justify-center text-sm font-semibold"
                      >
                        <Send className="w-4 h-4 mr-1" />
                        ส่งให้อาจารย์ตรวจสอบ
                      </button>
                    )}
                    {p.status === "pending" && (
                      <button
                        onClick={() => handleCancel(p)}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg flex items-center justify-center text-sm font-semibold"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        ยกเลิกการส่ง
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===== Modal ===== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {modalMode === "add" && "📝 สร้างโปรแกรมการฝึกใหม่"}
                  {modalMode === "edit" && "✏️ แก้ไขโปรแกรมการฝึก"}
                  {modalMode === "view" && "👁️ รายละเอียดโปรแกรมการฝึก"}
                </h3>
                {activeYear && (
                  <p className="text-xs text-gray-500 mt-1">
                    ปีการศึกษา {activeYear.academic_year} ภาคเรียนที่{" "}
                    {activeYear.semester}
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* ชื่อโปรแกรม + ลูกเทรน */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อโปรแกรม <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.program_name}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        program_name: e.target.value,
                      }))
                    }
                    disabled={modalMode === "view"}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                    placeholder="เช่น โปรแกรมเพิ่มมวลกล้ามเนื้อ"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ผู้รับการฝึก <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.trainee_id}
                    onChange={(e) => {
                      const t = trainees.find((t) => t._id === e.target.value);
                      setFormData((p) => ({
                        ...p,
                        trainee_id: e.target.value,
                        goal: t?.goal || "",
                      }));
                    }}
                    disabled={modalMode === "view"}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                  >
                    <option value="">เลือกผู้รับการฝึก...</option>
                    {trainees.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* เป้าหมาย */}
              {formData.goal && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg flex items-center">
                  <Target className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-sm text-purple-700 font-medium">
                    เป้าหมาย: {formData.goal}
                  </span>
                </div>
              )}

              {/* เลือกท่าออกกำลังกาย */}
              {modalMode !== "view" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    เพิ่มท่าออกกำลังกาย <span className="text-red-500">*</span>
                  </label>
                  <div className="border border-gray-200 rounded-lg p-3 max-h-48 overflow-y-auto bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {exercises.map((ex) => {
                        const added = selectedExercises.find(
                          (e) => e.exercise_id === ex._id,
                        );
                        return (
                          <button
                            key={ex._id}
                            onClick={() => addExercise(ex)}
                            disabled={!!added}
                            className={`flex items-center p-2 rounded-lg text-left text-sm transition-colors ${
                              added
                                ? "bg-purple-100 border-2 border-purple-400 cursor-not-allowed opacity-60"
                                : "bg-white border-2 border-transparent hover:border-purple-300 hover:bg-purple-50"
                            }`}
                          >
                            <Dumbbell className="w-4 h-4 mr-2 text-purple-500 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-gray-800">
                                {ex.exercise_name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {ex.exercise_type} • {ex.equipment_type}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* รายการท่าที่เลือก */}
              {selectedExercises.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ท่าในโปรแกรม ({selectedExercises.length} ท่า)
                  </label>
                  <div className="space-y-2">
                    {selectedExercises.map((ex, index) => (
                      <div
                        key={ex.exercise_id}
                        className="border border-gray-200 rounded-lg p-3 bg-white"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {modalMode !== "view" && (
                              <div className="flex flex-col">
                                <button
                                  onClick={() => moveExercise(index, -1)}
                                  disabled={index === 0}
                                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs leading-none"
                                >
                                  ▲
                                </button>
                                <button
                                  onClick={() => moveExercise(index, 1)}
                                  disabled={
                                    index === selectedExercises.length - 1
                                  }
                                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs leading-none"
                                >
                                  ▼
                                </button>
                              </div>
                            )}
                            <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </span>
                            <div>
                              <p className="font-medium text-gray-800 text-sm">
                                {ex.name}
                              </p>
                              <p className="text-xs text-gray-500">{ex.type}</p>
                            </div>
                          </div>
                          {modalMode !== "view" && (
                            <button
                              onClick={() => removeExercise(ex.exercise_id)}
                              className="text-red-400 hover:text-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* sets / reps / rpe */}
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">
                              Sets
                            </label>
                            <input
                              type="number"
                              value={ex.sets}
                              onChange={(e) =>
                                updateExerciseField(
                                  ex.exercise_id,
                                  "sets",
                                  e.target.value,
                                )
                              }
                              disabled={modalMode === "view"}
                              className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-purple-400 disabled:bg-gray-100"
                              placeholder="3"
                              min="1"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">
                              Reps
                            </label>
                            <input
                              type="number"
                              value={ex.reps}
                              onChange={(e) =>
                                updateExerciseField(
                                  ex.exercise_id,
                                  "reps",
                                  e.target.value,
                                )
                              }
                              disabled={modalMode === "view"}
                              className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-purple-400 disabled:bg-gray-100"
                              placeholder="10"
                              min="1"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">
                              RPE (1-10)
                            </label>
                            <input
                              type="number"
                              value={ex.rpe}
                              onChange={(e) =>
                                updateExerciseField(
                                  ex.exercise_id,
                                  "rpe",
                                  e.target.value,
                                )
                              }
                              disabled={modalMode === "view"}
                              className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-purple-400 disabled:bg-gray-100"
                              placeholder="7"
                              min="1"
                              max="10"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* สถานะ + ความเห็นอาจารย์ (view) */}
              {modalMode === "view" && selectedProgram && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">
                      สถานะ:
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_CONFIG[selectedProgram.status]?.bg} ${STATUS_CONFIG[selectedProgram.status]?.tc}`}
                    >
                      {STATUS_CONFIG[selectedProgram.status]?.text}
                    </span>
                  </div>
                  {selectedProgram.instructor_comment && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-semibold text-blue-800 mb-1">
                        💬 ความเห็นจากอาจารย์:
                      </p>
                      <p className="text-sm text-blue-700">
                        {selectedProgram.instructor_comment}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ปุ่ม */}
              <div className="flex space-x-3 pt-4 border-t">
                {modalMode !== "view" && (
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>กำลังบันทึก...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>บันทึก</span>
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold"
                >
                  {modalMode === "view" ? "ปิด" : "ยกเลิก"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerPrograms;
