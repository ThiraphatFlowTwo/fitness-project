import React, { useState, useEffect, useRef } from "react";
import {
  UserPlus,
  Eye,
  Edit,
  Trash2,
  X,
  Save,
  Loader2,
  Activity,
  CheckCircle,
  XCircle,
  Target,
  FileText,
  Camera,
  Sparkles,
} from "lucide-react";

const API = "http://localhost:5000/api/trainees";
const FITNESS_API = "http://localhost:5000/api/fitness";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
};

const STANDARD_GOAL_OPTIONS = [
  "ลดน้ำหนัก / ลดไขมัน",
  "เพิ่มมวลกล้ามเนื้อ",
  "เสริมสร้างความแข็งแรง",
  "ฟื้นฟูระบบเผาผลาญ",
  "คาร์ดิโอ / ความฟิต",
];

const getGoalColor = (goal = "") => {
  if (typeof goal !== "string") return "bg-blue-100 text-blue-800 border-blue-200";
  if (goal.includes("ลดน้ำหนัก") || goal.includes("ลดไขมัน")) return "bg-orange-100 text-orange-800 border-orange-200";
  if (goal.includes("เพิ่มมวลกล้ามเนื้อ")) return "bg-green-100 text-green-800 border-green-200";
  if (goal.includes("เสริมสร้างความแข็งแรง")) return "bg-purple-100 text-purple-800 border-purple-200";
  if (goal.includes("ระบบเผาผลาญ")) return "bg-amber-100 text-amber-800 border-amber-200";
  return "bg-blue-100 text-blue-800 border-blue-200";
};

const EMPTY_TRAINEE = {
  name: "",
  gender: "ชาย",
  age: "",
  height: "",
  weight: "",
  goals: ["ลดน้ำหนัก / ลดไขมัน", "เสริมสร้างความแข็งแรง"],
  goalDetail: "",
  healthCondition: "",
};

