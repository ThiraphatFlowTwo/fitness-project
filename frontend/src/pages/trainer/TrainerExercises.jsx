import React, { useState, useEffect } from "react";
import { PlusCircle, Edit, Trash2, X, Save, Dumbbell, Eye } from "lucide-react";
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
        })),
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
        : EMPTY_FORM,
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
      alert("กรุณากรอกข้อมูลให้ครบ");
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
      alert("บันทึกสำเร็จ ✅");
    } catch (err) {
      alert(err.response?.data?.message || "เกิดข้อผิดพลาด");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("ลบท่าฝึกนี้ใช่หรือไม่?")) return;
    try {
      await api.delete(`/exercises/${id}`);
      fetchExercises();
    } catch (err) {
      alert(err.response?.data?.message || "ลบไม่สำเร็จ");
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 md:mb-8">
        <div>
          <h1 className="text-xl md:text-3xl font-extrabold text-slate-800">
            คลังท่าฝึกสอน
          </h1>
          <p className="text-sm text-slate-500">จัดการข้อมูลท่าออกกำลังกาย</p>
        </div>
        <button
          onClick={() => handleOpenModal("add")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 md:px-6 md:py-2.5 rounded-xl font-bold flex items-center gap-1 md:gap-2 shadow-lg text-sm md:text-base"
        >
          <PlusCircle className="w-4 h-4 md:w-5 md:h-5" />
          <span className="hidden sm:inline">เพิ่มท่าฝึกใหม่</span>
          <span className="sm:hidden">เพิ่ม</span>
        </button>
      </div>

      {/* Table */}
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
                            : "https://via.placeholder.com/60"
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
                      {ex.equipment_type}
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
                        ? "🛡️ Admin"
                        : canEdit(ex)
                          ? "✏️ ของฉัน"
                          : "🏋️ เทรนเนอร์อื่น"}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-center">
                    <div className="flex items-center justify-center gap-0.5 md:gap-1">
                      <button
                        onClick={() => setViewExercise(ex)}
                        className="p-1.5 md:p-2 text-slate-600 hover:text-black"
                        title="ดูรายละเอียด"
                      >
                        <Eye className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      {canEdit(ex) ? (
                        <>
                          <button
                            onClick={() => handleOpenModal("edit", ex)}
                            className="p-1.5 md:p-2 text-blue-600 hover:text-blue-800"
                            title="แก้ไข"
                          >
                            <Edit className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(ex.id)}
                            className="p-1.5 md:p-2 text-red-500 hover:text-red-700"
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
                    : "https://via.placeholder.com/500x300"
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
                  { label: "อุปกรณ์", value: viewExercise.equipment_type },
                  {
                    label: "ประเภทการวัดผล",
                    value:
                      EXERCISE_CATEGORIES.find(
                        (c) => c.value === viewExercise.exercise_category,
                      )?.label || "-",
                  },
                  {
                    label: "สร้างโดย",
                    value:
                      viewExercise.ownerRole === "admin"
                        ? "🛡️ Admin"
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
                  {viewExercise.description || "ไม่มีรายละเอียด"}
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
                    <option value="">เลือก</option>
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
                    <option value="">เลือก</option>
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
                  rows="3"
                  className="w-full border rounded-xl px-3 py-2 md:px-4 md:py-3 resize-none text-sm md:text-base"
                />
              </div>
              <div>
                <label className="block mb-1 font-bold text-sm md:text-base">
                  รูปท่าฝึก
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
                  alt="preview"
                  className="w-full h-44 md:h-56 object-cover rounded-xl border"
                />
              )}
              <button
                onClick={handleSave}
                className="w-full bg-indigo-600 text-white py-3 md:py-4 rounded-xl font-bold flex justify-center items-center gap-2 text-sm md:text-base"
              >
                <Save className="w-4 h-4 md:w-5 md:h-5" />
                บันทึกท่าฝึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrainerExercises;
