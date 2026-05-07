import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Edit,
  Trash2,
  X,
  Save,
  Dumbbell,
  Info,
  Eye,
} from "lucide-react";

import api from "../../services/api";

function TrainerExercises() {
  const IMAGE_URL = "http://localhost:5000/uploads/";

  const [exercises, setExercises] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ modal ดูรายละเอียด
  const [viewExercise, setViewExercise] = useState(null);

  const [modalMode, setModalMode] = useState("add");

  const [formData, setFormData] = useState({
    id: null,
    exercise_name: "",
    description: "",
    equipment_type: "",
    exercise_type: "",
    image: null,
  });

  const muscleGroups = [
    "หน้าอก",
    "หลัง",
    "หัวไหล่",
    "ขา",
    "แขน",
    "แกนกลางลำตัว",
    "คาร์ดิโอ",
    "ทั้งร่างกาย",
  ];

  const equipmentOptions = [
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

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await api.get("/exercises");

      const formattedData = response.data.map((ex) => ({
        id: ex._id,
        exercise_name: ex.exercise_name,
        description: ex.description || "",
        equipment_type: ex.equipment_type,
        exercise_type: ex.exercise_type,
        image: ex.image || null,
        ownerRole: ex.ownerRole,
      }));

      setExercises(formattedData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenModal = (mode, exercise = null) => {
    setModalMode(mode);

    if (exercise) {
      setFormData({
        id: exercise.id,
        exercise_name: exercise.exercise_name,
        description: exercise.description,
        equipment_type: exercise.equipment_type,
        exercise_type: exercise.exercise_type,
        image: exercise.image || null,
      });
    } else {
      setFormData({
        id: null,
        exercise_name: "",
        description: "",
        equipment_type: "",
        exercise_type: "",
        image: null,
      });
    }

    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

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

      if (formData.image instanceof File) {
        payload.append("image", formData.image);
      }

      if (modalMode === "add") {
        await api.post("/exercises", payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await api.put(`/exercises/${formData.id}`, payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setIsModalOpen(false);

      fetchExercises();

      alert("บันทึกสำเร็จ");
    } catch (error) {
      console.error(error);

      alert("เกิดข้อผิดพลาด");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("ลบท่าฝึกนี้ใช่หรือไม่?")) {
      await api.delete(`/exercises/${id}`);

      fetchExercises();
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">
            คลังท่าฝึกสอน
          </h1>

          <p className="text-slate-500">
            จัดการข้อมูลท่าออกกำลังกาย
          </p>
        </div>

        <button
          onClick={() => handleOpenModal("add")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg"
        >
          <PlusCircle className="w-5 h-5" />
          เพิ่มท่าฝึกใหม่
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b">
              <th className="px-6 py-4">ท่าฝึก</th>

              <th className="px-6 py-4">กลุ่มกล้ามเนื้อ</th>

              <th className="px-6 py-4">อุปกรณ์</th>

              <th className="px-6 py-4">รายละเอียด</th>

              <th className="px-6 py-4 text-center">จัดการ</th>
            </tr>
          </thead>

          <tbody>
            {exercises.map((ex) => (
              <tr key={ex.id} className="border-b hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        ex.image
                          ? `${IMAGE_URL}${ex.image}`
                          : "https://via.placeholder.com/60"
                      }
                      alt={ex.exercise_name}
                      className="w-16 h-16 object-cover rounded-xl border"
                    />

                    <span className="font-bold">
                      {ex.exercise_name}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  {ex.exercise_type}
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="w-4 h-4" />

                    {ex.equipment_type}
                  </div>
                </td>

                <td className="px-6 py-4 max-w-xs">
                  <div className="flex gap-2">
                    <Info className="w-4 h-4 mt-1 shrink-0" />

                    <p className="text-sm line-clamp-2">
                      {ex.description || "-"}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-4 text-center">
                  {/* ✅ ปุ่มดูรายละเอียด */}
                  <button
                    onClick={() => setViewExercise(ex)}
                    className="p-2 text-slate-600 hover:text-black"
                  >
                    <Eye className="w-5 h-5" />
                  </button>

                  {ex.ownerRole === "admin" ? (
                    <span className="text-xs text-slate-400 font-semibold">
                      ของแอดมิน
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleOpenModal("edit", ex)}
                        className="p-2 text-blue-600"
                      >
                        <Edit className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => handleDelete(ex.id)}
                        className="p-2 text-red-500"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Modal ดูรายละเอียด */}
      {viewExercise && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden">

            <div className="bg-slate-50 px-8 py-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-black">
                รายละเอียดท่าฝึก
              </h2>

              <button onClick={() => setViewExercise(null)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-5">

              <img
                src={
                  viewExercise.image
                    ? `${IMAGE_URL}${viewExercise.image}`
                    : "https://via.placeholder.com/500x300"
                }
                alt={viewExercise.exercise_name}
                className="w-full h-64 object-cover rounded-xl border"
              />

              <div>
                <p className="text-sm text-slate-500">
                  ชื่อท่า
                </p>

                <h3 className="text-2xl font-black">
                  {viewExercise.exercise_name}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-xl p-4">
                  <p className="text-sm text-slate-500">
                    กลุ่มกล้ามเนื้อ
                  </p>

                  <p className="font-bold">
                    {viewExercise.exercise_type}
                  </p>
                </div>

                <div className="border rounded-xl p-4">
                  <p className="text-sm text-slate-500">
                    อุปกรณ์
                  </p>

                  <p className="font-bold">
                    {viewExercise.equipment_type}
                  </p>
                </div>
              </div>

              <div className="border rounded-xl p-4">
                <p className="text-sm text-slate-500 mb-2">
                  รายละเอียด
                </p>

                <p>
                  {viewExercise.description || "ไม่มีรายละเอียด"}
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ✅ Modal เพิ่ม/แก้ไข */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden">
            <div className="bg-slate-50 px-8 py-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-black">
                {modalMode === "add"
                  ? "เพิ่มท่าฝึกใหม่"
                  : "แก้ไขท่าฝึก"}
              </h2>

              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-5">
              <div>
                <label className="block mb-1 font-bold">
                  ชื่อท่าฝึก
                </label>

                <input
                  type="text"
                  name="exercise_name"
                  value={formData.exercise_name}
                  onChange={handleInputChange}
                  className="w-full border rounded-xl px-4 py-3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-bold">
                    กลุ่มกล้ามเนื้อ
                  </label>

                  <select
                    name="exercise_type"
                    value={formData.exercise_type}
                    onChange={handleInputChange}
                    className="w-full border rounded-xl px-4 py-3"
                  >
                    <option value="">เลือก</option>

                    {muscleGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-bold">
                    อุปกรณ์
                  </label>

                  <select
                    name="equipment_type"
                    value={formData.equipment_type}
                    onChange={handleInputChange}
                    className="w-full border rounded-xl px-4 py-3"
                  >
                    <option value="">เลือก</option>

                    {equipmentOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1 font-bold">
                  รายละเอียด
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full border rounded-xl px-4 py-3 resize-none"
                />
              </div>

              <div>
                <label className="block mb-1 font-bold">
                  รูปท่าฝึก
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border rounded-xl px-4 py-3"
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
                  className="w-full h-56 object-cover rounded-xl border"
                />
              )}

              <button
                onClick={handleSave}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2"
              >
                <Save className="w-5 h-5" />
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