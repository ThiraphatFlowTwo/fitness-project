import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Edit,
  Trash2,
  X,
  Save,
  Dumbbell,
  Eye,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react";
import api from "../../services/api";

const IMAGE_URL = "http://localhost:5000/uploads/";

const MUSCLE_GROUPS = [
  "หน้าอก",
  "หลัง",
  "หัวไหล่",
  "ขา",
  "แขน",
  "แกนกลางลำตัว",
  "คาร์ดิโอ",
  "ทั้งร่างกาย",
];

const EQUIPMENT_OPTIONS = [
  "น้ำหนักตัว",
  "ดัมเบล",
  "บาร์เบล",
  "เครื่องออกกำลังกาย",
  "เคเบิล",
  "เคตเทิลเบล",
  "แผ่นน้ำหนัก",
  "ยางยืด",
  "อื่นๆ",
];

// ===== Dictionary แปลงภาษาอังกฤษจาก DB เป็นภาษาไทย =====
const EQUIPMENT_MAPPER = {
  bodyweight: "น้ำหนักตัว",
  dumbbell: "ดัมเบล",
  barbell: "บาร์เบล",
  machine: "เครื่องออกกำลังกาย",
  cable: "เคเบิล",
  kettlebell: "เคตเทิลเบล",
  weight_plate: "แผ่นน้ำหนัก",
  resistance_band: "ยางยืด",
  other: "อื่นๆ",
  "น้ำหนักตัว": "น้ำหนักตัว",
  "ดัมเบล": "ดัมเบล",
  "บาร์เบล": "บาร์เบล",
  "เครื่องออกกำลังกาย": "เครื่องออกกำลังกาย",
  "เคเบิล": "เคเบิล",
  "เคตเทิลเบล": "เคตเทิลเบล",
  "แผ่นน้ำหนัก": "แผ่นน้ำหนัก",
  "ยางยืด": "ยางยืด",
  "อื่นๆ": "อื่นๆ",
};

// ฟังก์ชันช่วยแปลงชื่ออุปกรณ์
const getEquipmentLabel = (type) => {
  if (!type) return "-";
  const cleanType = String(type).trim().toLowerCase();
  return EQUIPMENT_MAPPER[cleanType] || type;
};

const EXERCISE_CATEGORIES = [
  { value: "weight", label: "ใช้น้ำหนัก (kg)" },
  { value: "cardio", label: "คาร์ดิโอ (ระยะทาง/เวลา)" },
  { value: "bodyweight", label: "น้ำหนักตัว (ครั้ง/วินาที)" },
  { value: "duration", label: "เวลาอย่างเดียว (วินาที)" },
];

const EMPTY_FORM = {
  id: null,
  exercise_name: "",
  description: "",
  equipment_type: "",
  exercise_type: "",
  exercise_category: "weight",
  image: null,
};

function TrainerExercises() {
  const [exercises, setExercises] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewExercise, setViewExercise] = useState(null);
  const [modalMode, setModalMode] = useState("add");
  const [formData, setFormData] = useState(EMPTY_FORM);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // ===== สถานะการแสดงผลการแจ้งเตือน (Toast) =====
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  // ===== สถานะ Modal ยืนยันการลบ =====
  const [confirmDeleteEx, setConfirmDeleteEx] = useState(null);
  const closeConfirmDelete = () => setConfirmDeleteEx(null);

  const canEdit = (ex) => {
    if (ex.ownerRole === "admin") return false;
    if (!ex.created_by) return true;
    return (ex.created_by?._id || ex.created_by) === currentUser.id;
  };

  const fetchExercises = async () => {
    try {
      const res = await api.get("/exercises");
      setExercises(
        res.data.map((ex) => ({
          id: ex._id,
          exercise_name: ex.exercise_name,
          description: ex.description || "",
          equipment_type: ex.equipment_type,
          exercise_type: ex.exercise_type,
          exercise_category: ex.exercise_category || "weight",
          image: ex.image || null,
          ownerRole: ex.ownerRole,
          created_by: ex.created_by,
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleOpenModal = (mode, exercise = null) => {
    setModalMode(mode);
    setFormData(
      exercise
        ? {
            id: exercise.id,
            exercise_name: exercise.exercise_name,
            description: exercise.description,
            equipment_type: exercise.equipment_type,
            exercise_type: exercise.exercise_type,
            exercise_category: exercise.exercise_category || "weight",
            image: exercise.image || null,
          }
        : EMPTY_FORM
    );
    setIsModalOpen(true);
  };

  const handleInputChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleImageChange = (e) =>
    setFormData((p) => ({ ...p, image: e.target.files[0] }));

  const handleSave = async () => {
    if (
      !formData.exercise_name ||
      !formData.exercise_type ||
      !formData.equipment_type
    ) {
      showToast("กรุณากรอกข้อมูลให้ครบถ้วน", "error");
      return;
    }
    try {
      const payload = new FormData();
      payload.append("exercise_name", formData.exercise_name);
      payload.append("description", formData.description);
      payload.append("equipment_type", formData.equipment_type);
      payload.append("exercise_type", formData.exercise_type);
      payload.append("exercise_category", formData.exercise_category);
      if (formData.image instanceof File)
        payload.append("image", formData.image);

      if (modalMode === "add") {
        await api.post("/exercises", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.put(`/exercises/${formData.id}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setIsModalOpen(false);
      fetchExercises();
      showToast(
        modalMode === "add" ? "เพิ่มท่าฝึกสำเร็จ" : "แก้ไขท่าฝึกสำเร็จ",
        "success"
      );
    } catch (err) {
      showToast(err.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึก", "error");
    }
  };

  const handleDeleteClick = (ex) => setConfirmDeleteEx(ex);

  const confirmDelete = async () => {
    if (!confirmDeleteEx) return;
    try {
      await api.delete(`/exercises/${confirmDeleteEx.id}`);
      closeConfirmDelete();
      fetchExercises();
      showToast("ลบท่าฝึกเรียบร้อยแล้ว", "success");
    } catch (err) {
      closeConfirmDelete();
      showToast(err.response?.data?.message || "ลบท่าฝึกไม่สำเร็จ", "error");
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* ส่วนหัวข้อ (Header) */}
      <div className="flex justify-between items-center mb-4 md:mb-8">
        <div>
          <h1 className="text-xl md:text-3xl font-extrabold text-slate-800">
            คลังท่าฝึกสอน
          </h1>
          <p className="text-sm text-slate-500">จัดการข้อมูลท่าออกกำลังกาย</p>
        </div>
        <button
          onClick={() => handleOpenModal("add")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 md:px-6 md:py-2.5 rounded-xl font-bold flex items-center gap-1 md:gap-2 shadow-lg text-sm md:text-base transition-colors"
        >
          <PlusCircle className="w-4 h-4 md:w-5 md:h-5" />
          <span className="hidden sm:inline">เพิ่มท่าฝึกใหม่</span>
          <span className="sm:hidden">เพิ่ม</span>
        </button>
      </div>

      {/* ตารางแสดงรายการท่าฝึก */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm">
                  ท่าฝึก
                </th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm">
                  กลุ่มกล้ามเนื้อ
                </th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm">
                  อุปกรณ์
                </th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm">
                  สร้างโดย
                </th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-center text-sm">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody>
              {exercises.map((ex) => (
                <tr key={ex.id} className="border-b hover:bg-slate-50">
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      <img
                        src={
                          ex.image
                            ? `${IMAGE_URL}${ex.image}`
                            : "https://via.placeholder.com/60?text=ไม่มีรูปภาพ"
                        }
                        alt={ex.exercise_name}
                        className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-xl border shrink-0"
                      />
                      <span className="font-bold text-sm md:text-base">
                        {ex.exercise_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-sm">
                    {ex.exercise_type}
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <div className="flex items-center gap-1 md:gap-2 text-sm">
                      <Dumbbell className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                      {/* เรียกใช้ฟังก์ชันแปลภาษาอุปกรณ์ที่นี่ */}
                      {getEquipmentLabel(ex.equipment_type)}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        ex.ownerRole === "admin"
                          ? "bg-red-50 text-red-600"
                          : canEdit(ex)
                            ? "bg-indigo-50 text-indigo-600"
                            : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {ex.ownerRole === "admin"
                        ? "🛡️ แอดมิน"
                        : canEdit(ex)
                          ? "✏️ ของฉัน"
                          : "🏋️ เทรนเนอร์ท่านอื่น"}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-center">
                    <div className="flex items-center justify-center gap-0.5 md:gap-1">
                      <button
                        onClick={() => setViewExercise(ex)}
                        className="p-1.5 md:p-2 text-slate-600 hover:text-black transition-colors"
                        title="ดูรายละเอียด"
                      >
                        <Eye className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      {canEdit(ex) ? (
                        <>
                          <button
                            onClick={() => handleOpenModal("edit", ex)}
                            className="p-1.5 md:p-2 text-blue-600 hover:text-blue-800 transition-colors"
                            title="แก้ไข"
                          >
                            <Edit className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(ex)}
                            className="p-1.5 md:p-2 text-red-500 hover:text-red-700 transition-colors"
                            title="ลบ"
                          >
                            <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400 italic ml-1">
                          ดูอย่างเดียว
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal ดูรายละเอียด */}
      {viewExercise && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-3 md:p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-slate-50 px-4 py-4 md:px-8 md:py-6 border-b flex justify-between items-center sticky top-0">
              <h2 className="text-lg md:text-xl font-black">
                รายละเอียดท่าฝึก
              </h2>
              <button onClick={() => setViewExercise(null)}>
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
            <div className="p-4 md:p-8 space-y-4 md:space-y-5">
              <img
                src={
                  viewExercise.image
                    ? `${IMAGE_URL}${viewExercise.image}`
                    : "https://via.placeholder.com/500x300?text=ไม่มีรูปภาพ"
                }
                alt={viewExercise.exercise_name}
                className="w-full h-48 md:h-64 object-cover rounded-xl border"
              />
              <div>
                <p className="text-sm text-slate-500">ชื่อท่า</p>
                <h3 className="text-xl md:text-2xl font-black">
                  {viewExercise.exercise_name}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {[
                  {
                    label: "กลุ่มกล้ามเนื้อ",
                    value: viewExercise.exercise_type,
                  },
                  {
                    label: "อุปกรณ์",
                    value: getEquipmentLabel(viewExercise.equipment_type),
                  },
                  {
                    label: "ประเภทการวัดผล",
                    value:
                      EXERCISE_CATEGORIES.find(
                        (c) => c.value === viewExercise.exercise_category
                      )?.label || "-",
                  },
                  {
                    label: "สร้างโดย",
                    value:
                      viewExercise.ownerRole === "admin"
                        ? "🛡️ แอดมิน"
                        : "🏋️ เทรนเนอร์",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="border rounded-xl p-3 md:p-4"
                  >
                    <p className="text-xs text-slate-500">{item.label}</p>
                    <p className="font-bold text-sm md:text-base">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border rounded-xl p-3 md:p-4">
                <p className="text-sm text-slate-500 mb-2">รายละเอียด</p>
                <p className="text-sm md:text-base">
                  {viewExercise.description || "ไม่มีรายละเอียดเพิ่มเติม"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal เพิ่ม/แก้ไข */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-3 md:p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="bg-slate-50 px-4 py-4 md:px-8 md:py-6 border-b flex justify-between items-center sticky top-0">
              <h2 className="text-lg md:text-xl font-black">
                {modalMode === "add" ? "เพิ่มท่าฝึกใหม่" : "แก้ไขท่าฝึก"}
              </h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
            <div className="p-4 md:p-8 space-y-4 md:space-y-5">
              <div>
                <label className="block mb-1 font-bold text-sm md:text-base">
                  ชื่อท่าฝึก <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="exercise_name"
                  value={formData.exercise_name}
                  onChange={handleInputChange}
                  placeholder="เช่น Bench Press"
                  className="w-full border rounded-xl px-3 py-2 md:px-4 md:py-3 text-sm md:text-base"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block mb-1 font-bold text-sm">
                    กลุ่มกล้ามเนื้อ <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="exercise_type"
                    value={formData.exercise_type}
                    onChange={handleInputChange}
                    className="w-full border rounded-xl px-3 py-2 md:px-4 md:py-3 text-sm"
                  >
                    <option value="">เลือกกลุ่มกล้ามเนื้อ</option>
                    {MUSCLE_GROUPS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-bold text-sm">
                    อุปกรณ์ <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="equipment_type"
                    value={formData.equipment_type}
                    onChange={handleInputChange}
                    className="w-full border rounded-xl px-3 py-2 md:px-4 md:py-3 text-sm"
                  >
                    <option value="">เลือกอุปกรณ์</option>
                    {EQUIPMENT_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block mb-1 font-bold text-sm md:text-base">
                  ประเภทการวัดผล
                </label>
                <select
                  name="exercise_category"
                  value={formData.exercise_category}
                  onChange={handleInputChange}
                  className="w-full border rounded-xl px-3 py-2 md:px-4 md:py-3 text-sm md:text-base"
                >
                  {EXERCISE_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-bold text-sm md:text-base">
                  รายละเอียด
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="อธิบายวิธีเล่น หรือเทคนิคการฝึก..."
                  rows="3"
                  className="w-full border rounded-xl px-3 py-2 md:px-4 md:py-3 resize-none text-sm md:text-base"
                />
              </div>
              <div>
                <label className="block mb-1 font-bold text-sm md:text-base">
                  รูปภาพท่าฝึก
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border rounded-xl px-3 py-2 md:px-4 md:py-3 text-sm"
                />
              </div>
              {formData.image && (
                <img
                  src={
                    formData.image instanceof File
                      ? URL.createObjectURL(formData.image)
                      : `${IMAGE_URL}${formData.image}`
                  }
                  alt="ตัวอย่างรูปภาพ"
                  className="w-full h-44 md:h-56 object-cover rounded-xl border"
                />
              )}
              <button
                onClick={handleSave}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 md:py-4 rounded-xl font-bold flex justify-center items-center gap-2 text-sm md:text-base transition-colors"
              >
                <Save className="w-4 h-4 md:w-5 md:h-5" />
                บันทึกท่าฝึก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal ยืนยันการลบ */}
      {confirmDeleteEx && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-3 md:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
            <div className="h-16 w-16 mx-auto rounded-2xl flex items-center justify-center shadow-lg ring-8 ring-red-100 bg-gradient-to-br from-red-500 to-rose-600">
              <Trash2 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mt-4">
              ยืนยันการลบท่าฝึก
            </h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              ต้องการลบท่า "{confirmDeleteEx.exercise_name}" ใช่หรือไม่?
              การกระทำนี้ไม่สามารถย้อนกลับได้
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={closeConfirmDelete}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                ลบท่านี้
              </button>
            </div>
          </div>
        </div>
      )}

      {/* การแจ้งเตือน (Toast Notification) */}
      {toast.show && (
        <div className="fixed top-6 right-6 z-[60]">
          <div
            className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border-2 backdrop-blur-sm min-w-[280px] ${
              toast.type === "success"
                ? "bg-green-50/95 border-green-200"
                : toast.type === "error"
                ? "bg-red-50/95 border-red-200"
                : "bg-blue-50/95 border-blue-200"
            }`}
          >
            <div
              className={`h-9 w-9 shrink-0 rounded-full flex items-center justify-center ${
                toast.type === "success"
                  ? "bg-green-500"
                  : toast.type === "error"
                  ? "bg-red-500"
                  : "bg-blue-500"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle className="w-5 h-5 text-white" />
              ) : toast.type === "error" ? (
                <XCircle className="w-5 h-5 text-white" />
              ) : (
                <Info className="w-5 h-5 text-white" />
              )}
            </div>
            <p
              className={`font-semibold text-sm ${
                toast.type === "success"
                  ? "text-green-800"
                  : toast.type === "error"
                  ? "text-red-800"
                  : "text-blue-800"
              }`}
            >
              {toast.message}
            </p>
            <button
              onClick={() => setToast((prev) => ({ ...prev, show: false }))}
              className="ml-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrainerExercises;