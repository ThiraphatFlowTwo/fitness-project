import React, { useState, useEffect } from "react";
import { Loader2, XCircle, Plus, Pencil, Trash2, Search, Save, X } from "lucide-react";

const API = "/api/programs"; 
const TRAINEE_API = "/api/trainees";
const EXERCISE_API = "/api/exercises";

const EMPTY_FORM = {
  name: "",
  description: "",
  trainee_id: "",
  duration_weeks: 4,
  exercises: []
};

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export default function TrainerPrograms() {
  const [programs, setPrograms] = useState([]);
  const [trainees, setTrainees] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [activeYear, setActiveYear] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exSearch, setExSearch] = useState("");
  const [exTypeFilter, setExTypeFilter] = useState("");
  const [exEquipFilter, setExEquipFilter] = useState("");
  const [hasAdvisor, setHasAdvisor] = useState(true); // State สำหรับควบคุมการตรวจสิทธิ์อาจารย์ที่ปรึกษา
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    // 🔍 ตรวจสอบสิทธิ์อาจารย์ที่ปรึกษาก่อนเรียกใช้ API
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === 'trainer' && !user.advisor_id) {
        setHasAdvisor(false);
        setLoading(false); // สั่งปิด Loader ทันทีเพื่อแสดงหน้าจอแจ้งเตือนเลือกอาจารย์
        return;
      } else {
        setHasAdvisor(true);
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
          pRes.json(),
          tRes.json(),
          eRes.json(),
          yRes.ok ? yRes.json() : null,
        ]);
        
        setPrograms(Array.isArray(pData) ? pData : []);
        setTrainees(Array.isArray(tData) ? tData : []);
        setExercises(Array.isArray(eData) ? eData : []);
        setActiveYear(yData);
      } catch (err) {
        setError("โหลดข้อมูลไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  // ตัวกรองรายการท่าออกกำลังกาย
  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(exSearch.toLowerCase());
    const matchesType = exTypeFilter ? ex.type === exTypeFilter : true;
    const matchesEquip = exEquipFilter ? ex.equipment === exEquipFilter : true;
    return matchesSearch && matchesType && matchesEquip;
  });

  const handleOpenCreate = () => {
    setFormData(EMPTY_FORM);
    setSelectedExercises([]);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (program) => {
    setEditingId(program.id);
    setFormData({
      name: program.name,
      description: program.description || "",
      trainee_id: program.trainee_id,
      duration_weeks: program.duration_weeks,
    });
    setSelectedExercises(program.exercises || []);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("คุณต้องการลบโปรแกรมนี้ใช่หรือไม่?")) return;
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        setPrograms(programs.filter((p) => p.id !== id));
      } else {
        alert("ไม่สามารถลบโปรแกรมได้");
      }
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการลบ");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      exercises: selectedExercises,
    };

    try {
      const url = editingId ? `${API}/${editingId}` : API;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const savedProgram = await res.json();
        if (editingId) {
          setPrograms(programs.map((p) => (p.id === editingId ? savedProgram : p)));
        } else {
          setPrograms([savedProgram, ...programs]);
        }
        setIsModalOpen(false);
        setFormData(EMPTY_FORM);
        setSelectedExercises([]);
      } else {
        alert("บันทึกข้อมูลไม่สำเร็จ");
      }
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const handleAddExercise = (ex) => {
    if (selectedExercises.some((item) => item.id === ex.id)) return;
    setSelectedExercises([...selectedExercises, { ...ex, sets: 3, reps: 12, rest_seconds: 60 }]);
  };

  const handleRemoveExercise = (id) => {
    setSelectedExercises(selectedExercises.filter((ex) => ex.id !== id));
  };

  const handleExerciseDetailChange = (id, field, value) => {
    setSelectedExercises(
      selectedExercises.map((ex) =>
        ex.id === id ? { ...ex, [field]: value } : ex
      )
    );
  };

  // --- RENDERING CONDITIONS ---

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-2 text-gray-600 font-medium font-sans">กำลังโหลดข้อมูล...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 bg-gray-50 font-medium font-sans">
        {error}
      </div>
    );
  }

  // 🛑 บล็อกการเข้าใช้งานหน้าจอทั้งหมดหากเทรนเนอร์ยังไม่ได้เลือกอาจารย์ที่ปรึกษา
  if (!hasAdvisor) {
    return (
      <div className="p-4 md:p-8 bg-gray-50 min-h-screen flex items-center justify-center font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-amber-200">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <XCircle className="w-10 h-10 text-amber-500 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">ยังไม่ได้เลือกอาจารย์ที่ปรึกษา</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            คุณจำเป็นต้องเลือกอาจารย์ที่ปรึกษาให้เรียบร้อยก่อน จึงจะสามารถสร้างหรือแก้ไขโปรแกรมฝึกซ้อมในระบบได้
          </p>
          <a
            href="/trainer/profile"
            className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-sm text-center"
          >
            ไปที่หน้าโปรไฟล์เพื่อเลือกอาจารย์
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">โปรแกรมฝึกซ้อมของฉัน</h1>
          <p className="text-sm text-gray-500">จัดการโปรแกรมการออกกำลังกายสำหรับนักกีฬาของคุณ</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          สร้างโปรแกรมใหม่
        </button>
      </div>

      {/* Program List Grid */}
      {programs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
          <p className="text-gray-500">ยังไม่มีโปรแกรมฝึกซ้อมในระบบ</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <div key={program.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{program.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{program.description || "ไม่มีรายละเอียด"}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-purple-50 text-purple-600 px-2.5 py-1 rounded-full font-medium">
                    ระยะเวลา: {program.duration_weeks} สัปดาห์
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                    นักกีฬา: {trainees.find(t => t.id === program.trainee_id)?.name || "ทั่วไป"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 pt-4 border-t border-gray-50">
                <button
                  onClick={() => handleEdit(program)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-semibold text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                  แก้ไข
                </button>
                <button
                  onClick={() => handleDelete(program.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  ลบ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal สำหรับสร้าง/แก้ไขโปรแกรม */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                {editingId ? "แก้ไขโปรแกรมฝึกซ้อม" : "สร้างโปรแกรมฝึกซ้อมใหม่"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Side: Program Details */}
              <div className="space-y-4">
                <h3 className="text-md font-bold text-gray-700 pb-2 border-b">ข้อมูลทั่วไป</h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">ชื่อโปรแกรม</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="เช่น สร้างกล้ามเนื้อระยะเริ่มต้น"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">รายละเอียด</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="รายละเอียดเป้าหมายโปรแกรม..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">นักกีฬาเป้าหมาย</label>
                    <select
                      required
                      className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                      value={formData.trainee_id}
                      onChange={(e) => setFormData({ ...formData, trainee_id: e.target.value })}
                    >
                      <option value="">เลือกนักกีฬา</option>
                      {trainees.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">ระยะเวลา (สัปดาห์)</label>
                    <input
                      type="number"
                      min="1"
                      required
                      className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                      value={formData.duration_weeks}
                      onChange={(e) => setFormData({ ...formData, duration_weeks: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                {/* Selected Exercises Details */}
                <div className="mt-6">
                  <h3 className="text-md font-bold text-gray-700 pb-2 border-b mb-3">ท่าออกกำลังกายที่เลือก ({selectedExercises.length})</h3>
                  {selectedExercises.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">ยังไม่ได้เลือกท่าออกกำลังกาย (กรุณาเลือกจากแผงด้านขวา)</p>
                  ) : (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                      {selectedExercises.map((ex) => (
                        <div key={ex.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-2 relative">
                          <button
                            type="button"
                            onClick={() => handleRemoveExercise(ex.id)}
                            className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <span className="font-bold text-sm text-gray-700 pr-6">{ex.name}</span>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-[10px] text-gray-400">จำนวนเซ็ต</label>
                              <input
                                type="number"
                                min="1"
                                className="w-full px-2 py-1 text-xs border rounded-lg"
                                value={ex.sets || 3}
                                onChange={(e) => handleExerciseDetailChange(ex.id, "sets", parseInt(e.target.value))}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-gray-400">ครั้ง/เซ็ต</label>
                              <input
                                type="number"
                                min="1"
                                className="w-full px-2 py-1 text-xs border rounded-lg"
                                value={ex.reps || 12}
                                onChange={(e) => handleExerciseDetailChange(ex.id, "reps", parseInt(e.target.value))}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-gray-400">พัก (วินาที)</label>
                              <input
                                type="number"
                                min="0"
                                className="w-full px-2 py-1 text-xs border rounded-lg"
                                value={ex.rest_seconds || 60}
                                onChange={(e) => handleExerciseDetailChange(ex.id, "rest_seconds", parseInt(e.target.value))}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Exercise Selector */}
              <div className="bg-gray-50 p-4 rounded-xl flex flex-col max-h-[600px]">
                <h3 className="text-md font-bold text-gray-700 pb-2 mb-3 border-b flex items-center justify-between">
                  ค้นหาท่าออกกำลังกาย
                </h3>
                <div className="flex gap-2 mb-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="ค้นหาชื่อท่า..."
                      className="w-full pl-9 pr-3 py-1.5 text-sm border rounded-lg outline-none bg-white focus:ring-1 focus:ring-purple-500"
                      value={exSearch}
                      onChange={(e) => setExSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <select
                    className="text-xs border rounded-lg p-1.5 bg-white outline-none"
                    value={exTypeFilter}
                    onChange={(e) => setExTypeFilter(e.target.value)}
                  >
                    <option value="">ทุกกลุ่มกล้ามเนื้อ</option>
                    <option value="Chest">อก (Chest)</option>
                    <option value="Back">หลัง (Back)</option>
                    <option value="Legs">ขา (Legs)</option>
                    <option value="Arms">แขน (Arms)</option>
                  </select>
                  <select
                    className="text-xs border rounded-lg p-1.5 bg-white outline-none"
                    value={exEquipFilter}
                    onChange={(e) => setExEquipFilter(e.target.value)}
                  >
                    <option value="">ทุกอุปกรณ์</option>
                    <option value="Barbell">บาร์เบล (Barbell)</option>
                    <option value="Dumbbell">ดัมเบล (Dumbbell)</option>
                    <option value="Machine">เครื่องฝึก (Machine)</option>
                    <option value="Bodyweight">น้ำหนักตัว (Bodyweight)</option>
                  </select>
                </div>

                {/* Exercise List */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {filteredExercises.map((ex) => {
                    const isAdded = selectedExercises.some((item) => item.id === ex.id);
                    return (
                      <div
                        key={ex.id}
                        className="p-3 bg-white rounded-xl border border-gray-200 flex justify-between items-center hover:shadow-sm transition-all"
                      >
                        <div>
                          <div className="font-bold text-sm text-gray-800">{ex.name}</div>
                          <span className="text-[10px] text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full font-semibold mr-1.5">
                            {ex.type}
                          </span>
                          <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                            {ex.equipment}
                          </span>
                        </div>
                        <button
                          type="button"
                          disabled={isAdded}
                          onClick={() => handleAddExercise(ex)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            isAdded
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-purple-500 hover:bg-purple-600 text-white"
                          }`}
                        >
                          {isAdded ? "เลือกแล้ว" : "เลือกท่า"}
                        </button>
                      </div>
                    );
                  })}
                  {filteredExercises.length === 0 && (
                    <p className="text-center text-xs text-gray-400 py-8">ไม่พบข้อมูลท่าออกกำลังกาย</p>
                  )}
                </div>
              </div>

              {/* Modal Footer (Col-span 2) */}
              <div className="md:col-span-2 pt-4 border-t border-gray-100 flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 border rounded-xl hover:bg-gray-50 text-gray-700 font-semibold text-sm transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  บันทึกข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}