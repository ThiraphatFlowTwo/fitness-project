import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Dumbbell,
  Loader2,
  AlertCircle,
  Calendar,
  Eye,
  X,
  Activity,
  Image as ImageIcon,
} from "lucide-react";
import api from "../../services/api";

// Base URL สำหรับดึงไฟล์ Static (รูปภาพ) จาก Backend
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const formatTime = (s) => {
  if (!s) return "-";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0 ? `${h}ชม. ${m}นาที` : `${m}นาที ${sec}วินาที`;
};

const bmiBadge = (bmi) => {
  if (!bmi) return { label: "-", cls: "bg-slate-100 text-slate-400" };
  if (bmi < 18.5)
    return { label: bmi.toFixed(1), cls: "bg-blue-50 text-blue-600" };
  if (bmi < 25)
    return { label: bmi.toFixed(1), cls: "bg-green-50 text-green-600" };
  if (bmi < 30)
    return { label: bmi.toFixed(1), cls: "bg-amber-50 text-amber-600" };
  return { label: bmi.toFixed(1), cls: "bg-red-50 text-red-600" };
};

const GRADIENTS = [
  "from-teal-400 to-cyan-500",
  "from-blue-400 to-indigo-500",
  "from-amber-400 to-orange-500",
  "from-violet-400 to-purple-500",
  "from-rose-400 to-pink-500",
  "from-green-400 to-emerald-500",
];

const STATUS_CONFIG = {
  active: {
    label: "ใช้งานอยู่",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  pending: {
    label: "รออนุมัติ",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  inactive: {
    label: "ปิดใช้งาน",
    bg: "bg-slate-100",
    text: "text-slate-500",
    dot: "bg-slate-400",
  },
};

const PROGRAM_STATUS = {
  draft: { label: "ร่าง", bg: "bg-slate-100", text: "text-slate-500" },
  pending: { label: "รออนุมัติ", bg: "bg-amber-50", text: "text-amber-600" },
  approved: {
    label: "อนุมัติแล้ว",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  rejected: { label: "ไม่อนุมัติ", bg: "bg-red-50", text: "text-red-600" },
};

export default function TrainerDetail() {
  const { trainerId } = useParams();
  const navigate = useNavigate();

  const [trainer, setTrainer] = useState(null);
  const [trainees, setTrainees] = useState([]);
  const [logs, setLogs] = useState([]);
  const [fitness, setFitness] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [viewTrainee, setViewTrainee] = useState(null);
  const [modalTab, setModalTab] = useState("info");

  const [viewLog, setViewLog] = useState(null);
  const [logDetail, setLogDetail] = useState(null);
  const [loadingLog, setLoadingLog] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError("");
      try {
        const [trainerRes, traineesRes, logsRes, fitnessRes] =
          await Promise.all([
            api.get("/instructor/trainers"),
            api.get(`/instructor/trainer/${trainerId}/trainees`),
            api.get(`/instructor/trainer/${trainerId}/logs`),
            api.get(`/instructor/trainer/${trainerId}/fitness`),
          ]);

        const found = Array.isArray(trainerRes.data)
          ? trainerRes.data.find((t) => t._id === trainerId)
          : null;

        setTrainer(found || null);
        setTrainees(Array.isArray(traineesRes.data) ? traineesRes.data : []);
        setLogs(Array.isArray(logsRes.data) ? logsRes.data : []);
        setFitness(Array.isArray(fitnessRes.data) ? fitnessRes.data : []);
      } catch (err) {
        setError(err.response?.data?.message || "โหลดข้อมูลไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [trainerId]);

  const handleViewLog = async (log) => {
    setViewLog(log);
    setLogDetail(null);
    setLoadingLog(true);
    try {
      const res = await api.get(`/instructor/log/${log._id}`);
      setLogDetail(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "โหลดรายละเอียดไม่สำเร็จ");
    } finally {
      setLoadingLog(false);
    }
  };

  const handleOpenTraineeModal = (trainee) => {
    setViewTrainee(trainee);
    setModalTab("info");
  };

  // 🔥 ฟังก์ชันต่อ URL รูปภาพ ป้องกัน URL ซ้ำซ้อน
  const getImageUrl = (photo) => {
    if (!photo || typeof photo !== "string") return null;
    if (photo.startsWith("http://") || photo.startsWith("https://"))
      return photo;
    const cleanPath = photo.startsWith("/") ? photo : `/${photo}`;
    return `${API_BASE_URL}${cleanPath}`;
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">กำลังโหลดข้อมูล...</span>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <AlertCircle className="w-5 h-5 mr-2" />
        {error}
      </div>
    );

  const st = STATUS_CONFIG[trainer?.status] || STATUS_CONFIG.pending;

  const traineeLogs = logs.filter(
    (log) => String(log.trainee_id?._id || log.trainee_id) === String(viewTrainee?._id),
  );
  const traineeFitness = fitness.filter(
    (f) => String(f.trainee_id?._id || f.trainee_id) === String(viewTrainee?._id),
  );

  return (
    <div className="p-4 sm:p-6 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/instructor/trainees")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">กลับรายชื่อเทรนเนอร์</span>
        </button>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start gap-4 sm:gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg shrink-0">
              {trainer?.name?.charAt(0) || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-slate-800">
                  {trainer?.name}
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-semibold ${st.bg} ${st.text}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                  {st.label}
                </span>
              </div>
              <p className="text-slate-500 text-sm">{trainer?.email}</p>
              {trainer?.created_at && (
                <p className="text-slate-400 text-xs mt-2">
                  สมัครเมื่อ{" "}
                  {new Date(trainer.created_at).toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
            <div className="flex gap-4 shrink-0">
              <div className="p-4 bg-blue-50 rounded-2xl text-center min-w-[80px]">
                <p className="text-3xl font-black text-blue-700">
                  {trainees.length}
                </p>
                <p className="text-xs text-blue-500 mt-1 font-medium">
                  ลูกเทรนทั้งหมด
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ส่วนแสดงรายชื่อลูกเทรนหลัก */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />{" "}
              รายชื่อลูกเทรนในการดูแล
            </h2>
          </div>
          {trainees.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>ยังไม่มีลูกเทรน</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {trainees.map((t, i) => (
                <div
                  key={t._id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} flex items-center justify-center text-white text-sm font-bold shrink-0`}
                  >
                    {t.name?.charAt(0) || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm">
                      {t.name}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-xs text-slate-400">
                        {t.gender} • {t.age} ปี
                      </span>
                      {t.goal && (
                        <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
                          {t.goal}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="hidden md:flex gap-4 text-xs text-slate-500 shrink-0">
                    {t.height && <span>ส่วนสูง {t.height} ซม.</span>}
                    {t.weight && <span>น้ำหนัก {t.weight} กก.</span>}
                  </div>
                  <button
                    onClick={() => handleOpenTraineeModal(t)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-slate-100 rounded-xl text-xs text-slate-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    ดูข้อมูลและประวัติฝึก
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal ข้อมูลลูกเทรน */}
      {viewTrainee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b flex justify-between items-start bg-white rounded-t-2xl shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white text-xl font-bold shadow">
                  {viewTrainee.name?.charAt(0) || "?"}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {viewTrainee.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    เป้าหมาย: {viewTrainee.goal || "ไม่ระบุ"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewTrainee(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex border-b border-slate-100 px-6 gap-4 bg-slate-50/50 shrink-0">
              <button
                onClick={() => setModalTab("info")}
                className={`flex items-center gap-2 py-3 px-1 text-sm font-semibold border-b-2 transition-all ${
                  modalTab === "info"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                <Users className="w-4 h-4" />
                ข้อมูลทั่วไป
              </button>
              <button
                onClick={() => setModalTab("logs")}
                className={`flex items-center gap-2 py-3 px-1 text-sm font-semibold border-b-2 transition-all ${
                  modalTab === "logs"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                <Calendar className="w-4 h-4" />
                ประวัติการฝึก ({traineeLogs.length})
              </button>
              <button
                onClick={() => setModalTab("fitness")}
                className={`flex items-center gap-2 py-3 px-1 text-sm font-semibold border-b-2 transition-all ${
                  modalTab === "fitness"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                <Activity className="w-4 h-4" />
                ผลสมรรถภาพ ({traineeFitness.length})
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-white">
              {modalTab === "info" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: "เพศ", value: viewTrainee.gender || "-" },
                      {
                        label: "อายุ",
                        value: viewTrainee.age ? `${viewTrainee.age} ปี` : "-",
                      },
                      {
                        label: "ส่วนสูง",
                        value: viewTrainee.height
                          ? `${viewTrainee.height} ซม.`
                          : "-",
                      },
                      {
                        label: "น้ำหนัก",
                        value: viewTrainee.weight
                          ? `${viewTrainee.weight} กก.`
                          : "-",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-100"
                      >
                        <p className="text-xs text-slate-400 mb-1">
                          {item.label}
                        </p>
                        <p className="text-sm font-semibold text-slate-700">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                  {viewTrainee.healthCondition && (
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                      <p className="text-xs text-blue-400 font-semibold mb-1">
                        🏥 ข้อมูลสุขภาพพื้นฐาน / โรคประจำตัว
                      </p>
                      <p className="text-sm text-blue-700">
                        {viewTrainee.healthCondition}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {modalTab === "logs" && (
                <div>
                  {traineeLogs.length === 0 ? (
                    <div className="py-12 text-center text-slate-400">
                      <Dumbbell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>ไม่มีประวัติการฝึกของลูกเทรนคนนี้</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-slate-100 rounded-xl">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-400 text-xs font-bold uppercase border-b border-slate-100">
                          <tr>
                            <th className="px-4 py-3">วันที่</th>
                            <th className="px-4 py-3">โปรแกรม</th>
                            <th className="px-4 py-3 text-center">สถานะ</th>
                            <th className="px-4 py-3 text-center">จำนวนท่า</th>
                            <th className="px-4 py-3 text-center">เซตสำเร็จ</th>
                            <th className="px-4 py-3 text-center">เวลา</th>
                            <th className="px-4 py-3 text-center">ดูเซต</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs md:text-sm">
                          {traineeLogs.map((log) => {
                            const ps =
                              PROGRAM_STATUS[log.program_id?.status] ||
                              PROGRAM_STATUS.draft;
                            return (
                              <tr
                                key={log._id}
                                className="hover:bg-slate-50 transition-colors"
                              >
                                <td className="px-4 py-3 font-bold text-slate-700 whitespace-nowrap">
                                  {new Date(
                                    log.training_date,
                                  ).toLocaleDateString("th-TH", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </td>
                                <td className="px-4 py-3 text-slate-600 truncate max-w-[150px]">
                                  {log.program_id?.program_name || "-"}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ps.bg} ${ps.text}`}
                                  >
                                    {ps.label}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                                    {log.exercise_count || 0} ท่า
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center text-slate-600">
                                  {log.completed_sets || 0}/{log.set_count || 0}
                                </td>
                                <td className="px-4 py-3 text-center text-slate-500 whitespace-nowrap">
                                  {formatTime(log.duration)}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <button
                                    onClick={() => handleViewLog(log)}
                                    className="p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg transition-colors"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {modalTab === "fitness" && (
                <div>
                  {traineeFitness.length === 0 ? (
                    <div className="py-12 text-center text-slate-400">
                      <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>ไม่มีข้อมูลสมรรถภาพของลูกเทรนคนนี้</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {traineeFitness.map((f, idx) => {
                        const bmi = bmiBadge(f.bmi);
                        return (
                          <div key={f._id} className="border border-slate-100 rounded-xl overflow-hidden">
                            {/* Header */}
                            <div className="bg-slate-50 px-4 py-3 flex items-center justify-between border-b border-slate-100">
                              <span className="font-bold text-slate-700 text-sm">
                                บันทึกครั้งที่ {traineeFitness.length - idx}
                              </span>
                              <span className="text-xs text-slate-400">
                                วันที่ทดสอบ: {new Date(f.test_date).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })}
                              </span>
                            </div>

                            <div className="p-4 space-y-4">
                              {/* 1. Body Composition */}
                              <div className="border border-slate-100 rounded-xl p-4">
                                <p className="text-xs font-bold text-slate-500 mb-3">1. การวิเคราะห์องค์ประกอบร่างกาย (Body Composition)</p>
                                <div className="grid grid-cols-3 gap-3">
                                  {[
                                    { label: "น้ำหนัก (กก.)", value: f.weight },
                                    { label: "มวลกล้ามเนื้อ (กก.)", value: f.skeletal_muscle_mass },
                                    { label: "มวลไขมัน (กก.)", value: f.body_fat_mass },
                                    { label: "โปรตีน (กก.)", value: f.protein },
                                    { label: "กระดูก/แร่ธาตุ (กก.)", value: f.minerals },
                                    { label: "น้ำในร่างกาย (กก.)", value: f.total_body_water },
                                  ].map((item, i) => (
                                    <div key={i} className="bg-slate-50 rounded-lg p-2">
                                      <p className="text-xs text-slate-400">{item.label}</p>
                                      <p className="font-semibold text-slate-700 text-sm">{item.value ?? "-"}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* 2. Obesity Analysis */}
                              <div className="border border-amber-100 bg-amber-50/30 rounded-xl p-4">
                                <p className="text-xs font-bold text-amber-600 mb-3">2. การวิเคราะห์ภาวะอ้วน & ลงพุง (Obesity Analysis)</p>
                                <div className="grid grid-cols-3 gap-3">
                                  {[
                                    { label: "BMI (kg/m²)", value: f.bmi, badge: bmi },
                                    { label: "% ไขมันร่างกาย (PBF)", value: f.body_fat_percent != null ? `${f.body_fat_percent}%` : null },
                                    { label: "ระดับไขมันช่องท้อง", value: f.visceral_fat_level },
                                    { label: "เส้นรอบเอว (ซม.)", value: f.waist_circumference },
                                    { label: "อัตราส่วนเอว/สะโพก", value: f.waist_hip_ratio },
                                  ].map((item, i) => (
                                    <div key={i} className="bg-white rounded-lg p-2 border border-amber-100">
                                      <p className="text-xs text-slate-400">{item.label}</p>
                                      {item.badge ? (
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${item.badge.cls}`}>{item.badge.label}</span>
                                      ) : (
                                        <p className="font-semibold text-slate-700 text-sm">{item.value ?? "-"}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* 3 & 4. Overall & Vital Signs */}
                              <div className="grid grid-cols-2 gap-4">
                                <div className="border border-slate-100 rounded-xl p-4">
                                  <p className="text-xs font-bold text-slate-500 mb-3">3. การประเมินโดยรวม & พลังงาน</p>
                                  <div className="space-y-2">
                                    {[
                                      { label: "อายุกาย (ปี)", value: f.body_age },
                                      { label: "คะแนนร่างกาย", value: f.body_score },
                                      { label: "BMR พลังงานพื้นฐาน", value: f.estimated_bmr },
                                      { label: "TDEE พลังงาน/วัน", value: f.tdee },
                                    ].map((item, i) => (
                                      <div key={i} className="flex justify-between items-center">
                                        <span className="text-xs text-slate-400">{item.label}</span>
                                        <span className="text-xs font-semibold text-slate-700">{item.value ?? "-"}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="border border-red-100 bg-red-50/20 rounded-xl p-4">
                                  <p className="text-xs font-bold text-red-500 mb-3">4. สัญญาณชีพ & ความดันโลหิต</p>
                                  <div className="space-y-2">
                                    {[
                                      { label: "ความดันบน (Sys)", value: f.sys_bp },
                                      { label: "ความดันล่าง (Dia)", value: f.dia_bp },
                                      { label: "ชีพจร (bpm)", value: f.resting_heart_rate },
                                      { label: "VO₂ Max", value: f.vo2_max?.toFixed(1) },
                                    ].map((item, i) => (
                                      <div key={i} className="flex justify-between items-center">
                                        <span className="text-xs text-slate-400">{item.label}</span>
                                        <span className="text-xs font-semibold text-slate-700">{item.value ?? "-"}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* คำแนะนำ */}
                              {f.remark && (
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                                  <p className="text-xs font-bold text-blue-600 mb-1">คำแนะนำ / หมายเหตุ</p>
                                  <p className="text-sm text-slate-600">{f.remark}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-slate-50 rounded-b-2xl flex justify-end shrink-0">
              <button
                onClick={() => setViewTrainee(null)}
                className="px-6 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-all shadow-sm"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal รายละเอียด Log การฝึก */}
      {viewLog && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <div>
                <h3 className="font-bold text-slate-800">
                  รายละเอียดเซตการฝึก
                </h3>
                <p className="text-sm text-slate-400 mt-0.5">
                  {new Date(viewLog.training_date).toLocaleDateString("th-TH", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <button
                onClick={() => {
                  setViewLog(null);
                  setLogDetail(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              {loadingLog ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                </div>
              ) : logDetail ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      {
                        label: "ลูกเทรน",
                        value: logDetail.trainee_id?.name || "-",
                      },
                      {
                        label: "โปรแกรม",
                        value: logDetail.program_id?.program_name || "-",
                      },
                      {
                        label: "เซตสำเร็จ",
                        value: `${viewLog.completed_sets || 0}/${viewLog.set_count || 0}`,
                      },
                      { label: "เวลา", value: formatTime(logDetail.duration) },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="p-3 bg-slate-50 rounded-xl"
                      >
                        <p className="text-xs text-slate-400 mb-1">
                          {item.label}
                        </p>
                        <p className="text-sm font-semibold text-slate-700">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {logDetail.note && (
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                      <p className="text-xs text-blue-400 font-semibold mb-1">
                        📝 หมายเหตุ
                      </p>
                      <p className="text-sm text-blue-700">{logDetail.note}</p>
                    </div>
                  )}

                  {/* 📷 รูปภาพยืนยันการฝึก (แก้ไขจุดดึงรูปจาก logDetail และ viewLog) */}
                  {(() => {
                    // รวมข้อมูลจากทั้ง logDetail (API) และ viewLog (จากตาราง)
                    const sources = [logDetail, viewLog];
                    let rawPhotos = [];

                    sources.forEach((src) => {
                      if (!src) return;

                      // 1. ถ้าเป็น Array
                      if (Array.isArray(src.photos))
                        rawPhotos.push(...src.photos);
                      if (Array.isArray(src.images))
                        rawPhotos.push(...src.images);
                      if (Array.isArray(src.photo_urls))
                        rawPhotos.push(...src.photo_urls);

                      // 2. ถ้าเป็น String ที่ซ่อนอยู่ในรูป JSON
                      if (typeof src.photos === "string") {
                        try {
                          const parsed = JSON.parse(src.photos);
                          if (Array.isArray(parsed)) rawPhotos.push(...parsed);
                          else rawPhotos.push(src.photos);
                        } catch {
                          rawPhotos.push(src.photos);
                        }
                      }

                      // 3. ถ้าเป็นฟิลด์รูปเดียว
                      if (typeof src.photo === "string")
                        rawPhotos.push(src.photo);
                      if (typeof src.photo_url === "string")
                        rawPhotos.push(src.photo_url);
                    });

                    // กรองเอาเฉพาะ URL/Path ที่ใช้งานได้จริง และลบตัวซ้ำ
                    const validPhotos = [...new Set(rawPhotos)].filter(
                      (img) =>
                        typeof img === "string" &&
                        img.trim() !== "" &&
                        img !== "null" &&
                        img !== "undefined",
                    );

                    // ถ้าไม่มีรูปเลย ถึงจะไม่แสดงผล
                    if (validPhotos.length === 0) return null;

                    return (
                      <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3 my-4">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                            <ImageIcon className="w-4 h-4 text-purple-600" />
                            รูปภาพยืนยันการฝึก
                          </span>
                          <span className="text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-full text-[11px]">
                            {validPhotos.length} รูป
                          </span>
                        </div>

                        <div
                          className={`grid gap-2 ${
                            validPhotos.length === 1
                              ? "grid-cols-1 sm:grid-cols-2"
                              : validPhotos.length === 2
                                ? "grid-cols-2"
                                : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
                          }`}
                        >
                          {validPhotos.map((img, idx) => {
                            const srcUrl = getImageUrl(img);
                            return (
                              <a
                                key={idx}
                                href={srcUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100 aspect-square block shadow-sm hover:shadow-md transition-all"
                              >
                                <img
                                  src={srcUrl}
                                  alt={`รูปยืนยันการฝึก ${idx + 1}`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                      "https://placehold.co/300x300?text=Image+Not+Found";
                                  }}
                                />
                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold backdrop-blur-[2px]">
                                  🔍 ขยายรูป
                                </div>
                                <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-md">
                                  {idx + 1}/{validPhotos.length}
                                </span>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {logDetail.sets &&
                    (() => {
                      const grouped = logDetail.sets.reduce((acc, s) => {
                        const key = s.exercise_id?._id || s.exercise_id;
                        const name = s.exercise_id?.exercise_name || "-";
                        const type = s.exercise_id?.exercise_type || "";
                        if (!acc[key]) acc[key] = { name, type, sets: [] };
                        acc[key].sets.push(s);
                        return acc;
                      }, {});
                      return (
                        <div className="space-y-3">
                          <p className="text-sm font-semibold text-slate-600">
                            ท่าออกกำลังกาย
                          </p>
                          {Object.entries(grouped).map(([key, ex]) => (
                            <div
                              key={key}
                              className="border border-slate-100 rounded-xl overflow-hidden"
                            >
                              <div className="px-4 py-3 bg-slate-50 flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-slate-800 text-sm">
                                    {ex.name}
                                  </p>
                                  <p className="text-xs text-slate-400">
                                    {ex.type}
                                  </p>
                                </div>
                                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full font-semibold">
                                  {ex.sets.length} เซต
                                </span>
                              </div>
                              <div className="p-3">
                                <div className="grid grid-cols-5 gap-2 text-xs text-slate-400 font-semibold mb-2 px-1">
                                  <span>เซต</span>
                                  <span className="text-center">น้ำหนัก</span>
                                  <span className="text-center">ครั้ง</span>
                                  <span className="text-center">RPE</span>
                                  <span className="text-center">✓</span>
                                </div>
                                {[...ex.sets]
                                  .sort((a, b) => a.set_number - b.set_number)
                                  .map((set) => (
                                    <div key={set.set_number} className="mb-2">
                                      <div
                                        className={`grid grid-cols-5 gap-2 text-sm py-1.5 px-1 rounded-lg ${
                                          set.completed
                                            ? "bg-green-50"
                                            : "bg-white"
                                        }`}
                                      >
                                        <span className="font-bold text-slate-600">
                                          {set.set_number}
                                        </span>
                                        <span className="text-center text-slate-600">
                                          {set.weight ?? "-"}
                                        </span>
                                        <span className="text-center text-slate-600">
                                          {set.reps ?? "-"}
                                        </span>
                                        <span className="text-center text-slate-600">
                                          {set.rpe ?? "-"}
                                        </span>
                                        <span className="text-center">
                                          {set.completed ? "✅" : "—"}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                </div>
              ) : null}
            </div>
            <div className="p-6 border-t">
              <button
                onClick={() => {
                  setViewLog(null);
                  setLogDetail(null);
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold"
              >
                ปิดรายละเอียดเซต
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}