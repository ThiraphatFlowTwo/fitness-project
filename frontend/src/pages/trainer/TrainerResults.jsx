import React, { useState, useEffect, useRef } from "react";
import {
  Save,
  User,
  Target,
  Dumbbell,
  Plus,
  X,
  Search,
  Clock,
  Check,
  Loader2,
  Calendar,
  AlertCircle,
  CheckCircle,
  HelpCircle,
} from "lucide-react";

const API = "http://localhost:5000/api/logs";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
};

const getFieldConfig = (category) => {
  switch (category) {
    case "cardio":
      return [
        {
          field: "weight",
          label: "ระยะทาง",
          unit: "km",
          placeholder: "0.0",
          step: "0.1",
        },
        {
          field: "reps",
          label: "เวลา",
          unit: "นาที",
          placeholder: "0",
          step: "1",
        },
      ];
    case "bodyweight":
      return [
        {
          field: "weight",
          label: "เวลา",
          unit: "วินาที",
          placeholder: "0",
          step: "1",
        },
        {
          field: "reps",
          label: "ครั้ง",
          unit: "ครั้ง",
          placeholder: "0",
          step: "1",
        },
      ];
    case "duration":
      return [
        {
          field: "weight",
          label: "เวลา",
          unit: "วินาที",
          placeholder: "0",
          step: "1",
        },
      ];
    default:
      return [
        {
          field: "weight",
          label: "น้ำหนัก",
          unit: "kg",
          placeholder: "0",
          step: "0.5",
        },
        {
          field: "reps",
          label: "ครั้ง",
          unit: "ครั้ง",
          placeholder: "0",
          step: "1",
        },
      ];
  }
};

const DRAFT_KEY = "trainer_results_draft";

