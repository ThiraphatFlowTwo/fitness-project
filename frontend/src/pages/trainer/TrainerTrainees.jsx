import React, { useState, useEffect } from "react";
import {
  UserPlus,
  Eye,
  Edit,
  Trash2,
  X,
  Save,
  Loader2,
  Activity,
} from "lucide-react";

const API = "http://localhost:5000/api/trainees";
const FITNESS_API = "http://localhost:5000/api/fitness";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  // ✅ ไม่ redirect ออกเองตรงนี้ — แค่ส่ง header เปล่าไป backend จะตอบ 401 เอง
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
};

const getGoalColor = (goal) => {
  const map = {
    เพิ่มมวลกล้ามเนื้อ: "bg-green-100 text-green-800",
    คาร์ดิโอ: "bg-blue-100 text-blue-800",
    เพิ่มความแข็งแรง: "bg-purple-100 text-purple-800",
    ลดไขมัน: "bg-orange-100 text-orange-800",
  };
  return map[goal] || "bg-gray-100 text-gray-800";
};

const EMPTY_TRAINEE = {
  name: "",
  gender: "ชาย",
  age: "",
  height: "",
  weight: "",
  goal: "เพิ่มมวลกล้ามเนื้อ",
  healthCondition: "",
};

const EMPTY_FITNESS = {
  test_date: "",
  bmi: "",
  body_fat_percent: "",
  vo2_max: "",
  muscle_strength: "",
  flexibility: "",
  resting_heart_rate: "",
  remark: "",
};