const EMPTY_FITNESS = {
  test_date: "",
  weight: "",
  skeletal_muscle_mass: "",
  body_fat_mass: "",
  protein: "",
  minerals: "",
  total_body_water: "",
  bmi: "",
  body_fat_percent: "",
  visceral_fat_level: "",
  waist_circumference: "",
  waist_hip_ratio: "",
  body_age: "",
  estimated_bmr: "",
  tdee: "",
  body_score: "",
  sys_bp: "",
  dia_bp: "",
  resting_heart_rate: "",
  muscle_strength: "",
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

  // State เพิ่มเติมสำหรับการอัปโหลดรูปภาพ & สแกน
  const [imagePreview, setImagePreview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  // Toast State & Timer Ref
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const toastTimerRef = useRef(null);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const [confirmModal, setConfirmModal] = useState({
    show: false,
    type: null,
    id: null,
    title: "",
    description: "",
  });

  const closeConfirmModal = () => setConfirmModal((prev) => ({ ...prev, show: false }));

  const fetchTrainees = async () => {
    setLoading(true);
    try {
      const res = await fetch(API, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "โหลดข้อมูลไม่สำเร็จ");
      
      const formattedData = (Array.isArray(data) ? data : []).map((t) => ({
        ...t,
        goals: Array.isArray(t.goals) ? t.goals : t.goal ? [t.goal] : [],
        goalDetail: t.goalDetail || "",
      }));
      
      setTrainees(formattedData);
    } catch (err) {
      setError(err.message || "โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainees();
  }, []);

  const fetchFitness = async (traineeId) => {
    setFitnessLoading(true);
    try {
      const res = await fetch(`${FITNESS_API}/${traineeId}`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "โหลดข้อมูลสมรรถภาพไม่สำเร็จ");
      setFitnessRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast(err.message || "โหลดข้อมูลสมรรถภาพไม่สำเร็จ", "error");
    } finally {
      setFitnessLoading(false);
    }
  };

  const handleGoalToggle = (goalOption) => {
    setTraineeForm((prev) => {
      const currentGoals = prev.goals || [];
      if (currentGoals.includes(goalOption)) {
        return { ...prev, goals: currentGoals.filter((g) => g !== goalOption) };
      } else {
        return { ...prev, goals: [...currentGoals, goalOption] };
      }
    });
  };

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

  const handleDeleteClick = (t) => {
    setConfirmModal({
      show: true,
      type: "deleteTrainee",
      id: t._id,
      title: "ยืนยันการลบ",
      description: `ต้องการลบผู้รับการฝึก "${t.name}" ใช่หรือไม่?`,
    });
  };

  const confirmDeleteTrainee = async () => {
    const id = confirmModal.id;
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE", headers: authHeaders() });
      if (!res.ok) throw new Error("ลบไม่สำเร็จ");
      setTrainees((prev) => prev.filter((t) => t._id !== id));
      closeConfirmModal();
      showToast("ลบผู้รับการฝึกแล้ว", "success");
    } catch (err) {
      closeConfirmModal();
      showToast(err.message || "ลบไม่สำเร็จ", "error");
    }
  };

  const handleSaveTrainee = async () => {
    if (!traineeForm.name || !traineeForm.age) {
      showToast("กรุณากรอกชื่อและอายุให้ครบถ้วน", "error");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...traineeForm,
        goals: traineeForm.goals,
        goal: traineeForm.goals[0] || "ลดน้ำหนัก / ลดไขมัน",
      };

      if (traineeMode === "add") {
        const res = await fetch(API, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setTrainees((prev) => [{ ...data, goals: traineeForm.goals, goalDetail: traineeForm.goalDetail }, ...prev]);
        showToast("เพิ่มผู้รับการฝึกสำเร็จ", "success");
      } else {
        const res = await fetch(`${API}/${selectedId}`, {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setTrainees((prev) =>
          prev.map((t) => (t._id === selectedId ? { ...data, goals: traineeForm.goals, goalDetail: traineeForm.goalDetail } : t))
        );
        showToast("แก้ไขข้อมูลสำเร็จ", "success");
      }
      setIsTraineeModal(false);
    } catch (err) {
      showToast(err.message || "เกิดข้อผิดพลาดในการบันทึก", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleOpenFitness = (trainee) => {
    setSelectedTrainee(trainee);
    setFitnessMode("list");
    setFitnessForm(EMPTY_FITNESS);
    setSelectedFitnessId(null);
    setImagePreview(null);
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
    setImagePreview(null);
  };

  const handleEditFitness = (record) => {
    setFitnessMode("edit");
    setSelectedFitnessId(record._id);
    setFitnessForm({
      ...record,
      test_date: record.test_date?.split("T")[0] || "",
    });
    setImagePreview(null);
  };

  const handleDeleteFitnessClick = (record) => {
    setConfirmModal({
      show: true,
      type: "deleteFitness",
      id: record._id,
      title: "ยืนยันการลบข้อมูลสมรรถภาพ",
      description: `ต้องการลบข้อมูลสมรรถภาพวันที่ ${new Date(record.test_date).toLocaleDateString("th-TH")} ใช่หรือไม่?`,
    });
  };

  const confirmDeleteFitness = async () => {
    const id = confirmModal.id;
    try {
      const res = await fetch(`${FITNESS_API}/${id}`, { method: "DELETE", headers: authHeaders() });
      if (!res.ok) throw new Error("ลบไม่สำเร็จ");
      setFitnessRecords((prev) => prev.filter((r) => r._id !== id));
      closeConfirmModal();
      showToast("ลบข้อมูลสมรรถภาพแล้ว", "success");
    } catch (err) {
      closeConfirmModal();
      showToast(err.message || "ลบไม่สำเร็จ", "error");
    }
  };

  const handleConfirmAction = () => {
    if (confirmModal.type === "deleteTrainee") confirmDeleteTrainee();
    else if (confirmModal.type === "deleteFitness") confirmDeleteFitness();
  };

  // 📷 ฟังก์ชันอัปโหลดรูปภาพ และสแกนกรอกข้อมูลอัตโนมัติ (OCR)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // แสดง Preview รูปภาพ
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // จำลองการสแกน OCR อ่านข้อมูลจากใบรายงาน
    setIsScanning(true);
    setTimeout(() => {
      setFitnessForm((prev) => ({
        ...prev,
        weight: "70.1",
        skeletal_muscle_mass: "24.2",
        body_fat_mass: "26.6",
        protein: "8.5",
        minerals: "3.1",
        total_body_water: "31.9",
        bmi: "28.1",
        body_fat_percent: "37.9",
        visceral_fat_level: "11",
        waist_circumference: "87.2",
        waist_hip_ratio: "0.91",
        body_age: "49",
        body_score: "70",
        estimated_bmr: "1309",
        tdee: "2028",
        sys_bp: "120",
        dia_bp: "80",
        resting_heart_rate: "72",
      }));
      setIsScanning(false);
      showToast("อ่านข้อมูลจากรูปภาพเรียบร้อยแล้ว!", "success");
    }, 1500);
  };

  // 🌟 บันทึกข้อมูลสมรรถภาพ (ตรวจสอบการบันทึกซ้ำวันเดิม)
  const handleSaveFitness = async () => {
    if (!fitnessForm.test_date) {
      showToast("กรุณาเลือกวันที่ทดสอบ", "error");
      return;
    }

    // 🔍 ตรวจสอบว่ามีบันทึกของวันที่เลือกไว้แล้วหรือยัง
    const inputDate = fitnessForm.test_date.split("T")[0];
    const isDuplicate = fitnessRecords.some((r) => {
      const recordDate = r.test_date?.split("T")[0];
      if (fitnessMode === "add") {
        return recordDate === inputDate;
      }
      // กรณีโหมด edit ไม่นับรายการที่กำลังแก้ไขอยู่
      return recordDate === inputDate && r._id !== selectedFitnessId;
    });

    if (isDuplicate) {
      const formattedDate = new Date(fitnessForm.test_date).toLocaleDateString("th-TH");
      showToast(`วันที่ ${formattedDate} มีบันทึกอยู่แล้ว กรุณาลบรายการเดิมของวันนั้นออกก่อน`, "error");
      return;
    }

    setSaving(true);

    const numericFields = [
      "weight", "skeletal_muscle_mass", "body_fat_mass", "protein", "minerals",
      "total_body_water", "bmi", "body_fat_percent", "visceral_fat_level",
      "waist_circumference", "waist_hip_ratio", "body_age", "estimated_bmr",
      "tdee", "body_score", "sys_bp", "dia_bp", "resting_heart_rate"
    ];

    const cleanedFitnessForm = { ...fitnessForm };
    numericFields.forEach((field) => {
      if (cleanedFitnessForm[field] !== "" && cleanedFitnessForm[field] !== null && cleanedFitnessForm[field] !== undefined) {
        cleanedFitnessForm[field] = Number(cleanedFitnessForm[field]);
      } else {
        cleanedFitnessForm[field] = null;
      }
    });

    try {
      if (fitnessMode === "add") {
        const res = await fetch(FITNESS_API, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ ...cleanedFitnessForm, trainee_id: selectedTrainee._id }),
        });
        if (!res.ok) throw new Error("บันทึกไม่สำเร็จ");
        const saved = await res.json();
        setFitnessRecords((prev) => [saved, ...prev]);
        showToast("เพิ่มข้อมูลสมรรถภาพสำเร็จ", "success");
      } else {
        const res = await fetch(`${FITNESS_API}/${selectedFitnessId}`, {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify(cleanedFitnessForm),
        });
        if (!res.ok) throw new Error("แก้ไขไม่สำเร็จ");
        const updated = await res.json();
        setFitnessRecords((prev) => prev.map((r) => (r._id === selectedFitnessId ? updated : r)));
        showToast("แก้ไขข้อมูลสมรรถภาพสำเร็จ", "success");
      }
      setFitnessMode("list");
    } catch (err) {
      showToast(err.message || "เกิดข้อผิดพลาด", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleFitnessInput = (e) => {
    const { name, value } = e.target;
    setFitnessForm((prev) => ({ ...prev, [name]: value }));
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="ml-2 text-gray-600">กำลังโหลดข้อมูล...</span>
      </div>
    );

  if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-md">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">จัดการข้อมูลผู้รับการฝึก</h3>
            <p className="text-xs text-gray-500 mt-0.5">เลือกเป้าหมายมาตรฐาน และบันทึกรายละเอียดเฉพาะบุคคล</p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg text-sm transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            <span>เพิ่มผู้รับการฝึก</span>
          </button>
        </div>

        {/* Table */}
        <div className="p-4 sm:p-6 overflow-x-auto">
          <table className="w-full min-w-[750px]">
            <thead className="bg-gray-50">
              <tr>
                {["ชื่อ-นามสกุล", "เพศ/อายุ", "ส่วนสูง/น้ำหนัก", "เป้าหมายการฝึกหลัก", "การจัดการ"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-indigo-600 font-semibold">{t.name ? t.name.charAt(0) : "T"}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-800 block">{t.name}</span>
                        {t.healthCondition && (
                          <span className="text-xs text-rose-500 font-medium">⚠️ {t.healthCondition}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                    {t.gender} ({t.age} ปี)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                    {t.height ? `${t.height} ซม.` : "-"} / {t.weight ? `${t.weight} กก.` : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap gap-1">
                        {t.goals && t.goals.length > 0 ? (
                          t.goals.map((g, idx) => (
                            <span key={idx} className={`px-2 py-0.5 rounded text-[11px] font-medium border ${getGoalColor(g)}`}>
                              {g}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">ไม่ได้ระบุ</span>
                        )}
                      </div>
                      {t.goalDetail && (
                        <p className="text-xs text-gray-500 line-clamp-1 italic mt-0.5">
                          📌 {t.goalDetail}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-3">
                      <button onClick={() => handleOpenFitness(t)} className="text-purple-600 hover:text-purple-800" title="ข้อมูลสมรรถภาพ/สัดส่วน">
                        <Activity className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleView(t)} className="text-blue-600 hover:text-blue-800" title="ดูรายละเอียด">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleEdit(t)} className="text-green-600 hover:text-green-800" title="แก้ไข">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDeleteClick(t)} className="text-red-600 hover:text-red-800" title="ลบ">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {trainees.length === 0 && <p className="text-center text-gray-400 py-10">ยังไม่มีข้อมูลผู้รับการฝึก</p>}
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
              <button onClick={() => setIsTraineeModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อ-นามสกุล <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={traineeForm.name}
                    onChange={(e) => setTraineeForm((p) => ({ ...p, name: e.target.value }))}
                    disabled={traineeMode === "view"}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 text-sm"
                    placeholder="เช่น สมชาย ใจดี"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">เพศ</label>
                  <select
                    value={traineeForm.gender}
                    onChange={(e) => setTraineeForm((p) => ({ ...p, gender: e.target.value }))}
                    disabled={traineeMode === "view"}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 text-sm"
                  >
                    <option value="ชาย">ชาย</option>
                    <option value="หญิง">หญิง</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    อายุ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={traineeForm.age}
                    onChange={(e) => setTraineeForm((p) => ({ ...p, age: e.target.value }))}
                    disabled={traineeMode === "view"}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ส่วนสูง (ซม.)</label>
                  <input
                    type="number"
                    value={traineeForm.height}
                    onChange={(e) => setTraineeForm((p) => ({ ...p, height: e.target.value }))}
                    disabled={traineeMode === "view"}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">น้ำหนัก (กก.)</label>
                  <input
                    type="number"
                    value={traineeForm.weight}
                    onChange={(e) => setTraineeForm((p) => ({ ...p, weight: e.target.value }))}
                    disabled={traineeMode === "view"}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <Target className="w-4 h-4 text-indigo-600" />
                  <span>เป้าหมายหลักมาตรฐาน (เลือกได้หลายข้อ)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  {STANDARD_GOAL_OPTIONS.map((option) => {
                    const isChecked = (traineeForm.goals || []).includes(option);
                    return (
                      <label
                        key={option}
                        className={`flex items-center space-x-2 text-sm p-2 rounded-md cursor-pointer transition-colors ${
                          isChecked ? "bg-indigo-50 border border-indigo-200 font-medium text-indigo-900" : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleGoalToggle(option)}
                          disabled={traineeMode === "view"}
                          className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                        />
                        <span>{option}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>รายละเอียดเป้าหมายเพิ่มเติมเฉพาะบุคคล</span>
                </label>
                <textarea
                  value={traineeForm.goalDetail}
                  onChange={(e) => setTraineeForm((p) => ({ ...p, goalDetail: e.target.value }))}
                  disabled={traineeMode === "view"}
                  rows="2"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 text-sm"
                  placeholder="เช่น ลดพุง 5 kg ให้กลับมาใส่เสื้อ Size M ได้, โฟกัสสร้างกล้ามเนื้อรอบเข่า"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ข้อจำกัดทางสุขภาพ / ประวัติการเจ็บป่วย
                </label>
                <textarea
                  value={traineeForm.healthCondition}
                  onChange={(e) => setTraineeForm((p) => ({ ...p, healthCondition: e.target.value }))}
                  disabled={traineeMode === "view"}
                  rows="2"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 text-sm"
                  placeholder="เช่น มีอาการเจ็บเข่าขณะย่อ, เคยไดเอทแบบอดอาหารมาก่อน..."
                />
              </div>

              <div className="flex space-x-3 pt-4 border-t">
                {traineeMode !== "view" && (
                  <button
                    onClick={handleSaveTrainee}
                    disabled={saving}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    <span>บันทึกข้อมูล</span>
                  </button>
                )}
                <button
                  onClick={() => setIsTraineeModal(false)}
                  className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 rounded-lg font-semibold"
                >
                  {traineeMode === "view" ? "ปิด" : "ยกเลิก"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Modal สมรรถภาพ & สัดส่วนร่างกาย ===== */}
      {isFitnessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-xl font-bold text-gray-800">ติดตามสมรรถภาพ & องค์ประกอบร่างกาย</h3>
                <p className="text-xs text-indigo-600 font-medium mt-0.5">ผู้รับการฝึก: {selectedTrainee?.name}</p>
              </div>
              <button onClick={() => setIsFitnessModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {fitnessMode === "list" ? (
                <>
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={handleAddFitness}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm shadow-md transition-colors"
                    >
                      <Activity className="w-4 h-4" />
                      <span>+ บันทึกผลการวัดใหม่</span>
                    </button>
                  </div>

                  {fitnessLoading ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                    </div>
                  ) : fitnessRecords.length === 0 ? (
                    <p className="text-center text-gray-400 py-10">ยังไม่มีบันทึกข้อมูลสมรรถภาพทางกาย</p>
                  ) : (
                    <div className="space-y-3">
                      {fitnessRecords.map((r) => (
                        <div key={r._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start">
                            <div className="w-full space-y-3">
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-gray-800 text-sm">
                                  📅 วันที่ทดสอบ: {r.test_date ? new Date(r.test_date).toLocaleDateString("th-TH") : "-"}
                                </span>
                                {r.body_score && (
                                  <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                                    คะแนนร่างกาย: {r.body_score} คะแนน
                                  </span>
                                )}
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-xs text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div><span className="text-gray-400 block">น้ำหนัก:</span> <span className="font-semibold">{r.weight ?? "-"} kg</span></div>
                                <div><span className="text-gray-400 block">กล้ามเนื้อ (SMM):</span> <span className="font-semibold text-green-700">{r.skeletal_muscle_mass ?? "-"} kg</span></div>
                                <div><span className="text-gray-400 block">ไขมัน (FM):</span> <span className="font-semibold text-orange-700">{r.body_fat_mass ?? "-"} kg</span></div>
                                <div><span className="text-gray-400 block">% ไขมัน (PBF):</span> <span className="font-semibold">{r.body_fat_percent ?? "-"} %</span></div>
                                <div><span className="text-gray-400 block">รอบเอว:</span> <span className="font-semibold text-amber-800">{r.waist_circumference ?? "-"} cm</span></div>
                                <div><span className="text-gray-400 block">ไขมันช่องท้อง:</span> <span className="font-semibold text-red-600">Level {r.visceral_fat_level ?? "-"}</span></div>
                                <div><span className="text-gray-400 block">BMR:</span> <span className="font-semibold">{r.estimated_bmr ?? "-"} kcal</span></div>
                                <div><span className="text-gray-400 block">อายุกาย:</span> <span className="font-semibold">{r.body_age ?? "-"} ปี</span></div>
                              </div>

                              {r.remark && <p className="text-xs text-gray-500 mt-1">📌 บันทึกเพิ่มเติม: {r.remark}</p>}
                            </div>

                            <div className="flex space-x-2 ml-4">
                              <button onClick={() => handleEditFitness(r)} className="text-green-600 hover:text-green-800">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteFitnessClick(r)} className="text-red-600 hover:text-red-800">
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
                /* ฟอร์มกรอกข้อมูลสมรรถภาพ & องค์ประกอบร่างกาย */
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-2 border-b">
                    <h4 className="font-bold text-gray-800 text-base">
                      {fitnessMode === "add" ? "📝 กรอกข้อมูลสมรรถภาพ & องค์ประกอบร่างกาย" : "✏️ แก้ไขข้อมูลสมรรถภาพ"}
                    </h4>
                    <button onClick={() => setFitnessMode("list")} className="text-xs text-indigo-600 hover:underline">
                      ← กลับหน้ารายการ
                    </button>
                  </div>

                  {/* 📸 จุดเพิ่มระบบอัปโหลดรูปภาพเพื่อสแกน */}
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span>สแกนกรอกข้อมูลอัตโนมัติจากใบรายงาน (ACCUNIQ / InBody)</span>
                      </div>
                      {imagePreview && (
                        <button
                          type="button"
                          onClick={() => setImagePreview(null)}
                          className="text-xs text-rose-500 hover:underline flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" /> ลบรูปภาพ
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <label className="w-full flex-1 border-2 border-dashed border-purple-300 hover:border-purple-500 bg-white rounded-lg p-3 text-center cursor-pointer transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <div className="flex items-center justify-center gap-2 text-purple-700 font-medium text-xs">
                          {isScanning ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>กำลังสแกนและดึงข้อมูลตัวเลข...</span>
                            </>
                          ) : (
                            <>
                              <Camera className="w-4 h-4" />
                              <span>แนบรูปถ่าย หรือ คลิกเพื่อเลือกรูปใบรายงานผล</span>
                            </>
                          )}
                        </div>
                      </label>

                      {imagePreview && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-purple-300 relative shrink-0">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* วันที่ทดสอบ */}
                  <div className="w-full md:w-1/3">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      วันที่ทดสอบ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="test_date"
                      value={fitnessForm.test_date || ""}
                      onChange={handleFitnessInput}
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-purple-500 text-sm"
                    />
                  </div>

                  {/* 1. การวิเคราะห์องค์ประกอบร่างกาย */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h5 className="text-sm font-bold text-slate-800 mb-3">
                      1. การวิเคราะห์องค์ประกอบร่างกาย (Body Composition)
                    </h5>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1">น้ำหนัก (กก.)</label>
                        <input type="number" step="0.1" name="weight" value={fitnessForm.weight ?? ""} onChange={handleFitnessInput} className="w-full border rounded px-2 py-1 text-sm bg-white" placeholder="70.1" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1">มวลกล้ามเนื้อ (กก.)</label>
                        <input type="number" step="0.1" name="skeletal_muscle_mass" value={fitnessForm.skeletal_muscle_mass ?? ""} onChange={handleFitnessInput} className="w-full border rounded px-2 py-1 text-sm bg-white" placeholder="24.2" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1">มวลไขมัน (กก.)</label>
                        <input type="number" step="0.1" name="body_fat_mass" value={fitnessForm.body_fat_mass ?? ""} onChange={handleFitnessInput} className="w-full border rounded px-2 py-1 text-sm bg-white" placeholder="26.6" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1">โปรตีน (กก.)</label>
                        <input type="number" step="0.1" name="protein" value={fitnessForm.protein ?? ""} onChange={handleFitnessInput} className="w-full border rounded px-2 py-1 text-sm bg-white" placeholder="8.5" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1">กระดูก/แร่ธาตุ (กก.)</label>
                        <input type="number" step="0.1" name="minerals" value={fitnessForm.minerals ?? ""} onChange={handleFitnessInput} className="w-full border rounded px-2 py-1 text-sm bg-white" placeholder="3.1" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1">น้ำในร่างกาย (กก.)</label>
                        <input type="number" step="0.1" name="total_body_water" value={fitnessForm.total_body_water ?? ""} onChange={handleFitnessInput} className="w-full border rounded px-2 py-1 text-sm bg-white" placeholder="31.9" />
                      </div>
                    </div>
                  </div>

                  {/* 2. การวิเคราะห์ภาวะอ้วน & ลงพุง */}
                  <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200">
                    <h5 className="text-sm font-bold text-amber-900 mb-3">
                      2. การวิเคราะห์ภาวะอ้วน & ลงพุง (Obesity Analysis)
                    </h5>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">BMI (kg/m²)</label>
                        <input type="number" step="0.1" name="bmi" value={fitnessForm.bmi ?? ""} onChange={handleFitnessInput} className="w-full border rounded px-2 py-1 text-sm bg-white" placeholder="28.1" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">% ไขมันร่างกาย (PBF)</label>
                        <input type="number" step="0.1" name="body_fat_percent" value={fitnessForm.body_fat_percent ?? ""} onChange={handleFitnessInput} className="w-full border rounded px-2 py-1 text-sm bg-white" placeholder="37.9" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">ระดับไขมันช่องท้อง</label>
                        <input type="number" name="visceral_fat_level" value={fitnessForm.visceral_fat_level ?? ""} onChange={handleFitnessInput} className="w-full border rounded px-2 py-1 text-sm bg-white" placeholder="11" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-amber-900 mb-1">เส้นรอบเอว (ซม.)</label>
                        <input type="number" step="0.1" name="waist_circumference" value={fitnessForm.waist_circumference ?? ""} onChange={handleFitnessInput} className="w-full border border-amber-400 rounded px-2 py-1 text-sm bg-white" placeholder="87.2" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-gray-700 mb-1">อัตราส่วนเอว/สะโพก</label>
                        <input type="number" step="0.01" name="waist_hip_ratio" value={fitnessForm.waist_hip_ratio ?? ""} onChange={handleFitnessInput} className="w-full border rounded px-2 py-1 text-sm bg-white" placeholder="0.91" />
                      </div>
                    </div>
                  </div>

                  {/* 3 & 4. การประเมิน & สัญญาณชีพ */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                      <h5 className="text-sm font-bold text-slate-800">3. การประเมินโดยรวม & พลังงาน</h5>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-gray-600 mb-1">อายุกาย (ปี)</label>
                          <input type="number" name="body_age" value={fitnessForm.body_age ?? ""} onChange={handleFitnessInput} className="w-full border rounded px-2 py-1 text-sm bg-white" placeholder="49" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-gray-600 mb-1">คะแนนร่างกาย</label>
                          <input type="number" name="body_score" value={fitnessForm.body_score ?? ""} onChange={handleFitnessInput} className="w-full border rounded px-2 py-1 text-sm bg-white" placeholder="70" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-gray-600 mb-1">BMR พลังงานพื้นฐาน</label>
                          <input type="number" name="estimated_bmr" value={fitnessForm.estimated_bmr ?? ""} onChange={handleFitnessInput} className="w-full border rounded px-2 py-1 text-sm bg-white" placeholder="1309" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-gray-600 mb-1">TDEE พลังงาน/วัน</label>
                          <input type="number" name="tdee" value={fitnessForm.tdee ?? ""} onChange={handleFitnessInput} className="w-full border rounded px-2 py-1 text-sm bg-white" placeholder="2028" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100 space-y-3">
                      <h5 className="text-sm font-bold text-rose-900">4. สัญญาณชีพ & ความดันโลหิต</h5>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-gray-600 mb-1">ความดันบน (Sys)</label>
                          <input type="number" name="sys_bp" value={fitnessForm.sys_bp ?? ""} onChange={handleFitnessInput} className="w-full border rounded px-2 py-1 text-sm bg-white" placeholder="120" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-gray-600 mb-1">ความดันล่าง (Dia)</label>
                          <input type="number" name="dia_bp" value={fitnessForm.dia_bp ?? ""} onChange={handleFitnessInput} className="w-full border rounded px-2 py-1 text-sm bg-white" placeholder="80" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-gray-600 mb-1">ชีพจร (bpm)</label>
                          <input type="number" name="resting_heart_rate" value={fitnessForm.resting_heart_rate ?? ""} onChange={handleFitnessInput} className="w-full border rounded px-2 py-1 text-sm bg-white" placeholder="72" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1">ความแข็งแรงกล้ามเนื้อ/ข้อเข่า</label>
                        <input type="text" name="muscle_strength" value={fitnessForm.muscle_strength || ""} onChange={handleFitnessInput} className="w-full border rounded px-2 py-1 text-sm bg-white" placeholder="เช่น กล้ามเนื้อขาสมดุลซ้าย/ขวา, ไม่เจ็บเข่า" />
                      </div>
                    </div>
                  </div>

                  {/* บันทึกเพิ่มเติม */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">คำแนะนำ / หมายเหตุเพิ่มเติมจากเทรนเนอร์</label>
                    <textarea
                      name="remark"
                      value={fitnessForm.remark || ""}
                      onChange={handleFitnessInput}
                      rows="2"
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-purple-500 text-sm"
                      placeholder="เช่น แนะนำลดไขมันสะสม 12.1 kg, เพิ่มการเล่นสร้างกล้ามเนื้อต้นขาเพื่อช่วยพยุงเข่า..."
                    />
                  </div>

                  {/* ปุ่มกดบันทึก */}
                  <div className="flex space-x-3 pt-3 border-t">
                    <button
                      onClick={handleSaveFitness}
                      disabled={saving}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
                    >
                      {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      <span>บันทึกผลทดสอบ</span>
                    </button>
                    <button onClick={() => setFitnessMode("list")} className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 rounded-lg font-semibold">
                      ยกเลิก
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center">
            <div className="h-14 w-14 mx-auto rounded-full flex items-center justify-center bg-red-100 text-red-600 mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">{confirmModal.title}</h3>
            <p className="text-sm text-gray-500 mt-2">{confirmModal.description}</p>
            <div className="flex gap-3 mt-6">
              <button onClick={closeConfirmModal} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg font-semibold">
                ยกเลิก
              </button>
              <button onClick={handleConfirmAction} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-semibold shadow">
                ลบข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-6 right-6 z-[60]">
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border ${
            toast.type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
          }`}>
            {toast.type === "success" ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
            <p className="font-semibold text-sm">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerTrainees;