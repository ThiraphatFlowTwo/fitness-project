import { useEffect, useState } from "react";
import api from "../../services/api";
import { Dumbbell, Plus, Edit2, Trash2, X, CheckCircle } from "lucide-react";

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

const EXERCISE_CATEGORIES = [
  {
    value: "weight",
    label: "ใช้น้ำหนัก (kg)",
    desc: "Squat, Bench Press, Deadlift",
  },
  {
    value: "cardio",
    label: "คาร์ดิโอ (ระยะทาง/เวลา)",
    desc: "วิ่ง, ปั่นจักรยาน, Rowing",
  },
  {
    value: "bodyweight",
    label: "น้ำหนักตัว (ครั้ง/วินาที)",
    desc: "Push-up, Pull-up, Plank",
  },
  {
    value: "duration",
    label: "เวลาอย่างเดียว (วินาที)",
    desc: "Stretching, Yoga, Meditation",
  },
];

const CATEGORY_COLORS = {
  weight: "bg-blue-100 text-blue-700",
  cardio: "bg-orange-100 text-orange-700",
  bodyweight: "bg-green-100 text-green-700",
  duration: "bg-purple-100 text-purple-700",
};

const EQUIPMENT_LABEL_MAP = EQUIPMENT_LIST.reduce((acc, item) => {
  acc[item.value] = item.label;
  return acc;
}, {});

const EMPTY_FORM = {
  exercise_name: "",
  exercise_type: "",
  equipment_type: "",
  exercise_category: "weight",
  description: "",
  image: null,
};

export default function ManageExercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [equipmentFilter, setEquipmentFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [errors, setErrors] = useState({});

  // ── ดึง currentUser จาก localStorage ─────────────────────────
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // ── เช็คสิทธิ์แก้ไข ──────────────────────────────────────────
  const canEdit = (ex) => {
    if (currentUser.role === "admin") return true;
    if (ex.ownerRole === "admin") return false;
    if (!ex.created_by) return true;
    const createdById = ex.created_by?._id || ex.created_by;
    return createdById === currentUser.id;
  };

  // ── โหลดข้อมูล ────────────────────────────────────────────────
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

  // ── Modal ─────────────────────────────────────────────────────
  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (ex) => {
    setEditing(ex);
    setForm({
      exercise_name: ex.exercise_name,
      exercise_type: ex.exercise_type,
      equipment_type: ex.equipment_type || "",
      exercise_category: ex.exercise_category || "weight",
      description: ex.description || "",
      image: ex.image || null,
    });
    setErrors({});
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleImageChange = (e) =>
    setForm({ ...form, image: e.target.files[0] });

  const validate = () => {
    const newErrors = {};
    if (!form.exercise_name.trim())
      newErrors.exercise_name = "กรุณากรอกชื่อท่า";
    if (!form.exercise_type) newErrors.exercise_type = "กรุณาเลือกประเภทท่า";
    if (!form.equipment_type) newErrors.equipment_type = "กรุณาเลือกอุปกรณ์";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── บันทึก ────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const payload = new FormData();
      payload.append("exercise_name", form.exercise_name);
      payload.append("exercise_type", form.exercise_type);
      payload.append("equipment_type", form.equipment_type);
      payload.append("exercise_category", form.exercise_category);
      payload.append("description", form.description);
      if (form.image instanceof File) payload.append("image", form.image);

      if (editing) {
        await api.put(`/exercises/${editing._id}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("แก้ไขท่าเรียบร้อยแล้ว ✅");
      } else {
        await api.post("/exercises", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("เพิ่มท่าออกกำลังกายเรียบร้อยแล้ว ✅");
      }
      setShowModal(false);
      fetchExercises();
    } catch (err) {
      alert(err.response?.data?.message || "บันทึกไม่สำเร็จ");
    }
  };

  // ── ลบ ────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!confirm("ต้องการลบท่านี้ใช่หรือไม่?")) return;
    try {
      await api.delete(`/exercises/${id}`);
      fetchExercises();
    } catch (err) {
      alert(err.response?.data?.message || "ลบไม่สำเร็จ");
    }
  };

  // ── Filter ────────────────────────────────────────────────────
  const filteredExercises = exercises.filter((ex) => {
    const keyword = search.toLowerCase();
    const equipVal = ex.equipment_type || "";
    const matchSearch =
      ex.exercise_name.toLowerCase().includes(keyword) ||
      ex.exercise_type.toLowerCase().includes(keyword) ||
      equipVal.toLowerCase().includes(keyword);
    const matchType = typeFilter === "all" || ex.exercise_type === typeFilter;
    const matchEquip =
      equipmentFilter === "all" || ex.equipment_type === equipmentFilter;
    const matchCat =
      categoryFilter === "all" || ex.exercise_category === categoryFilter;
    return matchSearch && matchType && matchEquip && matchCat;
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

        {/* FILTER BAR */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 flex flex-wrap gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาท่า..."
            className="flex-1 min-w-48 px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 focus:ring-2 focus:ring-emerald-400 outline-none"
          >
            <option value="all">ทุกประเภทท่า</option>
            {EXERCISE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            value={equipmentFilter}
            onChange={(e) => setEquipmentFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 focus:ring-2 focus:ring-emerald-400 outline-none"
          >
            <option value="all">ทุกอุปกรณ์</option>
            {EQUIPMENT_LIST.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 focus:ring-2 focus:ring-emerald-400 outline-none"
          >
            <option value="all">ทุกประเภทการวัดผล</option>
            {EXERCISE_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          {(search ||
            typeFilter !== "all" ||
            equipmentFilter !== "all" ||
            categoryFilter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setTypeFilter("all");
                setEquipmentFilter("all");
                setCategoryFilter("all");
              }}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-xl text-sm"
            >
              ล้าง
            </button>
          )}
          <p className="w-full text-xs text-slate-400">
            แสดง {filteredExercises.length} จาก {exercises.length} ท่า
          </p>
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
                  <th className="px-6 py-4 text-left">การวัดผล</th>
                  <th className="px-6 py-4 text-left">สร้างโดย</th>
                  <th className="px-6 py-4 text-left">รายละเอียด</th>
                  <th className="px-6 py-4 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-10 text-slate-400"
                    >
                      กำลังโหลด...
                    </td>
                  </tr>
                ) : filteredExercises.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-10 text-slate-400"
                    >
                      ไม่พบท่าออกกำลังกาย
                    </td>
                  </tr>
                ) : (
                  filteredExercises.map((ex) => (
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

                      {/* CATEGORY */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            CATEGORY_COLORS[ex.exercise_category] ||
                            "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {EXERCISE_CATEGORIES.find(
                            (c) => c.value === ex.exercise_category,
                          )?.label || "ใช้น้ำหนัก (kg)"}
                        </span>
                      </td>

                      {/* สร้างโดย */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            ex.ownerRole === "admin"
                              ? "bg-red-50 text-red-600"
                              : "bg-blue-50 text-blue-600"
                          }`}
                        >
                          {ex.ownerRole === "admin"
                            ? "🛡️ Admin"
                            : `🏋️ ${ex.created_by?.name || "เทรนเนอร์"}`}
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
                          {canEdit(ex) ? (
                            <>
                              <button
                                onClick={() => openEdit(ex)}
                                className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg"
                                title="แก้ไข"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(ex._id)}
                                className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg"
                                title="ลบ"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-slate-400 italic">
                              ดูอย่างเดียว
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 flex justify-between items-center sticky top-0">
                <h2 className="text-2xl font-bold">
                  {editing ? "แก้ไขท่า" : "เพิ่มท่าออกกำลังกาย"}
                </h2>
                <button onClick={() => setShowModal(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block mb-2 font-semibold">
                    ชื่อท่า <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="exercise_name"
                    value={form.exercise_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none"
                    placeholder="เช่น Bench Press"
                  />
                  {errors.exercise_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.exercise_name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block mb-2 font-semibold">
                    ประเภทท่า <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="exercise_type"
                    value={form.exercise_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none"
                  >
                    <option value="">-- เลือกประเภท --</option>
                    {EXERCISE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.exercise_type && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.exercise_type}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block mb-2 font-semibold">
                    อุปกรณ์ <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="equipment_type"
                    value={form.equipment_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none"
                  >
                    <option value="">-- เลือกอุปกรณ์ --</option>
                    {EQUIPMENT_LIST.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  {errors.equipment_type && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.equipment_type}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block mb-2 font-semibold">
                    ประเภทการวัดผล
                    <span className="text-xs text-gray-400 font-normal ml-2">
                      (ใช้สำหรับหน้าบันทึกผลการฝึก)
                    </span>
                  </label>
                  <select
                    name="exercise_category"
                    value={form.exercise_category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none"
                  >
                    {EXERCISE_CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {EXERCISE_CATEGORIES.map((c) => (
                      <div
                        key={c.value}
                        className={`text-xs p-2 rounded-lg border transition-colors ${
                          form.exercise_category === c.value
                            ? `${CATEGORY_COLORS[c.value]} border-current`
                            : "bg-gray-50 border-gray-200 text-gray-500"
                        }`}
                      >
                        <p className="font-semibold">{c.label}</p>
                        <p className="mt-0.5 opacity-75">{c.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block mb-2 font-semibold">รายละเอียด</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none resize-none"
                    placeholder="อธิบายวิธีทำท่านี้..."
                  />
                </div>
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