const TrainerTrainees = () => {
  const [trainees, setTrainees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Modal ลูกเทรน
  const [isTraineeModal, setIsTraineeModal] = useState(false);
  const [traineeMode, setTraineeMode] = useState("add");
  const [selectedId, setSelectedId] = useState(null);
  const [traineeForm, setTraineeForm] = useState(EMPTY_TRAINEE);

  // Modal สมรรถภาพ
  const [isFitnessModal, setIsFitnessModal] = useState(false);
  const [fitnessMode, setFitnessMode] = useState("add");
  const [selectedTrainee, setSelectedTrainee] = useState(null);
  const [fitnessRecords, setFitnessRecords] = useState([]);
  const [fitnessForm, setFitnessForm] = useState(EMPTY_FITNESS);
  const [selectedFitnessId, setSelectedFitnessId] = useState(null);
  const [fitnessLoading, setFitnessLoading] = useState(false);

  // ── โหลดลูกเทรน ──────────────────────────────────────────────
  const fetchTrainees = async () => {
    setLoading(true);
    try {
      const res = await fetch(API, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "โหลดข้อมูลไม่สำเร็จ");
      setTrainees(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainees();
  }, []);

  // ── โหลดข้อมูลสมรรถภาพ ───────────────────────────────────────
  const fetchFitness = async (traineeId) => {
    setFitnessLoading(true);
    try {
      const res = await fetch(`${FITNESS_API}/${traineeId}`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "โหลดข้อมูลสมรรถภาพไม่สำเร็จ");
      setFitnessRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      alert(err.message || "โหลดข้อมูลสมรรถภาพไม่สำเร็จ");
    } finally {
      setFitnessLoading(false);
    }
  };

  // ── เปิด Modal ลูกเทรน ────────────────────────────────────────
  const handleAdd = () => {
    setTraineeMode("add");
    setTraineeForm(EMPTY_TRAINEE);
    setSelectedId(null);
    setIsTraineeModal(true);
  };

  const handleView = (t) => {
    setTraineeMode("view");
    setTraineeForm(t);
    setSelectedId(t._id);
    setIsTraineeModal(true);
  };
  const handleEdit = (t) => {
    setTraineeMode("edit");
    setTraineeForm(t);
    setSelectedId(t._id);
    setIsTraineeModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("คุณต้องการลบผู้รับการฝึกนี้ใช่หรือไม่?")) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE", headers: authHeaders() });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "ลบไม่สำเร็จ");
      }
      setTrainees((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert(err.message || "ลบไม่สำเร็จ");
    }
  };

  const handleSaveTrainee = async () => {
    if (!traineeForm.name || !traineeForm.age) {
      alert("กรุณากรอกชื่อและอายุให้ครบถ้วน");
      return;
    }
    setSaving(true);
    try {
      if (traineeMode === "add") {
        const res = await fetch(API, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify(traineeForm),
        });
        const data = await res.json(); // ← อ่านครั้งเดียว
        if (!res.ok) {
          alert(`บันทึกไม่สำเร็จ: ${data.message}`);
          return;
        }
        setTrainees((prev) => [data, ...prev]); // ← ใช้ data ที่อ่านไปแล้ว
      } else {
        const res = await fetch(`${API}/${selectedId}`, {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify(traineeForm),
        });
        const data = await res.json(); // ← อ่านครั้งเดียว
        if (!res.ok) {
          alert(`แก้ไขไม่สำเร็จ: ${data.message}`);
          return;
        }
        setTrainees((prev) =>
          prev.map((t) => (t._id === selectedId ? data : t)),
        );
      }
      setIsTraineeModal(false);
    } catch {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  // ── เปิด Modal สมรรถภาพ ───────────────────────────────────────
  const handleOpenFitness = (trainee) => {
    setSelectedTrainee(trainee);
    setFitnessMode("list");
    setFitnessForm(EMPTY_FITNESS);
    setSelectedFitnessId(null);
    fetchFitness(trainee._id);
    setIsFitnessModal(true);
  };

  const handleAddFitness = () => {
    setFitnessMode("add");
    setFitnessForm({
      ...EMPTY_FITNESS,
      test_date: new Date().toISOString().split("T")[0],
    });
    setSelectedFitnessId(null);
  };

  const handleEditFitness = (record) => {
    setFitnessMode("edit");
    setSelectedFitnessId(record._id);
    setFitnessForm({
      ...record,
      test_date: record.test_date?.split("T")[0] || "",
    });
  };

  const handleDeleteFitness = async (id) => {
    if (!window.confirm("ลบข้อมูลสมรรถภาพนี้ใช่หรือไม่?")) return;
    try {
      const res = await fetch(`${FITNESS_API}/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "ลบไม่สำเร็จ");
      }
      setFitnessRecords((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.message || "ลบไม่สำเร็จ");
    }
  };

  const handleSaveFitness = async () => {
    if (!fitnessForm.test_date) {
      alert("กรุณาเลือกวันที่ทดสอบ");
      return;
    }
    setSaving(true);
    try {
      if (fitnessMode === "add") {
        const res = await fetch(FITNESS_API, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({
            ...fitnessForm,
            trainee_id: selectedTrainee._id,
          }),
        });
        if (!res.ok) {
          const e = await res.json();
          alert(`บันทึกไม่สำเร็จ: ${e.message}`);
          return;
        }
        const saved = await res.json();
        setFitnessRecords((prev) => [saved, ...prev]);
      } else {
        const res = await fetch(`${FITNESS_API}/${selectedFitnessId}`, {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify(fitnessForm),
        });
        if (!res.ok) {
          const e = await res.json();
          alert(`แก้ไขไม่สำเร็จ: ${e.message}`);
          return;
        }
        const updated = await res.json();
        setFitnessRecords((prev) =>
          prev.map((r) => (r._id === selectedFitnessId ? updated : r)),
        );
      }
      setFitnessMode("list");
    } catch {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  const handleFitnessInput = (e) => {
    const { name, value } = e.target;
    setFitnessForm((prev) => ({ ...prev, [name]: value }));
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
      <div className="bg-white rounded-xl shadow-md">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">
            จัดการข้อมูลผู้รับการฝึก
          </h3>
          <button
            onClick={handleAdd}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            <span>เพิ่มผู้รับการฝึก</span>
          </button>
        </div>

        {/* Table */}
        <div className="p-6 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "ชื่อ-นามสกุล",
                  "เพศ",
                  "อายุ",
                  "ส่วนสูง",
                  "น้ำหนัก",
                  "เป้าหมาย",
                  "การจัดการ",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {trainees.map((t) => (
                <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-semibold">
                          {t.name.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium text-gray-800">
                        {t.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {t.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {t.age} ปี
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {t.height ? `${t.height} ซม.` : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {t.weight ? `${t.weight} กก.` : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getGoalColor(t.goal)}`}
                    >
                      {t.goal}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {/* ปุ่มสมรรถภาพ */}
                      <button
                        onClick={() => handleOpenFitness(t)}
                        className="text-purple-600 hover:text-purple-800 transition-colors"
                        title="ข้อมูลสมรรถภาพทางกาย"
                      >
                        <Activity className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleView(t)}
                        className="text-blue-600 hover:text-blue-800"
                        title="ดูรายละเอียด"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(t)}
                        className="text-green-600 hover:text-green-800"
                        title="แก้ไข"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(t._id)}
                        className="text-red-600 hover:text-red-800"
                        title="ลบ"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {trainees.length === 0 && (
            <p className="text-center text-gray-400 py-10">
              ยังไม่มีข้อมูลผู้รับการฝึก
            </p>
          )}
        </div>
      </div>

      {/* ===== Modal ลูกเทรน ===== */}
      {isTraineeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-800">
                {traineeMode === "add" && "เพิ่มผู้รับการฝึกใหม่"}
                {traineeMode === "edit" && "แก้ไขข้อมูลผู้รับการฝึก"}
                {traineeMode === "view" && "รายละเอียดผู้รับการฝึก"}
              </h3>
              <button
                onClick={() => setIsTraineeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อ-นามสกุล <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={traineeForm.name}
                    onChange={(e) =>
                      setTraineeForm((p) => ({ ...p, name: e.target.value }))
                    }
                    disabled={traineeMode === "view"}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                    placeholder="เช่น สมชาย ใจดี"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    เพศ
                  </label>
                  <select
                    name="gender"
                    value={traineeForm.gender}
                    onChange={(e) =>
                      setTraineeForm((p) => ({ ...p, gender: e.target.value }))
                    }
                    disabled={traineeMode === "view"}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                  >
                    <option value="ชาย">ชาย</option>
                    <option value="หญิง">หญิง</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    อายุ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={traineeForm.age}
                    onChange={(e) =>
                      setTraineeForm((p) => ({ ...p, age: e.target.value }))
                    }
                    disabled={traineeMode === "view"}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                    placeholder="เช่น 25"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    เป้าหมายการฝึก
                  </label>
                  <select
                    name="goal"
                    value={traineeForm.goal}
                    onChange={(e) =>
                      setTraineeForm((p) => ({ ...p, goal: e.target.value }))
                    }
                    disabled={traineeMode === "view"}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                  >
                    <option value="เพิ่มมวลกล้ามเนื้อ">
                      เพิ่มมวลกล้ามเนื้อ
                    </option>
                    <option value="ลดไขมัน">ลดไขมัน</option>
                    <option value="คาร์ดิโอ">คาร์ดิโอ</option>
                    <option value="เพิ่มความแข็งแรง">เพิ่มความแข็งแรง</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ส่วนสูง (ซม.)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="height"
                    value={traineeForm.height}
                    onChange={(e) =>
                      setTraineeForm((p) => ({ ...p, height: e.target.value }))
                    }
                    disabled={traineeMode === "view"}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                    placeholder="เช่น 170"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    น้ำหนัก (กก.)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="weight"
                    value={traineeForm.weight}
                    onChange={(e) =>
                      setTraineeForm((p) => ({ ...p, weight: e.target.value }))
                    }
                    disabled={traineeMode === "view"}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                    placeholder="เช่น 65"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ข้อมูลสุขภาพพื้นฐาน
                </label>
                <textarea
                  name="healthCondition"
                  value={traineeForm.healthCondition}
                  onChange={(e) =>
                    setTraineeForm((p) => ({
                      ...p,
                      healthCondition: e.target.value,
                    }))
                  }
                  disabled={traineeMode === "view"}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 resize-none"
                  placeholder="เช่น โรคประจำตัว ประวัติการบาดเจ็บ..."
                />
              </div>
              <div className="flex space-x-3 pt-4 border-t">
                {traineeMode !== "view" && (
                  <button
                    onClick={handleSaveTrainee}
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
                  onClick={() => setIsTraineeModal(false)}
                  className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold"
                >
                  {traineeMode === "view" ? "ปิด" : "ยกเลิก"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Modal สมรรถภาพทางกาย ===== */}
      {isFitnessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  ข้อมูลสมรรถภาพทางกาย
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedTrainee?.name}
                </p>
              </div>
              <button
                onClick={() => setIsFitnessModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* รายการ หรือ ฟอร์ม */}
              {fitnessMode === "list" ? (
                <>
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={handleAddFitness}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm transition-colors"
                    >
                      <Activity className="w-4 h-4" />
                      <span>เพิ่มข้อมูลสมรรถภาพ</span>
                    </button>
                  </div>

                  {fitnessLoading ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                    </div>
                  ) : fitnessRecords.length === 0 ? (
                    <p className="text-center text-gray-400 py-10">
                      ยังไม่มีข้อมูลสมรรถภาพทางกาย
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {fitnessRecords.map((r) => (
                        <div
                          key={r._id}
                          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-gray-800">
                                วันที่ทดสอบ:{" "}
                                {new Date(r.test_date).toLocaleDateString(
                                  "th-TH",
                                )}
                              </p>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 text-sm text-gray-600">
                                {r.bmi && <span>BMI: {r.bmi}</span>}
                                {r.body_fat_percent && (
                                  <span>ไขมัน: {r.body_fat_percent}%</span>
                                )}
                                {r.vo2_max && <span>VO2 Max: {r.vo2_max}</span>}
                                {r.muscle_strength && (
                                  <span>ความแข็งแรง: {r.muscle_strength}</span>
                                )}
                                {r.flexibility && (
                                  <span>ความยืดหยุ่น: {r.flexibility}</span>
                                )}
                                {r.resting_heart_rate && (
                                  <span>ชีพจร: {r.resting_heart_rate} bpm</span>
                                )}
                              </div>
                              {r.remark && (
                                <p className="text-xs text-gray-400 mt-1">
                                  หมายเหตุ: {r.remark}
                                </p>
                              )}
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <button
                                onClick={() => handleEditFitness(r)}
                                className="text-green-600 hover:text-green-800"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteFitness(r._id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                /* ฟอร์มเพิ่ม/แก้ไข */
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-700">
                      {fitnessMode === "add"
                        ? "เพิ่มข้อมูลสมรรถภาพใหม่"
                        : "แก้ไขข้อมูลสมรรถภาพ"}
                    </h4>
                    <button
                      onClick={() => setFitnessMode("list")}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      ← กลับรายการ
                    </button>
                  </div>

                  {/* วันที่ทดสอบ */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      วันที่ทดสอบ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="test_date"
                      value={fitnessForm.test_date}
                      onChange={handleFitnessInput}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        BMI (ดัชนีมวลกาย)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="bmi"
                        value={fitnessForm.bmi}
                        onChange={handleFitnessInput}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
                        placeholder="เช่น 22.50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        % ไขมัน (Body Fat)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="body_fat_percent"
                        value={fitnessForm.body_fat_percent}
                        onChange={handleFitnessInput}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
                        placeholder="เช่น 18.50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        VO2 Max
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="vo2_max"
                        value={fitnessForm.vo2_max}
                        onChange={handleFitnessInput}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
                        placeholder="เช่น 45.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        อัตราการเต้นหัวใจขณะพัก (bpm)
                      </label>
                      <input
                        type="number"
                        name="resting_heart_rate"
                        value={fitnessForm.resting_heart_rate}
                        onChange={handleFitnessInput}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
                        placeholder="เช่น 65"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ความแข็งแรงกล้ามเนื้อ
                      </label>
                      <input
                        type="text"
                        name="muscle_strength"
                        value={fitnessForm.muscle_strength}
                        onChange={handleFitnessInput}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
                        placeholder="เช่น ดี / 80 kg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ความยืดหยุ่น
                      </label>
                      <input
                        type="text"
                        name="flexibility"
                        value={fitnessForm.flexibility}
                        onChange={handleFitnessInput}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
                        placeholder="เช่น ดีมาก / 15 cm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      หมายเหตุ
                    </label>
                    <textarea
                      name="remark"
                      value={fitnessForm.remark}
                      onChange={handleFitnessInput}
                      rows="3"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 resize-none"
                      placeholder="หมายเหตุเพิ่มเติม..."
                    />
                  </div>

                  <div className="flex space-x-3 pt-4 border-t">
                    <button
                      onClick={handleSaveFitness}
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
                    <button
                      onClick={() => setFitnessMode("list")}
                      className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold"
                    >
                      ยกเลิก
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerTrainees;
