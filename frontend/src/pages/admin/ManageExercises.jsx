import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  Dumbbell,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  CheckCircle,
  XCircle,
  Filter,
  Activity,
  Package,
  FileText,
} from "lucide-react";

const IMAGE_URL = "http://localhost:5000/uploads/";

const EXERCISE_TYPES = [
  "ทุกส่วนของร่างกาย",
  "ทั่วทั้งร่างกาย",
  "หลัง",
  "หน้าอก",
  "หัวไหล่",
  "ขา",
  "แขน",
  "แกนกลางลำตัว",
  "คาร์ดิโอ",
];

const TYPE_COLORS = {
  ทุกส่วนของร่างกาย: "from-purple-500 to-pink-600",
  ทั่วทั้งร่างกาย: "from-blue-500 to-cyan-600",
  หลัง: "from-green-500 to-emerald-600",
  หน้าอก: "from-red-500 to-orange-600",
  หัวไหล่: "from-yellow-500 to-orange-500",
  ขา: "from-indigo-500 to-purple-600",
  แขน: "from-pink-500 to-rose-600",
  แกนกลางลำตัว: "from-teal-500 to-cyan-600",
  คาร์ดิโอ: "from-orange-500 to-red-600",
};

const EQUIPMENT_LIST = [
  { label: "ดัมเบล", value: "dumbbell" },
  { label: "บาร์เบล", value: "barbell" },
  { label: "แคทเทิลเบล", value: "kettlebell" },
  { label: "เครื่อง", value: "machine" },
  { label: "เคเบิล", value: "cable" },
  { label: "คาลิสเทนิกส์", value: "calisthenics" },
  { label: "ยางยืด", value: "resistance_band" },
  { label: "ลูกบอลฝึกสมดุล", value: "balance_ball" },
  { label: "ลูกบอลยาง", value: "medicine_ball" },
  { label: "อื่นๆ", value: "other" },
];

const EQUIPMENT_LABEL_MAP = EQUIPMENT_LIST.reduce((acc, item) => {
  acc[item.value] = item.label;
  return acc;
}, {});

export default function ManageExercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    exercise_name: "",
    exercise_type: "",
    equipment_type: "",
    description: "",
    image: null,
  });

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [equipmentFilter, setEquipmentFilter] = useState("all");
  const [errors, setErrors] = useState({});

  // ===== LOAD =====
  const fetchExercises = async () => {
    try {
      const res = await api.get("/exercises");
      setExercises(res.data);
    } catch (err) {
      console.error("โหลดท่าไม่สำเร็จ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  // ===== OPEN ADD =====
  const openAdd = () => {
    setEditing(null);

    setForm({
      exercise_name: "",
      exercise_type: "",
      equipment_type: "",
      description: "",
      image: null,
    });

    setErrors({});
    setShowModal(true);
  };

  // ===== OPEN EDIT =====
  const openEdit = (ex) => {
    setEditing(ex);

    setForm({
      exercise_name: ex.exercise_name,
      exercise_type: ex.exercise_type,
      equipment_type: ex.equipment_type || "",
      description: ex.description || "",
      image: ex.image || null,
    });

    setErrors({});
    setShowModal(true);
  };

  // ===== CHANGE =====
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  // ===== IMAGE =====
  const handleImageChange = (e) => {
    setForm({
      ...form,
      image: e.target.files[0],
    });
  };

  // ===== VALIDATE =====
  const validate = () => {
    const newErrors = {};

    if (!form.exercise_name.trim()) {
      newErrors.exercise_name = "กรุณากรอกชื่อท่า";
    }

    if (!form.exercise_type) {
      newErrors.exercise_type = "กรุณาเลือกประเภทท่า";
    }

    if (!form.equipment_type) {
      newErrors.equipment_type = "กรุณาเลือกอุปกรณ์";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ===== SAVE =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const payload = new FormData();

      payload.append("exercise_name", form.exercise_name);

      payload.append("exercise_type", form.exercise_type);

      payload.append("equipment_type", form.equipment_type);

      payload.append("description", form.description);

      if (form.image instanceof File) {
        payload.append("image", form.image);
      }

      if (editing) {
        await api.put(`/exercises/${editing._id}`, payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        alert("แก้ไขท่าเรียบร้อยแล้ว ✅");
      } else {
        await api.post("/exercises", payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        alert("เพิ่มท่าออกกำลังกายเรียบร้อยแล้ว ✅");
      }

      setShowModal(false);

      fetchExercises();
    } catch (err) {
      alert(err.response?.data?.message || "บันทึกไม่สำเร็จ");
    }
  };

  // ===== DELETE =====
  const handleDelete = async (id) => {
    if (!confirm("ต้องการลบท่านี้ใช่หรือไม่?")) return;

    try {
      await api.delete(`/exercises/${id}`);
      fetchExercises();
    } catch (err) {
      alert("ลบไม่สำเร็จ");
    }
  };

  // ===== FILTER =====
  const filteredExercises = exercises.filter((ex) => {
    const keyword = search.toLowerCase();

    const equipmentValue = Array.isArray(ex.equipment_type)
      ? ex.equipment_type.join(" ")
      : ex.equipment_type || "";

    const matchSearch =
      ex.exercise_name.toLowerCase().includes(keyword) ||
      ex.exercise_type.toLowerCase().includes(keyword) ||
      equipmentValue.toLowerCase().includes(keyword);

    const matchType = typeFilter === "all" || ex.exercise_type === typeFilter;

    const matchEquipment =
      equipmentFilter === "all" ||
      (Array.isArray(ex.equipment_type)
        ? ex.equipment_type.includes(equipmentFilter)
        : ex.equipment_type === equipmentFilter);

    return matchSearch && matchType && matchEquipment;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <Dumbbell className="w-7 h-7 text-white" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                จัดการท่าออกกำลังกาย
              </h1>

              <p className="text-slate-600 text-sm">
                ทั้งหมด {exercises.length} ท่า
              </p>
            </div>
          </div>

          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
          >
            <Plus className="w-5 h-5" />
            เพิ่มท่าใหม่
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left">ชื่อท่า</th>

                  <th className="px-6 py-4 text-left">ประเภท</th>

                  <th className="px-6 py-4 text-left">อุปกรณ์</th>

                  <th className="px-6 py-4 text-left">รายละเอียด</th>

                  <th className="px-6 py-4 text-center">จัดการ</th>
                </tr>
              </thead>

              <tbody>
                {filteredExercises.map((ex) => (
                  <tr key={ex._id} className="border-b hover:bg-slate-50">
                    {/* NAME */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            ex.image
                              ? `${IMAGE_URL}${ex.image}`
                              : "https://via.placeholder.com/80"
                          }
                          alt={ex.exercise_name}
                          className="w-14 h-14 rounded-xl object-cover border shadow"
                        />

                        <span className="font-semibold text-slate-800">
                          {ex.exercise_name}
                        </span>
                      </div>
                    </td>

                    {/* TYPE */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs text-white bg-gradient-to-r ${
                          TYPE_COLORS[ex.exercise_type] ||
                          "from-slate-400 to-slate-500"
                        }`}
                      >
                        {ex.exercise_type}
                      </span>
                    </td>

                    {/* EQUIPMENT */}
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-slate-200 rounded-full text-xs">
                        {EQUIPMENT_LABEL_MAP[ex.equipment_type] ||
                          ex.equipment_type}
                      </span>
                    </td>

                    {/* DESCRIPTION */}
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        {ex.description ? (
                          <p className="text-sm text-slate-600 line-clamp-2">
                            {ex.description}
                          </p>
                        ) : (
                          <span className="text-slate-400 text-sm">
                            ไม่มีรายละเอียด
                          </span>
                        )}
                      </div>
                    </td>

                    {/* ACTION */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEdit(ex)}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(ex._id)}
                          className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
              {/* HEADER */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  {editing ? "แก้ไขท่า" : "เพิ่มท่าออกกำลังกาย"}
                </h2>

                <button onClick={() => setShowModal(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* BODY */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* NAME */}
                <div>
                  <label className="block mb-2 font-semibold">ชื่อท่า</label>

                  <input
                    name="exercise_name"
                    value={form.exercise_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl"
                  />

                  {errors.exercise_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.exercise_name}
                    </p>
                  )}
                </div>

                {/* TYPE */}
                <div>
                  <label className="block mb-2 font-semibold">ประเภทท่า</label>

                  <select
                    name="exercise_type"
                    value={form.exercise_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl"
                  >
                    <option value="">-- เลือกประเภท --</option>

                    {EXERCISE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* EQUIPMENT */}
                <div>
                  <label className="block mb-2 font-semibold">อุปกรณ์</label>

                  <select
                    name="equipment_type"
                    value={form.equipment_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl"
                  >
                    <option value="">-- เลือกอุปกรณ์ --</option>

                    {EQUIPMENT_LIST.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label className="block mb-2 font-semibold">รายละเอียด</label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border rounded-xl"
                  />
                </div>

                {/* IMAGE */}
                <div>
                  <label className="block mb-2 font-semibold">
                    รูปท่าออกกำลังกาย
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 border rounded-xl"
                  />
                </div>

                {/* PREVIEW */}
                {form.image && (
                  <img
                    src={
                      form.image instanceof File
                        ? URL.createObjectURL(form.image)
                        : `${IMAGE_URL}${form.image}`
                    }
                    alt="preview"
                    className="w-full h-56 object-cover rounded-xl border"
                  />
                )}

                {/* FOOTER */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-xl font-semibold"
                  >
                    ยกเลิก
                  </button>

                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold flex justify-center items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    บันทึก
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
