import React, { useState, useEffect } from "react";
import {
  Save, User, Target, Dumbbell, Plus, X,
  Search, Clock, Check, Loader2, Calendar, AlertCircle,
} from "lucide-react";

const API = "http://localhost:5000/api/logs";
const getToken    = () => localStorage.getItem("token");
const authHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login"; // ✅ redirect ถ้าไม่มี token
    return {};
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const getFieldConfig = (category) => {
  switch (category) {
    case "cardio":
      return [
        { field: "weight", label: "ระยะทาง", unit: "km",    placeholder: "0.0", step: "0.1" },
        { field: "reps",   label: "เวลา",     unit: "นาที",  placeholder: "0",   step: "1"   },
      ];
    case "bodyweight":
      return [
        { field: "weight", label: "เวลา",  unit: "วินาที", placeholder: "0", step: "1" },
        { field: "reps",   label: "ครั้ง", unit: "ครั้ง",  placeholder: "0", step: "1" },
      ];
    case "duration":
      return [
        { field: "weight", label: "เวลา", unit: "วินาที", placeholder: "0", step: "1" },
      ];
    default:
      return [
        { field: "weight", label: "น้ำหนัก", unit: "kg",    placeholder: "0", step: "0.5" },
        { field: "reps",   label: "ครั้ง",   unit: "ครั้ง", placeholder: "0", step: "1"   },
      ];
  }
};

const TrainerResults = () => {
  const [approvedPrograms, setApprovedPrograms] = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [saving,           setSaving]           = useState(false);
  const [error,            setError]            = useState("");
  const [selectedProgram,  setSelectedProgram]  = useState(null);
  const [trainingDate,     setTrainingDate]      = useState(new Date().toISOString().split("T")[0]);
  const [logNote,          setLogNote]          = useState("");
  const [workoutSessions,  setWorkoutSessions]  = useState([]);
  const [isExerciseModal,  setIsExerciseModal]  = useState(false);
  const [exSearch,         setExSearch]         = useState("");
  const [exMuscleFilter,   setExMuscleFilter]   = useState("");
  const [exEquipFilter,    setExEquipFilter]    = useState("");
  const [timerSeconds,     setTimerSeconds]     = useState(0);
  const [isTimerRunning,   setIsTimerRunning]   = useState(false);

  // ── โหลดโปรแกรมที่อนุมัติแล้ว ─────────────────────────────────
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res  = await fetch(`${API}/approved-programs`, { headers: authHeaders() });
        const data = await res.json();
        setApprovedPrograms(Array.isArray(data) ? data : []);
      } catch {
        setError("โหลดโปรแกรมไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  // ── Timer ─────────────────────────────────────────────────────
  useEffect(() => {
    let interval;
    if (isTimerRunning) interval = setInterval(() => setTimerSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (s) => {
    const h   = Math.floor(s / 3600);
    const m   = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  };

  // ── เลือกโปรแกรม ──────────────────────────────────────────────
  const handleProgramSelect = (e) => {
    const id = e.target.value;
    if (!id) {
      setSelectedProgram(null);
      setWorkoutSessions([]);
      setTimerSeconds(0);
      setIsTimerRunning(false);
      return;
    }
    const program  = approvedPrograms.find(p => p._id === id);
    setSelectedProgram(program);
    const sessions = (program.exercises || []).map(ex => ({
      exercise_id:       ex.exercise_id?._id || ex.exercise_id,
      exercise_name:     ex.exercise_id?.exercise_name || "",
      exercise_type:     ex.exercise_id?.exercise_type || "",
      equipment:         ex.exercise_id?.equipment_type || "",
      exercise_category: ex.exercise_id?.exercise_category || "weight",
      order:             ex.order || 1,
      note:              "",
      sets: [{ set_number: 1, weight: "", reps: "", rpe: "", completed: false }],
    }));
    setWorkoutSessions(sessions);
    setLogNote("");
    setTimerSeconds(0);
    setIsTimerRunning(true);
  };

  // ── จัดการ sessions ───────────────────────────────────────────
  const addSet = (exercise_id) => {
    setWorkoutSessions(prev => prev.map(s =>
      s.exercise_id === exercise_id
        ? { ...s, sets: [...s.sets, { set_number: s.sets.length + 1, weight: "", reps: "", rpe: "", completed: false }] }
        : s
    ));
  };

  const removeSet = (exercise_id, set_number) => {
    setWorkoutSessions(prev => prev.map(s =>
      s.exercise_id === exercise_id
        ? { ...s, sets: s.sets.filter(st => st.set_number !== set_number).map((st, i) => ({ ...st, set_number: i + 1 })) }
        : s
    ));
  };

  const updateSet = (exercise_id, set_number, field, value) => {
    setWorkoutSessions(prev => prev.map(s =>
      s.exercise_id === exercise_id
        ? { ...s, sets: s.sets.map(st => st.set_number === set_number ? { ...st, [field]: value } : st) }
        : s
    ));
  };

  const updateSessionNote = (exercise_id, value) => {
    setWorkoutSessions(prev => prev.map(s =>
      s.exercise_id === exercise_id ? { ...s, note: value } : s
    ));
  };

  const removeExercise = (exercise_id) => {
    setWorkoutSessions(prev => prev.filter(s => s.exercise_id !== exercise_id));
  };

  // ── Modal ─────────────────────────────────────────────────────
  const allExercises  = selectedProgram?.exercises || [];
  const muscleTypes   = [...new Set(allExercises.map(e => e.exercise_id?.exercise_type).filter(Boolean))];
  const equipTypes    = [...new Set(allExercises.map(e => e.exercise_id?.equipment_type).filter(Boolean))];

  const filteredModal = allExercises.filter(ex => {
    const name = ex.exercise_id?.exercise_name || "";
    return (
      name.toLowerCase().includes(exSearch.toLowerCase()) &&
      (!exMuscleFilter || ex.exercise_id?.exercise_type   === exMuscleFilter) &&
      (!exEquipFilter  || ex.exercise_id?.equipment_type  === exEquipFilter)
    );
  });

  const isExerciseAdded = (exercise_id) =>
    workoutSessions.some(s => s.exercise_id === (exercise_id?._id || exercise_id));

  const toggleExerciseInModal = (ex) => {
    const exId = ex.exercise_id?._id || ex.exercise_id;
    if (isExerciseAdded(exId)) {
      removeExercise(exId);
    } else {
      setWorkoutSessions(prev => [...prev, {
        exercise_id:       exId,
        exercise_name:     ex.exercise_id?.exercise_name || "",
        exercise_type:     ex.exercise_id?.exercise_type || "",
        equipment:         ex.exercise_id?.equipment_type || "",
        exercise_category: ex.exercise_id?.exercise_category || "weight",
        order:             prev.length + 1,
        note:              "",
        sets: [{ set_number: 1, weight: "", reps: "", rpe: "", completed: false }],
      }]);
    }
  };

  // ── บันทึก ────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!selectedProgram)        { alert("กรุณาเลือกโปรแกรม"); return; }
    if (workoutSessions.length === 0) { alert("กรุณาเลือกท่าอย่างน้อย 1 ท่า"); return; }

    const completedSets = workoutSessions.flatMap(s => s.sets).filter(st => st.completed).length;
    if (completedSets === 0 && !window.confirm("ยังไม่มีเซตที่ทำเสร็จ ต้องการบันทึกหรือไม่?")) return;

    setSaving(true);
    try {
      const sets = workoutSessions.flatMap(session =>
        session.sets.map(st => ({
          exercise_id: session.exercise_id,
          order:       session.order,
          set_number:  st.set_number,
          weight:      st.weight ? Number(st.weight) : null,
          reps:        st.reps   ? Number(st.reps)   : null,
          rpe:         st.rpe    ? Number(st.rpe)    : null,
          completed:   st.completed,
          note:        session.note,
        }))
      );

      const res  = await fetch(API, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          program_id:    selectedProgram._id,
          trainee_id:    selectedProgram.trainee_id?._id || selectedProgram.trainee_id,
          training_date: trainingDate,
          duration:      timerSeconds,
          note:          logNote,
          sets,
        }),
      });
      const data = await res.json();
      if (!res.ok) { alert(`บันทึกไม่สำเร็จ: ${data.message}`); return; }

      alert(`✅ บันทึกผลการฝึกสำเร็จ!\nโปรแกรม: ${selectedProgram.program_name}\nเวลา: ${formatTime(timerSeconds)}`);
      setSelectedProgram(null);
      setWorkoutSessions([]);
      setTimerSeconds(0);
      setIsTimerRunning(false);
      setLogNote("");
    } catch { alert("เกิดข้อผิดพลาด"); }
    finally  { setSaving(false); }
  };

  // ── Render ────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      <span className="ml-2 text-gray-600">กำลังโหลดข้อมูล...</span>
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">📝 บันทึกผลการฝึก</h3>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 mr-2" />{error}
          </div>
        )}

        {/* เลือกโปรแกรม */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            เลือกโปรแกรมการฝึก <span className="text-red-500">*</span>
            <span className="text-xs text-gray-400 ml-2">(แสดงเฉพาะที่อนุมัติแล้ว)</span>
          </label>
          {approvedPrograms.length === 0 ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
              ⚠️ ยังไม่มีโปรแกรมที่อนุมัติแล้ว กรุณาสร้างและส่งอาจารย์อนุมัติก่อน
            </div>
          ) : (
            <select value={selectedProgram?._id || ""} onChange={handleProgramSelect}
              className="w-full md:w-2/3 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500">
              <option value="">-- เลือกโปรแกรม --</option>
              {approvedPrograms.map(p => (
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
            <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-xl">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-gray-800">{selectedProgram.trainee_id?.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-600">{selectedProgram.trainee_id?.goal}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Dumbbell className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-600">{selectedProgram.exercises?.length || 0} ท่า</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span className="text-2xl font-bold font-mono text-purple-700">{formatTime(timerSeconds)}</span>
                  <button onClick={() => setIsTimerRunning(r => !r)}
                    className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                      isTimerRunning ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}>
                    {isTimerRunning ? "หยุด" : "เริ่ม"}
                  </button>
                </div>
              </div>
            </div>

            {/* วันที่ + ปุ่มจัดการท่า */}
            <div className="mb-6 flex flex-wrap justify-between items-end gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />วันที่ฝึก
                </label>
                <input type="date" value={trainingDate} onChange={e => setTrainingDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500" />
              </div>
              <button onClick={() => setIsExerciseModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <Plus className="w-5 h-5" /><span>จัดการท่าออกกำลังกาย</span>
              </button>
            </div>

            {/* workout sessions */}
            {workoutSessions.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg mb-6">
                <Dumbbell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">กดปุ่ม "จัดการท่าออกกำลังกาย" เพื่อเริ่มบันทึก</p>
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                {workoutSessions.sort((a, b) => a.order - b.order).map(session => {
                  const fields    = getFieldConfig(session.exercise_category);
                  const gridStyle = { gridTemplateColumns: `40px repeat(${fields.length}, 1fr) 60px 40px` };

                  return (
                    <div key={session.exercise_id} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">

                      {/* หัวท่า */}
                      <div className="flex justify-between items-center p-4 bg-white border-b border-gray-100">
                        <div>
                          <h4 className="font-bold text-gray-800">{session.exercise_name}</h4>
                          <div className="flex gap-2 mt-1">
                            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{session.exercise_type}</span>
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{session.equipment}</span>
                          </div>
                        </div>
                        <button onClick={() => removeExercise(session.exercise_id)} className="text-red-400 hover:text-red-600">
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="p-4">
                        {/* Header */}
                        <div className="grid gap-2 text-xs font-semibold text-gray-500 mb-2 px-1" style={gridStyle}>
                          <span>เซต</span>
                          {fields.map(f => (
                            <span key={f.field} className="text-center">{f.label} ({f.unit})</span>
                          ))}
                          <span className="text-center">RPE</span>
                          <span className="text-center">✓</span>
                        </div>

                        {/* แต่ละเซต */}
                        {session.sets.map((set, idx) => (
                          <div key={idx} className="grid gap-2 items-center mb-2" style={gridStyle}>

                            {/* เลขเซต */}
                            <div className="flex items-center space-x-1">
                              <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-bold">
                                {set.set_number}
                              </span>
                              {session.sets.length > 1 && (
                                <button onClick={() => removeSet(session.exercise_id, set.set_number)}
                                  className="text-gray-300 hover:text-red-400">
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>

                            {/* dynamic fields */}
                            {fields.map(f => (
                              <input key={f.field} type="number"
                                value={set[f.field]}
                                onChange={e => updateSet(session.exercise_id, set.set_number, f.field, e.target.value)}
                                className={`border rounded-lg px-2 py-1.5 text-center text-sm focus:ring-1 focus:ring-purple-400 ${
                                  set.completed ? "bg-green-50 border-green-200" : "border-gray-200"
                                }`}
                                placeholder={f.placeholder} step={f.step} min="0" />
                            ))}

                            {/* RPE */}
                            <input type="number" value={set.rpe}
                              onChange={e => updateSet(session.exercise_id, set.set_number, "rpe", e.target.value)}
                              className={`border rounded-lg px-2 py-1.5 text-center text-sm focus:ring-1 focus:ring-purple-400 ${
                                set.completed ? "bg-green-50 border-green-200" : "border-gray-200"
                              }`}
                              placeholder="1-10" min="1" max="10" />

                            {/* ✓ */}
                            <div className="flex justify-center">
                              <button
                                onClick={() => updateSet(session.exercise_id, set.set_number, "completed", !set.completed)}
                                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                                  set.completed ? "bg-green-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                                }`}>
                                {set.completed && <Check className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* ปุ่มเพิ่มเซต */}
                        <button onClick={() => addSet(session.exercise_id)}
                          className="w-full mt-2 bg-white border-2 border-dashed border-gray-300 hover:border-purple-400 text-gray-500 hover:text-purple-600 py-2 rounded-lg flex items-center justify-center text-sm transition-colors">
                          <Plus className="w-4 h-4 mr-1" />เพิ่มเซต
                        </button>

                        {/* หมายเหตุต่อท่า */}
                        <input type="text" value={session.note}
                          onChange={e => updateSessionNote(session.exercise_id, e.target.value)}
                          className="w-full mt-2 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 placeholder-gray-400 focus:ring-1 focus:ring-purple-400"
                          placeholder="หมายเหตุสำหรับท่านี้..." />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* หมายเหตุรวม */}
            {workoutSessions.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📝 หมายเหตุรวม (ทั้ง session)
                </label>
                <textarea value={logNote} onChange={e => setLogNote(e.target.value)} rows="3"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 resize-none text-sm"
                  placeholder="เช่น วันนี้รู้สึกเหนื่อยมาก / ปรับน้ำหนักลง / มีอาการเจ็บที่หัวไหล่..." />
              </div>
            )}

            {/* ปุ่มบันทึก */}
            {workoutSessions.length > 0 && (
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => {
                    if (!window.confirm("ยกเลิกการบันทึกใช่หรือไม่?")) return;
                    setSelectedProgram(null);
                    setWorkoutSessions([]);
                    setTimerSeconds(0);
                    setIsTimerRunning(false);
                    setLogNote("");
                  }}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold">
                  ยกเลิก
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold flex items-center space-x-2 disabled:opacity-60">
                  {saving
                    ? <><Loader2 className="w-5 h-5 animate-spin" /><span>กำลังบันทึก...</span></>
                    : <><Save className="w-5 h-5" /><span>บันทึกผลการฝึก</span></>
                  }
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ===== Modal จัดการท่า ===== */}
      {isExerciseModal && selectedProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 text-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-gray-700 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">จัดการท่าออกกำลังกาย</h3>
                <p className="text-xs text-gray-400 mt-0.5">เลือกแล้ว {workoutSessions.length} ท่า</p>
              </div>
              <button onClick={() => setIsExerciseModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Search + Filter */}
            <div className="p-4 border-b border-gray-700 space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={exSearch} onChange={e => setExSearch(e.target.value)}
                  placeholder="ค้นหาท่า..."
                  className="w-full bg-gray-800 text-white pl-9 pr-4 py-2 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select value={exMuscleFilter} onChange={e => setExMuscleFilter(e.target.value)}
                  className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-1.5 text-sm">
                  <option value="">ทุกประเภท</option>
                  {muscleTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select value={exEquipFilter} onChange={e => setExEquipFilter(e.target.value)}
                  className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-1.5 text-sm">
                  <option value="">ทุกอุปกรณ์</option>
                  {equipTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {/* รายการท่า */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredModal.length === 0 ? (
                <p className="text-center text-gray-400 py-8">ไม่พบท่าที่ค้นหา</p>
              ) : filteredModal.map(ex => {
                const exId  = ex.exercise_id?._id || ex.exercise_id;
                const added = isExerciseAdded(exId);
                return (
                  <button key={exId} onClick={() => toggleExerciseInModal(ex)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                      added ? "bg-purple-600" : "bg-gray-800 hover:bg-gray-700"
                    }`}>
                    <div className="text-left">
                      <p className="font-semibold text-sm">{ex.exercise_id?.exercise_name}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs text-purple-300">{ex.exercise_id?.exercise_type}</span>
                        <span className="text-xs text-gray-400">• {ex.exercise_id?.equipment_type}</span>
                      </div>
                    </div>
                    {added && (
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-purple-600" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-4 border-t border-gray-700">
              <button onClick={() => setIsExerciseModal(false)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold">
                ยืนยัน ({workoutSessions.length} ท่า)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerResults;