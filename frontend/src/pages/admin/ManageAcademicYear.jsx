import { useEffect, useState } from "react";
import api from "../../services/api";
import Navbar from "../../components/Navbar";
import {
  Calendar,
  Plus,
  Trash2,
  Power,
  CheckCircle,
  XCircle,
  Edit2,
  Clock,
  PlayCircle,
  PauseCircle,
  X,
  AlertTriangle,
  Info,
} from "lucide-react";

export default function ManageAcademicYear() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    academic_year: "",
    semester: "",
    status: "inactive",
    start_date: "",
    end_date: "",
  });
  const [errors, setErrors] = useState({});

  // ===== EDIT MODAL STATE =====
  const [showEdit, setShowEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    academic_year: "",
    semester: "",
    start_date: "",
    end_date: "",
  });

  // ===== TOAST STATE =====
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  // ===== CONFIRM MODAL STATE (delete / toggle) =====
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    type: null, // "delete" | "toggle"
    id: null,
    title: "",
    description: "",
    confirmLabel: "",
    tone: "danger", // "danger" | "warning" | "success"
  });

  const closeConfirmModal = () =>
    setConfirmModal((prev) => ({ ...prev, show: false }));

  const fetchData = async () => {
    const res = await api.get("/academic-years");
    setList(res.data);
    // ✅ แจ้ง Layout ทุก role ให้ refresh ปีการศึกษาใน topbar
    window.dispatchEvent(new Event("academicYearChanged"));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.academic_year) {
      newErrors.academic_year = "กรุณากรอกปีการศึกษา";
    } else if (!/^\d{4}$/.test(form.academic_year)) {
      newErrors.academic_year = "ปีการศึกษาต้องเป็นตัวเลข 4 หลัก";
    }

    if (!form.semester) {
      newErrors.semester = "กรุณากรอกภาคการศึกษา";
    }

    if (!form.start_date) {
      newErrors.start_date = "กรุณาเลือกวันที่เริ่ม";
    }

    if (!form.end_date) {
      newErrors.end_date = "กรุณาเลือกวันที่สิ้นสุด";
    }

    if (form.start_date && form.end_date && form.start_date > form.end_date) {
      newErrors.end_date = "วันที่สิ้นสุดต้องมากกว่าวันที่เริ่ม";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await api.post("/academic-years", {
        academic_year: form.academic_year,
        semester: form.semester,
        status: form.status,
        start_date: form.start_date,
        end_date: form.end_date,
      });

      setForm({
        academic_year: "",
        semester: "",
        status: "inactive",
        start_date: "",
        end_date: "",
      });
      setErrors({});

      fetchData();
      showToast("เพิ่มปีการศึกษาแล้ว", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "เพิ่มข้อมูลไม่สำเร็จ", "error");
    }
  };

  // ---- DELETE FLOW ----
  const handleDeleteClick = (item) => {
    setConfirmModal({
      show: true,
      type: "delete",
      id: item._id,
      title: "ยืนยันการลบ",
      description: `ต้องการลบปีการศึกษา ${item.academic_year} / ภาค ${item.semester} ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`,
      confirmLabel: "ลบข้อมูล",
      tone: "danger",
    });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/academic-years/${confirmModal.id}`);
      closeConfirmModal();
      fetchData();
      showToast("ลบปีการศึกษาแล้ว", "success");
    } catch (err) {
      closeConfirmModal();
      showToast(err.response?.data?.message || "ลบข้อมูลไม่สำเร็จ", "error");
    }
  };

  // ---- TOGGLE STATUS FLOW ----
  const handleToggleClick = (item) => {
    const willActivate = item.status !== "active";
    setConfirmModal({
      show: true,
      type: "toggle",
      id: item._id,
      title: willActivate ? "ยืนยันการเปิดใช้งาน" : "ยืนยันการปิดใช้งาน",
      description: willActivate
        ? `ต้องการเปิดใช้งานปีการศึกษา ${item.academic_year} / ภาค ${item.semester} ใช่หรือไม่?`
        : `ต้องการปิดใช้งานปีการศึกษา ${item.academic_year} / ภาค ${item.semester} ใช่หรือไม่?`,
      confirmLabel: willActivate ? "เปิดใช้งาน" : "ปิดใช้งาน",
      tone: willActivate ? "success" : "warning",
    });
  };

  const confirmToggle = async () => {
    try {
      await api.patch(`/academic-years/${confirmModal.id}/toggle-status`);
      closeConfirmModal();
      fetchData();
      showToast("เปลี่ยนสถานะแล้ว", "success");
    } catch (err) {
      closeConfirmModal();
      showToast("เปลี่ยนสถานะไม่สำเร็จ", "error");
    }
  };

  const handleConfirmAction = () => {
    if (confirmModal.type === "delete") confirmDelete();
    else if (confirmModal.type === "toggle") confirmToggle();
  };

  // เปิด popup พร้อมโหลดข้อมูลเดิม
  const openEditModal = (item) => {
    const toDateInput = (v) => {
      if (!v) return "";
      if (typeof v === "string") return v.slice(0, 10);
      try {
        return new Date(v).toISOString().slice(0, 10);
      } catch {
        return "";
      }
    };

    setEditingId(item._id);
    setEditForm({
      academic_year: item.academic_year,
      semester: item.semester,
      start_date: toDateInput(item.start_date),
      end_date: toDateInput(item.end_date),
    });
    setShowEdit(true);
  };

  // บันทึกการแก้ไข
  const handleUpdate = async () => {
    try {
      await api.put(`/academic-years/${editingId}`, {
        academic_year: editForm.academic_year,
        semester: editForm.semester,
        start_date: editForm.start_date,
        end_date: editForm.end_date,
      });

      setShowEdit(false);
      fetchData();
      showToast("แก้ไขข้อมูลสำเร็จ", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "แก้ไขไม่สำเร็จ", "error");
    }
  };

  const activeYear = list.find((item) => item.status === "active");

  // ===== TONE STYLES FOR CONFIRM MODAL =====
  const toneStyles = {
    danger: {
      icon: <Trash2 className="w-7 h-7 text-white" />,
      iconBg: "bg-gradient-to-br from-red-500 to-rose-600",
      button: "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700",
      ring: "ring-red-100",
    },
    warning: {
      icon: <AlertTriangle className="w-7 h-7 text-white" />,
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-500",
      button: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600",
      ring: "ring-amber-100",
    },
    success: {
      icon: <CheckCircle className="w-7 h-7 text-white" />,
      iconBg: "bg-gradient-to-br from-green-500 to-emerald-600",
      button: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700",
      ring: "ring-green-100",
    },
  };
  const activeTone = toneStyles[confirmModal.tone] || toneStyles.danger;

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* ===== HEADER ===== */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                จัดการปีการศึกษา
              </h1>
              <p className="text-slate-600 text-sm">
                ทั้งหมด {list.length} รายการ
                {activeYear && (
                  <span className="ml-2 text-green-600 font-semibold">
                    • ปัจจุบัน: {activeYear.academic_year}/{activeYear.semester}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* ===== FORM CARD ===== */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 border border-white/20 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                เพิ่มปีการศึกษาใหม่
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {/* Academic Year */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  ปีการศึกษา
                </label>
                <input
                  name="academic_year"
                  placeholder="เช่น 2567"
                  value={form.academic_year}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.academic_year ? "border-red-500" : "border-slate-200"
                  }`}
                />
                {errors.academic_year && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    {errors.academic_year}
                  </p>
                )}
              </div>

              {/* Semester */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  ภาคการศึกษา
                </label>
                <input
                  name="semester"
                  placeholder="เช่น 1, 2, 3"
                  value={form.semester}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.semester ? "border-red-500" : "border-slate-200"
                  }`}
                />
                {errors.semester && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    {errors.semester}
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <Power className="w-4 h-4 inline mr-1" />
                  สถานะ
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="active">Active (เปิดใช้งาน)</option>
                  <option value="inactive">Inactive (ปิดใช้งาน)</option>
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <PlayCircle className="w-4 h-4 inline mr-1" />
                  วันที่เริ่มต้น
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.start_date ? "border-red-500" : "border-slate-200"
                  }`}
                />
                {errors.start_date && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    {errors.start_date}
                  </p>
                )}
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <PauseCircle className="w-4 h-4 inline mr-1" />
                  วันที่สิ้นสุด
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={form.end_date}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.end_date ? "border-red-500" : "border-slate-200"
                  }`}
                />
                {errors.end_date && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    {errors.end_date}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex items-end">
                <button
                  onClick={handleSubmit}
                  className="w-full group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  เพิ่มปีการศึกษา
                </button>
              </div>
            </div>
          </div>

          {/* ===== TABLE CARD ===== */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20">
            <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
                <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                      ปีการศึกษา / ภาค
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                      สถานะ
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                      วันที่เริ่มต้น
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                      วันที่สิ้นสุด
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {list.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-12 text-center text-slate-500"
                      >
                        <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p className="text-lg font-medium">
                          ยังไม่มีข้อมูลปีการศึกษา
                        </p>
                        <p className="text-sm text-slate-400 mt-1">
                          เพิ่มปีการศึกษาใหม่ด้วยฟอร์มด้านบน
                        </p>
                      </td>
                    </tr>
                  ) : (
                    list.map((item) => (
                      <tr
                        key={item._id}
                        className={`hover:bg-blue-50/50 transition-colors ${
                          item.status === "active" ? "bg-green-50/30" : ""
                        }`}
                      >
                        {/* Year / Semester */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ${
                                item.status === "active"
                                  ? "bg-gradient-to-br from-green-500 to-emerald-600"
                                  : "bg-gradient-to-br from-slate-400 to-slate-500"
                              }`}
                            >
                              {item.semester}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-lg">
                                {item.academic_year}
                              </p>
                              <p className="text-sm text-slate-600">
                                ภาคการศึกษาที่ {item.semester}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
                              item.status === "active"
                                ? "bg-green-100 text-green-700 border-2 border-green-200"
                                : "bg-slate-100 text-slate-600 border-2 border-slate-200"
                            }`}
                          >
                            {item.status === "active" ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                            {item.status === "active"
                              ? "เปิดใช้งาน"
                              : "ปิดใช้งาน"}
                          </span>
                        </td>

                        {/* Start Date */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-700">
                            <PlayCircle className="w-4 h-4 text-slate-400" />
                            <span className="font-medium">
                              {new Date(item.start_date).toLocaleDateString(
                                "th-TH",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </span>
                          </div>
                        </td>

                        {/* End Date */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-700">
                            <PauseCircle className="w-4 h-4 text-slate-400" />
                            <span className="font-medium">
                              {new Date(item.end_date).toLocaleDateString(
                                "th-TH",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleToggleClick(item)}
                              className={`group flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 shadow-sm ${
                                item.status === "active"
                                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                                  : "bg-green-100 text-green-700 hover:bg-green-200"
                              }`}
                              title={
                                item.status === "active"
                                  ? "ปิดใช้งาน"
                                  : "เปิดใช้งาน"
                              }
                            >
                              <Power className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                              {item.status === "active"
                                ? "ปิดใช้งาน"
                                : "เปิดใช้งาน"}
                            </button>

                            <button
                              onClick={() => openEditModal(item)}
                              className="group flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 shadow-sm"
                              title="แก้ไขข้อมูล"
                            >
                              <Edit2 className="w-4 h-4" />
                              แก้ไข
                            </button>

                            <button
                              onClick={() => handleDeleteClick(item)}
                              className="group flex items-center gap-1 bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 shadow-sm"
                              title="ลบ"
                            >
                              <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                              ลบ
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ===== EDIT POPUP MODAL ===== */}
          {showEdit && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-[fadeIn_0.15s_ease-out]">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Edit2 className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">แก้ไขปีการศึกษา</h2>
                  </div>
                  <button
                    onClick={() => setShowEdit(false)}
                    className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg p-1.5 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">ปีการศึกษา</label>
                    <input
                      className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      value={editForm.academic_year}
                      onChange={(e) =>
                        setEditForm({ ...editForm, academic_year: e.target.value })
                      }
                      placeholder="ปีการศึกษา"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">ภาคการศึกษา</label>
                    <input
                      className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      value={editForm.semester}
                      onChange={(e) =>
                        setEditForm({ ...editForm, semester: e.target.value })
                      }
                      placeholder="ภาคการศึกษา"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">วันที่เริ่มต้น</label>
                      <input
                        type="date"
                        className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        value={editForm.start_date}
                        onChange={(e) =>
                          setEditForm({ ...editForm, start_date: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">วันที่สิ้นสุด</label>
                      <input
                        type="date"
                        className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        value={editForm.end_date}
                        onChange={(e) =>
                          setEditForm({ ...editForm, end_date: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleUpdate}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                  >
                    บันทึก
                  </button>

                  <button
                    onClick={() => setShowEdit(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold transition-all"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===== CONFIRM MODAL (delete / toggle status) ===== */}
          {confirmModal.show && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-[fadeIn_0.15s_ease-out]">
                <div
                  className={`h-16 w-16 mx-auto rounded-2xl flex items-center justify-center shadow-lg ring-8 ${activeTone.iconBg} ${activeTone.ring}`}
                >
                  {activeTone.icon}
                </div>

                <h3 className="text-lg font-bold text-slate-800 mt-4">
                  {confirmModal.title}
                </h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  {confirmModal.description}
                </p>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={closeConfirmModal}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold transition-all"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleConfirmAction}
                    className={`flex-1 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] ${activeTone.button}`}
                  >
                    {confirmModal.confirmLabel}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===== TOAST NOTIFICATION ===== */}
          {toast.show && (
            <div className="fixed top-6 right-6 z-[60] animate-[fadeIn_0.2s_ease-out]">
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

          {/* ===== INFO CARD ===== */}
          {activeYear && (
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white border-2 border-green-300">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-8 h-8" />
                <h3 className="text-xl font-bold">ปีการศึกษาปัจจุบัน</h3>
              </div>
              <p className="text-green-50 text-lg">
                <strong className="text-2xl">
                  {activeYear.academic_year} / {activeYear.semester}
                </strong>
              </p>
              <p className="text-green-100 text-sm mt-2">
                {new Date(activeYear.start_date).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                -{" "}
                {new Date(activeYear.end_date).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}