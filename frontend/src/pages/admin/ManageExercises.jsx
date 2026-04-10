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
  { label: "บอล", value: "ball" },
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

  // ===== OPEN MODAL =====
  const openAdd = () => {
    setEditing(null);
    setForm({
      exercise_name: "",
      exercise_type: "",
      equipment_type: "",
      description: "",
    });
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (ex) => {
    setEditing(ex);
    setForm({
      exercise_name: ex.exercise_name,
      exercise_type: ex.exercise_type,
      equipment_type: ex.equipment_type || "",
      description: ex.description || "",
    });
    setErrors({});
    setShowModal(true);
  };

  // ===== FORM =====
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  // ===== VALIDATION =====
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
      if (editing) {
        await api.put(`/exercises/${editing._id}`, form);
        alert("แก้ไขท่าเรียบร้อยแล้ว ✅");
      } else {
        await api.post("/exercises", form);
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

  // Get type counts
  const typeCounts = exercises.reduce((acc, ex) => {
    acc[ex.exercise_type] = (acc[ex.exercise_type] || 0) + 1;
    return acc;
  }, {});

  // Get equipment counts
  const exercisesByType =
    typeFilter === "all"
      ? exercises
      : exercises.filter((ex) => ex.exercise_type === typeFilter);
  const equipmentCounts = exercisesByType.reduce((acc, ex) => {
    const eq = ex.equipment_type;
    if (!eq) return acc;

    if (Array.isArray(eq)) {
      eq.forEach((e) => {
        acc[e] = (acc[e] || 0) + 1;
      });
    } else {
      acc[eq] = (acc[eq] || 0) + 1;
    }

    return acc;
  }, {});

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* ===== HEADER ===== */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <Dumbbell className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                จัดการท่าออกกำลังกาย
              </h1>
              <p className="text-slate-600 text-sm">
                ทั้งหมด {exercises.length} ท่า
              </p>
            </div>
          </div>

          <button
            onClick={openAdd}
            className="group flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            เพิ่มท่าใหม่
          </button>
        </div>

        {/* ===== FILTERS ===== */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-white/20 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหาท่า, ประเภท, อุปกรณ์..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Type Filter */}
            <div className="relative ">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
              >
                <option value="all">ทุกประเภท</option>
                {EXERCISE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type} ({typeCounts[type] || 0})
                  </option>
                ))}
              </select>
            </div>
            {/* Equipment Filter */}
            <div className="relative">
              <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={equipmentFilter}
                onChange={(e) => setEquipmentFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
              >
                <option value="all">ทุกอุปกรณ์</option>
                {EQUIPMENT_LIST.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label} ({equipmentCounts[item.value] || 0})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ===== TABLE ===== */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                    ชื่อท่า
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                    ประเภท
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                    อุปกรณ์
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                    รายละเอียด
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <Activity className="w-12 h-12 mx-auto mb-3 text-slate-300 animate-spin" />
                      <p className="text-slate-500">กำลังโหลด...</p>
                    </td>
                  </tr>
                )}

                {!loading && filteredExercises.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center ">
                      <Dumbbell className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                      <p className="text-lg font-medium text-slate-500">
                        {search || typeFilter !== "all"
                          ? "ไม่พบท่าที่ค้นหา"
                          : "ยังไม่มีท่าออกกำลังกาย"}
                      </p>
                      <p className="text-sm text-slate-400 mt-1">
                        เพิ่มท่าใหม่ด้วยปุ่มด้านบน
                      </p>
                    </td>
                  </tr>
                )}

                {filteredExercises.map((ex) => (
                  <tr
                    key={ex._id}
                    className="hover:bg-emerald-50/50 transition-colors"
                  >
                    {/* Exercise Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 bg-gradient-to-br ${
                            TYPE_COLORS[ex.exercise_type] ||
                            "from-slate-400 to-slate-500"
                          } rounded-lg flex items-center justify-center text-white font-bold shadow-md`}
                        >
                          <Dumbbell className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-slate-800">
                          {ex.exercise_name}
                        </span>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${
                          TYPE_COLORS[ex.exercise_type] ||
                          "from-slate-400 to-slate-500"
                        } text-white shadow-sm`}
                      >
                        <Activity className="w-3 h-3" />
                        {ex.exercise_type}
                      </span>
                    </td>

                    {/* Equipment */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Package className="w-4 h-4 text-slate-400" />
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(ex.equipment_type) ? (
                            ex.equipment_type.map((eq) => (
                              <span
                                key={eq}
                                className="px-2 py-1 bg-slate-200 rounded-full text-xs"
                              >
                                {eq}
                              </span>
                            ))
                          ) : (
                            <span className="px-2 py-1 bg-slate-200 rounded-full text-xs">
                              {EQUIPMENT_LABEL_MAP[ex.equipment_type] ||
                                ex.equipment_type}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Description */}
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

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEdit(ex)}
                          className="group flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
                          title="แก้ไข"
                        >
                          <Edit2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                          แก้ไข
                        </button>

                        <button
                          onClick={() => handleDelete(ex._id)}
                          className="group flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
                          title="ลบ"
                        >
                          <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== STATS CARDS ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {EXERCISE_TYPES.slice(0, 4).map((type) => (
            <div
              key={type}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-white/20 hover:shadow-xl transition-shadow"
            >
              <div
                className={`w-8 h-8 bg-gradient-to-br ${
                  TYPE_COLORS[type] || "from-slate-400 to-slate-500"
                } rounded-lg flex items-center justify-center mb-2`}
              >
                <Activity className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm text-slate-600 mb-1">{type}</p>
              <p className="text-2xl font-bold text-slate-800">
                {typeCounts[type] || 0}
              </p>
            </div>
          ))}
        </div>

        {/* ===== MODAL ===== */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    {editing ? (
                      <Edit2 className="w-6 h-6" />
                    ) : (
                      <Plus className="w-6 h-6" />
                    )}
                  </div>
                  <h2 className="text-2xl font-bold">
                    {editing ? "แก้ไขท่า" : "เพิ่มท่าออกกำลังกาย"}
                  </h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Exercise Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <Dumbbell className="w-4 h-4 inline mr-1" />
                    ชื่อท่า
                  </label>
                  <input
                    name="exercise_name"
                    value={form.exercise_name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                      errors.exercise_name
                        ? "border-red-500"
                        : "border-slate-200"
                    }`}
                    placeholder="กรอกชื่อท่าออกกำลังกาย"
                  />
                  {errors.exercise_name && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      {errors.exercise_name}
                    </p>
                  )}
                </div>

                {/* Exercise Type */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <Activity className="w-4 h-4 inline mr-1" />
                    ประเภทท่า
                  </label>
                  <select
                    name="exercise_type"
                    value={form.exercise_type}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                      errors.exercise_type
                        ? "border-red-500"
                        : "border-slate-200"
                    }`}
                  >
                    <option value="">-- เลือกประเภทท่า --</option>
                    {EXERCISE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.exercise_type && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      {errors.exercise_type}
                    </p>
                  )}
                </div>

                {/* Equipment Type */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <Package className="w-4 h-4 inline mr-1" />
                    อุปกรณ์
                  </label>

                  <select
                    name="equipment_type"
                    value={form.equipment_type}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                      errors.equipment_type
                        ? "border-red-500"
                        : "border-slate-200"
                    }`}
                  >
                    <option value="">-- เลือกอุปกรณ์ --</option>
                    {EQUIPMENT_LIST.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>

                  {errors.equipment_type && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      {errors.equipment_type}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-1" />
                    รายละเอียด
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    rows="4"
                    placeholder="กรอกรายละเอียดเพิ่มเติม (ถ้ามี)"
                  />
                </div>

                {/* Modal Footer */}
                <div className="sticky bottom-0 bg-slate-50 -mx-6 -mb-6 px-6 py-4 rounded-b-2xl flex gap-3 border-t">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
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