// ── Unified Action Modal (แทน alert() / confirm()) ─────────────
function ActionModal({ state, onClose }) {
  if (!state.open) return null;

  const isConfirm = state.mode === "confirm";

  const styles = {
    error: { icon: <AlertCircle className="w-5 h-5" />, bg: "bg-rose-400/15 text-rose-300" },
    success: { icon: <CheckCircle className="w-5 h-5" />, bg: "bg-emerald-400/15 text-emerald-300" },
    warning: { icon: <AlertCircle className="w-5 h-5" />, bg: "bg-amber-400/15 text-amber-300" },
    confirm: { icon: <HelpCircle className="w-5 h-5" />, bg: "bg-amber-400/15 text-amber-300" },
  };
  const s = styles[state.type] || styles.error;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center px-4"
      style={{ animation: "fadeIn 0.2s ease-out" }}
    >
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={() => !isConfirm && onClose(true)}
      />

      <div
        className="relative w-full max-w-sm rounded-3xl bg-slate-900/95 border border-white/10 shadow-2xl p-6 text-white"
        style={{ animation: "popIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
      >
        <div className="flex items-start gap-3 mb-1">
          <div className={`w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center ${s.bg}`}>
            {s.icon}
          </div>
          <div className="pt-1.5">
            <p className="font-bold text-sm leading-snug">{state.title}</p>
          </div>
        </div>

        {state.message && (
          <p className="text-slate-300 text-sm leading-relaxed mt-3 whitespace-pre-line pl-[3.5rem] -mt-1">
            {state.message}
          </p>
        )}

        {isConfirm ? (
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => onClose(false)}
              className="flex-1 py-3 rounded-2xl font-bold text-sm bg-white/10 hover:bg-white/15
                         active:scale-95 transition-all"
            >
              ยกเลิก
            </button>
            <button
              onClick={() => onClose(true)}
              className="flex-1 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-blue-600 to-violet-600
                         shadow-lg shadow-blue-500/25 hover:opacity-90 active:scale-95 transition-all"
            >
              ตกลง
            </button>
          </div>
        ) : (
          <button
            onClick={() => onClose(true)}
            className="w-full mt-6 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-blue-600 to-violet-600
                       shadow-lg shadow-blue-500/25 hover:opacity-90 active:scale-95 transition-all"
          >
            ตกลง
          </button>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.92) translateY(8px) } to { opacity: 1; transform: scale(1) translateY(0) } }
      `}</style>
    </div>
  );
}

const TrainerResults = () => {
  const loadDraft = () => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  };
  const draft = loadDraft();

  const [approvedPrograms, setApprovedPrograms] = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [saving,           setSaving]           = useState(false);
  const [error,            setError]            = useState("");
  const [selectedProgram,  setSelectedProgram]  = useState(draft?.selectedProgram ?? null);
  const [trainingDate,     setTrainingDate]     = useState(draft?.trainingDate ?? new Date().toISOString().split("T")[0]);
  const [logNote,          setLogNote]          = useState(draft?.logNote ?? "");
  const [workoutSessions,  setWorkoutSessions]  = useState(draft?.workoutSessions ?? []);
  const [isExerciseModal,  setIsExerciseModal]  = useState(false);
  const [exSearch,         setExSearch]         = useState("");
  const [exMuscleFilter,   setExMuscleFilter]   = useState("");
  const [exEquipFilter,    setExEquipFilter]    = useState("");
  const [timerSeconds,     setTimerSeconds]     = useState(draft?.timerSeconds ?? 0);
  const [isTimerRunning,   setIsTimerRunning]   = useState(false);
  const [photoFile,        setPhotoFile]        = useState(null);
  const [photoPreview,     setPhotoPreview]     = useState(null);

  // ── Modal state + helper functions (แทน alert()/confirm()) ──
  const [modalState, setModalState] = useState({ open: false });
  const resolveRef = useRef(null);

  const showAlert = (title, message = "", type = "error") =>
    new Promise((resolve) => {
      resolveRef.current = resolve;
      setModalState({ open: true, mode: "alert", type, title, message });
    });

  const showConfirm = (title, message = "") =>
    new Promise((resolve) => {
      resolveRef.current = resolve;
      setModalState({ open: true, mode: "confirm", type: "confirm", title, message });
    });

  const closeModal = (result) => {
    setModalState((s) => ({ ...s, open: false }));
    if (resolveRef.current) {
      resolveRef.current(result);
      resolveRef.current = null;
    }
  };

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await fetch(`${API}/approved-programs`, {
          headers: authHeaders(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "โหลดโปรแกรมไม่สำเร็จ");
        setApprovedPrograms(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "โหลดโปรแกรมไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  useEffect(() => {
    let interval;
    if (isTimerRunning)
      interval = setInterval(() => setTimerSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    const hasUnsavedData = workoutSessions.length > 0;
    const handleBeforeUnload = (e) => {
      if (!hasUnsavedData) return;
      e.preventDefault();
      e.returnValue = "";
      return "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [workoutSessions]);

  useEffect(() => {
    if (workoutSessions.length === 0) {
      localStorage.removeItem(DRAFT_KEY);
      return;
    }
    const draftData = { selectedProgram, trainingDate, logNote, workoutSessions, timerSeconds };
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
    } catch {}
  }, [selectedProgram, trainingDate, logNote, workoutSessions, timerSeconds]);

  const formatTime = (s) => {
    const h = Math.floor(s / 3600),
      m = Math.floor((s % 3600) / 60),
      sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleProgramSelect = async (e) => {
    const id = e.target.value;
    const selectEl = e.target;

    if (!id) {
      setSelectedProgram(null);
      setWorkoutSessions([]);
      setTimerSeconds(0);
      setIsTimerRunning(false);
      return;
    }

    const program = approvedPrograms.find((p) => p._id === id);

    // 📝 popup ถามผู้ใช้ก่อนเริ่มการฝึก
    const confirmStart = await showConfirm(
      `เริ่มการฝึกโปรแกรม "${program.program_name}"?`,
      "ระบบจะเริ่มนับเวลาทันที"
    );

    // ถ้าผู้ใช้กด "ยกเลิก" ให้รีเซ็ตค่าซีเล็คกลับเป็นค่าว่างแล้วหยุดทำงาน
    if (!confirmStart) {
      selectEl.value = "";
      return;
    }

    // ถ้ากด "ตกลง" ถึงจะทำงานต่อและเริ่มจับเวลา
    setSelectedProgram(program);
    setWorkoutSessions(
      (program.exercises || []).map((ex) => ({
        exercise_id: ex.exercise_id?._id || ex.exercise_id,
        exercise_name: ex.exercise_id?.exercise_name || "",
        exercise_type: ex.exercise_id?.exercise_type || "",
        equipment: ex.exercise_id?.equipment_type || "",
        exercise_category: ex.exercise_id?.exercise_category || "weight",
        order: ex.order || 1,
        note: "",
        sets: [
          { set_number: 1, weight: "", reps: "", rpe: "", completed: false },
        ],
      })),
    );
    setLogNote("");
    setTimerSeconds(0);
    setIsTimerRunning(true);
  };
  
  const addSet = (exercise_id) =>
    setWorkoutSessions((prev) =>
      prev.map((s) =>
        s.exercise_id === exercise_id
          ? {
              ...s,
              sets: [
                ...s.sets,
                {
                  set_number: s.sets.length + 1,
                  weight: "",
                  reps: "",
                  rpe: "",
                  completed: false,
                },
              ],
            }
          : s,
      ),
    );

  const removeSet = (exercise_id, set_number) =>
    setWorkoutSessions((prev) =>
      prev.map((s) =>
        s.exercise_id === exercise_id
          ? {
              ...s,
              sets: s.sets
                .filter((st) => st.set_number !== set_number)
                .map((st, i) => ({ ...st, set_number: i + 1 })),
            }
          : s,
      ),
    );

  const updateSet = (exercise_id, set_number, field, value) =>
    setWorkoutSessions((prev) =>
      prev.map((s) =>
        s.exercise_id === exercise_id
          ? {
              ...s,
              sets: s.sets.map((st) =>
                st.set_number === set_number ? { ...st, [field]: value } : st,
              ),
            }
          : s,
      ),
    );

  const updateSessionNote = (exercise_id, value) =>
    setWorkoutSessions((prev) =>
      prev.map((s) =>
        s.exercise_id === exercise_id ? { ...s, note: value } : s,
      ),
    );

  const removeExercise = (exercise_id) =>
    setWorkoutSessions((prev) =>
      prev.filter((s) => s.exercise_id !== exercise_id),
    );

  const allExercises = selectedProgram?.exercises || [];
  const muscleTypes = [
    ...new Set(
      allExercises.map((e) => e.exercise_id?.exercise_type).filter(Boolean),
    ),
  ];
  const equipTypes = [
    ...new Set(
      allExercises.map((e) => e.exercise_id?.equipment_type).filter(Boolean),
    ),
  ];

  const filteredModal = allExercises.filter((ex) => {
    const name = ex.exercise_id?.exercise_name || "";
    return (
      name.toLowerCase().includes(exSearch.toLowerCase()) &&
      (!exMuscleFilter || ex.exercise_id?.exercise_type === exMuscleFilter) &&
      (!exEquipFilter || ex.exercise_id?.equipment_type === exEquipFilter)
    );
  });

  const isExerciseAdded = (exercise_id) =>
    workoutSessions.some(
      (s) => s.exercise_id === (exercise_id?._id || exercise_id),
    );

  const toggleExerciseInModal = (ex) => {
    const exId = ex.exercise_id?._id || ex.exercise_id;
    if (isExerciseAdded(exId)) {
      removeExercise(exId);
      return;
    }
    setWorkoutSessions((prev) => [
      ...prev,
      {
        exercise_id: exId,
        exercise_name: ex.exercise_id?.exercise_name || "",
        exercise_type: ex.exercise_id?.exercise_type || "",
        equipment: ex.exercise_id?.equipment_type || "",
        exercise_category: ex.exercise_id?.exercise_category || "weight",
        order: prev.length + 1,
        note: "",
        sets: [
          { set_number: 1, weight: "", reps: "", rpe: "", completed: false },
        ],
      },
    ]);
  };

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      await showAlert("ไฟล์ไม่ถูกต้อง", "กรุณาเลือกไฟล์รูปภาพเท่านั้น");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      await showAlert("ไฟล์ใหญ่เกินไป", "ขนาดรูปต้องไม่เกิน 5MB");
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleSave = async () => {
    if (!selectedProgram) {
      await showAlert("ยังไม่ได้เลือกโปรแกรม", "กรุณาเลือกโปรแกรมก่อนบันทึก", "warning");
      return;
    }
    if (workoutSessions.length === 0) {
      await showAlert("ยังไม่มีท่าออกกำลังกาย", "กรุณาเลือกท่าอย่างน้อย 1 ท่า", "warning");
      return;
    }

    const completedSets = workoutSessions.flatMap(s => s.sets).filter(st => st.completed).length;
    if (completedSets === 0) {
      const proceed = await showConfirm("ยังไม่มีเซตที่ทำเสร็จ", "ต้องการบันทึกหรือไม่?");
      if (!proceed) return;
    }
    if (!photoFile) {
      const proceed = await showConfirm("ยังไม่ได้แนบรูปยืนยันการฝึก", "ต้องการบันทึกโดยไม่มีรูปหรือไม่?");
      if (!proceed) return;
    }

    setSaving(true);
    try {
      const sets = workoutSessions.flatMap((session) =>
        session.sets.map((st) => ({
          exercise_id: session.exercise_id,
          order: session.order,
          set_number: st.set_number,
          weight: st.weight ? Number(st.weight) : null,
          reps: st.reps ? Number(st.reps) : null,
          rpe: st.rpe ? Number(st.rpe) : null,
          completed: st.completed,
          note: session.note,
        })),
      );

      const formData = new FormData();
      formData.append("program_id",    selectedProgram._id);
      formData.append("trainee_id",    selectedProgram.trainee_id?._id || selectedProgram.trainee_id);
      formData.append("training_date", trainingDate);
      formData.append("duration",      timerSeconds);
      formData.append("note",          logNote);
      formData.append("sets",          JSON.stringify(sets));
      if (photoFile) formData.append("photo", photoFile);

      // ✅ แก้ไขตรงนี้: ดึง token จาก localStorage ตรงๆ
      const token = localStorage.getItem("token");
      const res = await fetch(API, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        await showAlert("บันทึกไม่สำเร็จ", data.message || "", "error");
        return;
      }
      await showAlert(
        "บันทึกผลการฝึกสำเร็จ!",
        `โปรแกรม: ${selectedProgram.program_name}\nเวลา: ${formatTime(timerSeconds)}`,
        "success"
      );

      // ล้างค่าหลังจากบันทึกเสร็จ
      localStorage.removeItem(DRAFT_KEY);
      setSelectedProgram(null);
      setWorkoutSessions([]);
      setTimerSeconds(0);
      setIsTimerRunning(false);
      setLogNote("");
      removePhoto();
    } catch {
      await showAlert("เกิดข้อผิดพลาด", "", "error");
    }
    finally  { setSaving(false); }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-2 text-gray-600">กำลังโหลดข้อมูล...</span>
      </div>
    );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
          📝 บันทึกผลการฝึก
        </h3>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
            {error}
          </div>
        )}

        {/* เลือกโปรแกรม */}
        <div className="mb-4 md:mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            เลือกโปรแกรมการฝึก <span className="text-red-500">*</span>
            <span className="text-xs text-gray-400 ml-2">(แสดงเฉพาะที่อนุมัติแล้ว)</span>
          </label>
          {approvedPrograms.length === 0 ? (
            <div className="p-3 md:p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
              ⚠️ ยังไม่มีโปรแกรมที่อนุมัติแล้ว กรุณาสร้างและส่งอาจารย์อนุมัติก่อน
            </div>
          ) : (
            <select
              value={selectedProgram?._id || ""}
              onChange={handleProgramSelect}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 md:px-4 focus:ring-2 focus:ring-purple-500 text-sm md:text-base"
            >
              <option value="">-- เลือกโปรแกรม --</option>
              {approvedPrograms.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.program_name} — {p.trainee_id?.name || "-"}
                </option>
              ))}
            </select>
          )}
        </div>

        {selectedProgram && (
          <>
            {/* Info bar + Timer */}
            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-purple-50 border border-purple-200 rounded-xl">
              <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
                <div className="flex flex-wrap items-center gap-3">
                  {[
                    { icon: User, text: selectedProgram.trainee_id?.name },
                    { icon: Target, text: selectedProgram.trainee_id?.goal },
                    { icon: Dumbbell, text: `${selectedProgram.exercises?.length || 0} ท่า` },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center space-x-1.5">
                      <Icon className="w-4 h-4 text-purple-600 shrink-0" />
                      <span className="text-sm text-gray-700">{text}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="text-xl md:text-2xl font-bold font-mono text-purple-700">
                    {formatTime(timerSeconds)}
                  </span>
                  <button
                    onClick={() => setIsTimerRunning((r) => !r)}
                    className={`px-2 py-1 rounded-lg text-xs md:text-sm font-semibold ${
                      isTimerRunning
                        ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {isTimerRunning ? "หยุด" : "เริ่ม"}
                  </button>
                </div>
              </div>
            </div>

            {/* วันที่ + ปุ่มจัดการท่า */}
            <div className="mb-4 md:mb-6 flex flex-wrap justify-between items-end gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  วันที่ฝึก
                </label>
                <input
                  type="date"
                  value={trainingDate}
                  onChange={(e) => setTrainingDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 md:px-4 focus:ring-2 focus:ring-purple-500 text-sm md:text-base"
                />
              </div>
              <button
                onClick={() => setIsExerciseModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 md:px-4 rounded-lg flex items-center space-x-1.5 text-sm md:text-base"
              >
                <Plus className="w-4 h-4 md:w-5 md:h-5" />
                <span>จัดการท่า</span>
              </button>
            </div>

            {/* Workout sessions */}
            {workoutSessions.length === 0 ? (
              <div className="text-center py-10 md:py-12 border-2 border-dashed border-gray-300 rounded-lg mb-4 md:mb-6">
                <Dumbbell className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm md:text-base">กดปุ่ม "จัดการท่า" เพื่อเริ่มบันทึก</p>
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                {workoutSessions
                  .sort((a, b) => a.order - b.order)
                  .map((session) => {
                    const fields = getFieldConfig(session.exercise_category);
                    const gridCols = `40px repeat(${fields.length}, 1fr) 60px 50px`;

                    return (
                      <div key={session.exercise_id} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                        <div className="flex justify-between items-center p-3 md:p-4 bg-white border-b border-gray-100">
                          <div>
                            <h4 className="font-bold text-gray-800 text-sm md:text-base">{session.exercise_name}</h4>
                            <div className="flex gap-1.5 mt-1 flex-wrap">
                              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{session.exercise_type}</span>
                              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{session.equipment}</span>
                            </div>
                          </div>
                          <button onClick={() => removeExercise(session.exercise_id)} className="text-red-400 hover:text-red-600 ml-2">
                            <X className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                        </div>

                        <div className="p-3 md:p-4 overflow-x-auto">
                          <div className="grid gap-1.5 text-xs font-semibold text-gray-500 mb-2 px-1 min-w-[320px]" style={{ gridTemplateColumns: gridCols }}>
                            <span>เซต</span>
                            {fields.map((f) => (
                              <span key={f.field} className="text-center">{f.label}({f.unit})</span>
                            ))}
                            <span className="text-center">RPE</span>
                            <span className="text-center">✓</span>
                          </div>

                          {session.sets.map((set, idx) => (
                            <div key={idx} className="grid gap-1.5 items-center mb-2 min-w-[320px]" style={{ gridTemplateColumns: gridCols }}>
                              <div className="flex items-center space-x-0.5">
                                <span className="w-5 h-5 md:w-6 md:h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                                  {set.set_number}
                                </span>
                                {session.sets.length > 1 && (
                                  <button onClick={() => removeSet(session.exercise_id, set.set_number)} className="text-gray-300 hover:text-red-400">
                                    <X className="w-2.5 h-2.5" />
                                  </button>
                                )}
                              </div>
                              {fields.map((f) => (
                                <input
                                  key={f.field}
                                  type="number"
                                  value={set[f.field]}
                                  onChange={(e) => updateSet(session.exercise_id, set.set_number, f.field, e.target.value)}
                                  className={`border rounded-lg px-1 py-1.5 text-center text-xs md:text-sm focus:ring-1 focus:ring-purple-400 ${set.completed ? "bg-green-50 border-green-200" : "border-gray-200"}`}
                                  placeholder={f.placeholder}
                                  step={f.step}
                                  min="0"
                                />
                              ))}
                              <input
                                type="number"
                                value={set.rpe}
                                onChange={(e) => updateSet(session.exercise_id, set.set_number, "rpe", e.target.value)}
                                className={`border rounded-lg px-1 py-1.5 text-center text-xs md:text-sm focus:ring-1 focus:ring-purple-400 ${set.completed ? "bg-green-50 border-green-200" : "border-gray-200"}`}
                                placeholder="1-10"
                                min="1"
                                max="10"
                              />
                              <div className="flex justify-center">
                                <button
                                  onClick={() => updateSet(session.exercise_id, set.set_number, "completed", !set.completed)}
                                  className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center transition-colors ${set.completed ? "bg-green-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                                >
                                  {set.completed && <Check className="w-3 h-3 md:w-4 md:h-4" />}
                                </button>
                              </div>
                            </div>
                          ))}

                          <button onClick={() => addSet(session.exercise_id)} className="w-full mt-2 bg-white border-2 border-dashed border-gray-300 hover:border-purple-400 text-gray-500 hover:text-purple-600 py-1.5 md:py-2 rounded-lg flex items-center justify-center text-xs md:text-sm transition-colors">
                            <Plus className="w-3.5 h-3.5 mr-1" /> เพิ่มเซต
                          </button>

                          <input
                            type="text"
                            value={session.note}
                            onChange={(e) => updateSessionNote(session.exercise_id, e.target.value)}
                            className="w-full mt-2 border border-gray-200 rounded-lg px-3 py-1.5 text-xs md:text-sm text-gray-600 placeholder-gray-400 focus:ring-1 focus:ring-purple-400"
                            placeholder="หมายเหตุสำหรับท่านี้..."
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* หมายเหตุรวม */}
            {workoutSessions.length > 0 && (
              <div className="mb-4 md:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">📝 หมายเหตุรวม</label>
                <textarea
                  value={logNote}
                  onChange={(e) => setLogNote(e.target.value)}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 md:px-4 focus:ring-2 focus:ring-purple-500 resize-none text-xs md:text-sm"
                  placeholder="เช่น วันนี้รู้สึกเหนื่อยมาก / ปรับน้ำหนักลง..."
                />
              </div>
            )}

            {/* แนบรูปยืนยันการฝึก */}
            {workoutSessions.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">📷 รูปยืนยันการฝึก</label>
                {photoPreview ? (
                  <div className="relative inline-block">
                    <img src={photoPreview} alt="รูปยืนยันการฝึก" className="w-48 h-48 object-cover rounded-xl border border-gray-200 shadow-sm" />
                    <button type="button" onClick={removePhoto} className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-48 h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors text-gray-400">
                    <Plus className="w-8 h-8 mb-1" />
                    <span className="text-xs font-medium">ถ่าย / เลือกรูป</span>
                    <input type="file" accept="image/*" capture="environment" onChange={handlePhotoSelect} className="hidden" />
                  </label>
                )}
                <p className="text-xs text-gray-400 mt-1.5">แนบรูปขณะฝึกซ้อมเพื่อยืนยันว่ามีการเทรนจริง (ไม่เกิน 5MB)</p>
              </div>
            )}

            {/* ปุ่มบันทึก */}
            {workoutSessions.length > 0 && (
              <div className="flex justify-end space-x-2 md:space-x-3 pt-3 md:pt-4 border-t">
                <button
                  onClick={async () => {
                    const ok = await showConfirm("ยกเลิกการบันทึก", "ยกเลิกการบันทึกใช่หรือไม่?");
                    if (!ok) return;
                    localStorage.removeItem(DRAFT_KEY);
                    setSelectedProgram(null);
                    setWorkoutSessions([]);
                    setTimerSeconds(0);
                    setIsTimerRunning(false);
                    setLogNote("");
                    removePhoto();
                  }}
                  className="px-4 md:px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold text-sm md:text-base"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 md:px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold flex items-center space-x-1.5 disabled:opacity-60 text-sm md:text-base"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>กำลังบันทึก...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 md:w-5 md:h-5" />
                      <span>บันทึกผลการฝึก</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal จัดการท่า */}
      {isExerciseModal && selectedProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 md:p-4">
          <div className="bg-gray-900 text-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-4 md:p-5 border-b border-gray-700 flex justify-between items-center">
              <div>
                <h3 className="text-base md:text-lg font-bold">จัดการท่าออกกำลังกาย</h3>
                <p className="text-xs text-gray-400 mt-0.5">เลือกแล้ว {workoutSessions.length} ท่า</p>
              </div>
              <button onClick={() => setIsExerciseModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            <div className="p-3 md:p-4 border-b border-gray-700 space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={exSearch}
                  onChange={(e) => setExSearch(e.target.value)}
                  placeholder="ค้นหาท่า..."
                  className="w-full bg-gray-800 text-white pl-9 pr-4 py-2 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={exMuscleFilter}
                  onChange={(e) => setExMuscleFilter(e.target.value)}
                  className="bg-gray-800 text-white border border-gray-700 rounded-lg px-2 py-1.5 text-xs outline-none"
                >
                  <option value="">กลุ่มกล้ามเนื้อทั้งหมด</option>
                  {muscleTypes.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select
                  value={exEquipFilter}
                  onChange={(e) => setExEquipFilter(e.target.value)}
                  className="bg-gray-800 text-white border border-gray-700 rounded-lg px-2 py-1.5 text-xs outline-none"
                >
                  <option value="">อุปกรณ์ทั้งหมด</option>
                  {equipTypes.map(eq => <option key={eq} value={eq}>{eq}</option>)}
                </select>
              </div>
            </div>

            <div className="p-2 overflow-y-auto flex-1 space-y-1">
              {filteredModal.length === 0 ? (
                <p className="text-center py-6 text-gray-500 text-sm">ไม่พบท่าที่ตรงกับเงื่อนไข</p>
              ) : (
                filteredModal.map((ex) => {
                  const exId = ex.exercise_id?._id || ex.exercise_id;
                  const added = isExerciseAdded(exId);
                  return (
                    <div key={exId} className="flex justify-between items-center p-2.5 hover:bg-gray-800 rounded-lg transition-colors">
                      <div>
                        <p className="font-medium text-sm">{ex.exercise_id?.exercise_name}</p>
                        <p className="text-xs text-gray-400">{ex.exercise_id?.exercise_type} · {ex.exercise_id?.equipment_type}</p>
                      </div>
                      <button
                        onClick={() => toggleExerciseInModal(ex)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          added ? "bg-red-600 text-white hover:bg-red-700" : "bg-purple-600 text-white hover:bg-purple-700"
                        }`}
                      >
                        {added ? "นำออก" : "เลือก"}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 border-t border-gray-700 flex justify-end">
              <button onClick={() => setIsExerciseModal(false)} className="bg-gray-800 hover:bg-gray-700 px-5 py-2 rounded-lg text-sm font-semibold">
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Action Modal (alert / confirm ทั้งหมดในหน้านี้) ── */}
      <ActionModal state={modalState} onClose={closeModal} />
    </div>
  );
};

export default TrainerResults;
