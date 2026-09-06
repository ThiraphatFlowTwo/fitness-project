import React, { useState, useEffect, useMemo } from "react";
import {
  TrendingUp,
  Activity,
  Target,
  Award,
  Clock,
  Loader2,
  AlertCircle,
  Calendar,
  Dumbbell,
  Eye,
  X,
  CheckCircle2,
  XCircle,
  CalendarDays,
  FileText,
  Droplet,
  BicepsFlexed,
  Weight,
  Flame,
  HeartPulse,
  Sparkles,
  Zap,
  Ruler,
  Percent,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  evaluateBMI,
  evaluateBodyFat,
  evaluateVisceralFat,
  evaluateWaist,
  evaluateWHR,
  generateSmartAnalysis,
} from "../../utils/fitnessEvaluator";
import SmartInsightSection from "../../components/SmartInsightSection";
import TraineeReportModal from "../../components/TraineeReportModal";

const TRAINEE_API = "http://localhost:5000/api/trainees";
const FITNESS_API = "http://localhost:5000/api/fitness";
const LOG_API = "http://localhost:5000/api/logs";

// ==========================================
// HELPER FUNCTIONS (FULL AUTO-DETECT & KEY FALLBACK)
// ==========================================

// ฟังก์ชันดึงค่าที่ตรวจจับทั้ง Exact Key และ Pattern คำค้นหา
const getVal = (record, keys = [], searchPatterns = []) => {
  if (!record || typeof record !== "object") return null;

  // 1. ค้นหาแบบ Exact Key จาก Array ที่ระบุไว้ก่อน
  for (const k of keys) {
    if (record[k] !== undefined && record[k] !== null && record[k] !== "") {
      const parsed = Number(record[k]);
      return isNaN(parsed) ? record[k] : parsed;
    }
  }

  // 2. Fallback: ถ้าไม่เจอ exact key ให้ค้นจาก Key ทั้งหมดใน Record โดยอิงจาก pattern คำ
  if (searchPatterns.length > 0) {
    const allKeys = Object.keys(record);
    for (const p of searchPatterns) {
      const matchedKey = allKeys.find((k) =>
        k.toLowerCase().includes(p.toLowerCase())
      );
      if (
        matchedKey &&
        record[matchedKey] !== undefined &&
        record[matchedKey] !== null &&
        record[matchedKey] !== ""
      ) {
        const parsed = Number(record[matchedKey]);
        return isNaN(parsed) ? record[matchedKey] : parsed;
      }
    }
  }

  return null;
};

const getWeight = (r) =>
  getVal(r, ["weight", "body_weight", "bodyWeight", "wt", "weight_kg"], ["weight", "wt"]);

const getBmi = (r) =>
  getVal(r, ["bmi", "body_mass_index", "bodyMassIndex"], ["bmi"]);

const getBodyFat = (r) =>
  getVal(
    r,
    ["body_fat_percent", "bodyFat", "body_fat", "fat_percent", "pbf", "PBF", "fatPercent", "bodyFatPercent"],
    ["fat", "pbf"]
  );

const getFatMass = (r) =>
  getVal(r, ["fat_mass", "fatMass", "body_fat_mass", "bfm", "BFM"], ["fat_mass", "bfm"]);

const getMuscleMass = (r) =>
  getVal(
    r,
    ["muscle_mass", "muscleMass", "skeletal_muscle_mass", "smm", "SMM", "muscle"],
    ["muscle", "smm"]
  );

// --- กระดูก / แร่ธาตุ (ครอบคลุมทุก Scale และ Database Field) ---
const getBoneMass = (r) =>
  getVal(
    r,
    [
      "bone_mass",
      "boneMass",
      "bone",
      "bone_mineral",
      "bone_mineral_mass",
      "bone_mass_kg",
      "boneMassKg",
      "mineral",
      "mineral_mass",
      "minerals",
      "bmc",
      "BMC",
      "bone_density",
      "boneDensity",
    ],
    ["bone", "mineral", "bmc"]
  );

// --- น้ำในร่างกาย ---
const getBodyWater = (r) =>
  getVal(
    r,
    [
      "body_water",
      "bodyWater",
      "water_percent",
      "waterPercent",
      "water",
      "tbw",
      "TBW",
      "total_body_water",
      "body_water_mass",
      "water_mass",
      "bodyWaterKg",
    ],
    ["water", "tbw"]
  );

// --- เส้นรอบเอว ---
const getWaist = (r) =>
  getVal(
    r,
    [
      "waist",
      "waist_cm",
      "waistCircumference",
      "waistline",
      "waist_size",
      "waist_length",
      "waist_inch",
      "waist_circumference",
      "waistCm",
    ],
    ["waist"]
  );

const getVisceralFat = (r) =>
  getVal(
    r,
    ["visceral_fat", "visceralFat", "visceral_fat_level", "visceral", "vfl", "VFL"],
    ["visceral", "vfl"]
  );

const getProtein = (r) =>
  getVal(
    r,
    ["protein", "protein_percent", "proteinPercent", "protein_mass", "protein_kg"],
    ["protein"]
  );

const getWhr = (r) =>
  getVal(r, ["whr", "waist_hip_ratio", "waistToHipRatio", "WHR"], ["whr", "hip"]);

const getBmr = (r) =>
  getVal(r, ["bmr", "calories", "basal_metabolic_rate", "BMR"], ["bmr"]);

const getBodyAge = (r) =>
  getVal(r, ["body_age", "bodyAge", "metabolic_age", "metabolicAge"], ["age"]);

// ==========================================
// STYLES & BADGES
// ==========================================
const colorStyles = {
  green: "bg-green-100 text-green-700 border-green-200",
  yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
  orange: "bg-orange-100 text-orange-700 border-orange-200",
  red: "bg-red-100 text-red-700 border-red-200",
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  gray: "bg-gray-100 text-gray-600 border-gray-200",
};

const EvaluationBadge = ({ evaluation }) => {
  if (!evaluation || !evaluation.label) return null;
  const style = colorStyles[evaluation.color] || colorStyles.gray;

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold border ${style}`}
    >
      {evaluation.label}
    </span>
  );
};

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
};

const formatTime = (s) => {
  if (!s) return "-";
  const h = Math.floor(s / 3600),
    m = Math.floor((s % 3600) / 60),
    sec = s % 60;
  return h > 0 ? `${h}ชม. ${m}นาที` : `${m}นาที ${sec}วินาที`;
};

// ==========================================
// MAIN COMPONENT
// ==========================================
const TrainerProgress = () => {
  const [trainees, setTrainees] = useState([]);
  const [selectedTrainee, setSelectedTrainee] = useState(null);
  const [fitnessRecords, setFitnessRecords] = useState([]);
  const [trainingLogs, setTrainingLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState("");
  const [viewLog, setViewLog] = useState(null);
  const [logDetail, setLogDetail] = useState(null);
  const [loadingLog, setLoadingLog] = useState(false);

  const [chartFilter, setChartFilter] = useState("all");
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    const fetchTrainees = async () => {
      try {
        const res = await fetch(TRAINEE_API, { headers: authHeaders() });
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setTrainees(list);
        if (list.length > 0) setSelectedTrainee(list[0]);
      } catch {
        setError("โหลดข้อมูลผู้รับการฝึกไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };
    fetchTrainees();
  }, []);

  useEffect(() => {
    if (!selectedTrainee) return;
    const fetchDetail = async () => {
      setLoadingDetail(true);
      try {
        const [fRes, lRes] = await Promise.all([
          fetch(`${FITNESS_API}/${selectedTrainee._id}`, { headers: authHeaders() }),
          fetch(`${LOG_API}/by-trainee/${selectedTrainee._id}`, { headers: authHeaders() }),
        ]);
        const [fData, lData] = await Promise.all([fRes.json(), lRes.json()]);

        setFitnessRecords(Array.isArray(fData) ? fData : []);
        setTrainingLogs(Array.isArray(lData) ? lData : []);
      } catch {
        setError("โหลดข้อมูลรายละเอียดไม่สำเร็จ");
      } finally {
        setLoadingDetail(false);
      }
    };
    fetchDetail();
  }, [selectedTrainee]);

  const handleViewLog = async (log) => {
    setViewLog(log);
    setLoadingLog(true);
    try {
      const res = await fetch(`${LOG_API}/${log._id}`, { headers: authHeaders() });
      const data = await res.json();
      setLogDetail(data);
    } catch {
      alert("โหลดรายละเอียดไม่สำเร็จ");
    } finally {
      setLoadingLog(false);
    }
  };

  const metrics = useMemo(() => {
    if (fitnessRecords.length === 0) return null;

    const sorted = [...fitnessRecords].sort(
      (a, b) => new Date(a.test_date) - new Date(b.test_date)
    );
    const latest = sorted[sorted.length - 1];
    const previous = sorted.length > 1 ? sorted[sorted.length - 2] : latest;

    // 🔍 ปริ้นท์เพื่อการ Debugging บนเบราว์เซอร์
    console.log("📌 Latest Record Data Payload:", latest);

    const diff = (cur, prev) => {
      const c = parseFloat(cur);
      const p = parseFloat(prev);
      if (!isNaN(c) && !isNaN(p)) {
        return (c - p).toFixed(1);
      }
      return "0";
    };

    const gender = selectedTrainee?.gender || "male";

    // 1. Body Composition Values
    const weight = getWeight(latest);
    const muscleMass = getMuscleMass(latest);
    const fatMass = getFatMass(latest);
    const protein = getProtein(latest);
    const boneMass = getBoneMass(latest);
    const bodyWater = getBodyWater(latest);

    // 2. Obesity Analysis Values
    const bmi = getBmi(latest);
    const pbf = getBodyFat(latest);
    const visceralFat = getVisceralFat(latest);
    const waist = getWaist(latest);
    const whr = getWhr(latest);

    // Evaluations
    const bmiEval = latest.evaluation?.bmi || evaluateBMI(bmi);
    const pbfEval = latest.evaluation?.bodyFat || evaluateBodyFat(pbf, gender);
    const visceralEval = evaluateVisceralFat(visceralFat);
    const waistEval = evaluateWaist(waist, gender);
    const whrEval = evaluateWHR(whr, gender);

    return {
      weight: { value: weight, change: diff(weight, getWeight(previous)) },
      muscleMass: { value: muscleMass, change: diff(muscleMass, getMuscleMass(previous)) },
      fatMass: { value: fatMass, change: diff(fatMass, getFatMass(previous)) },
      protein: { value: protein, change: diff(protein, getProtein(previous)) },
      boneMass: { value: boneMass, change: diff(boneMass, getBoneMass(previous)) },
      bodyWater: { value: bodyWater, change: diff(bodyWater, getBodyWater(previous)) },

      bmi: { value: bmi, change: diff(bmi, getBmi(previous)), evaluation: bmiEval },
      pbf: { value: pbf, change: diff(pbf, getBodyFat(previous)), evaluation: pbfEval },
      visceralFat: { value: visceralFat, evaluation: visceralEval },
      waist: { value: waist, evaluation: waistEval },
      whr: { value: whr, evaluation: whrEval },

      bmr: getBmr(latest),
      bodyAge: getBodyAge(latest),
      lastDate: latest.test_date,
    };
  }, [fitnessRecords, selectedTrainee]);

  const smartInsights = useMemo(() => {
    if (!metrics) return [];
    return generateSmartAnalysis({
      bmiChange: metrics.bmi.change,
      bodyFatChange: metrics.pbf.change,
      trainingCount: trainingLogs.length,
    });
  }, [metrics, trainingLogs]);

  const monthlyData = useMemo(() => {
    if (!fitnessRecords || fitnessRecords.length === 0) return [];
    const sorted = [...fitnessRecords].sort(
      (a, b) => new Date(a.test_date) - new Date(b.test_date)
    );
    const grouped = {};

    sorted.forEach((record) => {
      const d = new Date(record.test_date);
      const monthKey = d.toLocaleDateString("th-TH", { month: "short", year: "2-digit" });
      if (!grouped[monthKey]) grouped[monthKey] = [];
      grouped[monthKey].push(record);
    });

    return Object.keys(grouped).map((month) => {
      const records = grouped[month];
      const lastRecord = records[records.length - 1];

      return {
        month,
        weight: getWeight(lastRecord),
        bmi: getBmi(lastRecord),
        bodyFat: getBodyFat(lastRecord),
        muscleMass: getMuscleMass(lastRecord),
      };
    });
  }, [fitnessRecords]);

  const chartData = useMemo(() => {
    if (!fitnessRecords || fitnessRecords.length === 0) return [];
    return [...fitnessRecords]
      .sort((a, b) => new Date(a.test_date) - new Date(b.test_date))
      .map((r) => {
        const d = new Date(r.test_date);
        return {
          fullDate: d.toLocaleDateString("th-TH", {
            day: "numeric",
            month: "short",
            year: "2-digit",
          }),
          date: d.toLocaleDateString("th-TH", { month: "short", day: "numeric" }),
          weight: getWeight(r),
          bmi: getBmi(r),
          bodyFat: getBodyFat(r),
          muscleMass: getMuscleMass(r),
        };
      });
  }, [fitnessRecords]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-2 text-slate-600 font-medium">กำลังโหลดข้อมูล...</span>
      </div>
    );

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 md:mb-8">
          <h3 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2 md:gap-3">
            <Activity className="text-purple-600 w-5 h-5 md:w-6 md:h-6" /> พัฒนาการผู้รับการฝึก
          </h3>

          {selectedTrainee && (
            <button
              onClick={() => setIsReportOpen(true)}
              className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2.5 rounded-2xl shadow-sm transition-all text-sm self-start sm:self-auto"
            >
              <FileText className="w-4 h-4" /> ออกรายงานสรุป (Export PDF/Card)
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-8">
          <div className="md:col-span-2 bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">
                เลือกผู้รับการฝึก
              </label>
              {trainees.length === 0 ? (
                <p className="text-slate-400 text-sm">ยังไม่มีผู้รับการฝึก</p>
              ) : (
                <select
                  value={selectedTrainee?._id || ""}
                  onChange={(e) =>
                    setSelectedTrainee(trainees.find((t) => t._id === e.target.value))
                  }
                  className="w-full border-2 border-slate-100 rounded-2xl px-3 py-2 md:px-4 md:py-3 focus:border-purple-500 outline-none bg-slate-50 font-semibold text-sm md:text-base"
                >
                  {trainees.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="flex-1 bg-purple-50 border border-purple-100 p-3 md:p-4 rounded-2xl relative overflow-hidden">
              <Target className="absolute -right-2 -bottom-2 w-12 h-12 md:w-16 md:h-16 text-purple-200/50" />
              <p className="text-[10px] font-bold text-purple-400 uppercase mb-1">
                เป้าหมายปัจจุบัน
              </p>
              <p className="text-base md:text-lg font-bold text-purple-700 flex items-center gap-2">
                <Award className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                {selectedTrainee?.goal || "-"}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-slate-100 space-y-2 md:space-y-3">
            {[
              { label: "ครั้งที่ฝึกทั้งหมด", value: trainingLogs.length },
              { label: "ข้อมูลสมรรถภาพ", value: fitnessRecords.length },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-bold uppercase">{item.label}</span>
                <span className="text-xl md:text-2xl font-black text-slate-800">
                  {item.value}
                </span>
              </div>
            ))}
            {metrics?.lastDate && (
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">
                  ทดสอบสมรรถภาพล่าสุด
                </p>
                <p className="text-xs md:text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {new Date(metrics.lastDate).toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>
        </div>

        {loadingDetail ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
            <span className="ml-2 text-gray-500">กำลังโหลดข้อมูล...</span>
          </div>
        ) : (
          <>
            {metrics ? (
              <>
                {/* Section 1: Body Composition */}
                <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-slate-100 mb-6">
                  <h4 className="text-base md:text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    1. การวิเคราะห์องค์ประกอบร่างกาย (Body Composition)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                    {[
                      {
                        label: "น้ำหนัก",
                        val: metrics.weight.value,
                        unit: "กก.",
                        icon: Weight,
                        color: "text-purple-600 bg-purple-50",
                      },
                      {
                        label: "มวลกล้ามเนื้อ",
                        val: metrics.muscleMass.value,
                        unit: "กก.",
                        icon: BicepsFlexed,
                        color: "text-amber-600 bg-amber-50",
                      },
                      {
                        label: "มวลไขมัน",
                        val: metrics.fatMass.value,
                        unit: "กก.",
                        icon: Flame,
                        color: "text-red-500 bg-red-50",
                      },
                      {
                        label: "โปรตีน",
                        val: metrics.protein.value,
                        unit: "กก.",
                        icon: BicepsFlexed,
                        color: "text-indigo-600 bg-indigo-50",
                      },
                      {
                        label: "กระดูก/แร่ธาตุ",
                        val: metrics.boneMass.value,
                        unit: "กก.",
                        icon: Zap,
                        color: "text-emerald-600 bg-emerald-50",
                      },
                      {
                        label: "น้ำในร่างกาย",
                        val: metrics.bodyWater.value,
                        unit: "กก.",
                        icon: Droplet,
                        color: "text-blue-500 bg-blue-50",
                      },
                    ].map((item, idx) => {
                      const IconComp = item.icon;
                      return (
                        <div
                          key={idx}
                          className="p-3 md:p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`p-1.5 rounded-lg ${item.color}`}>
                              <IconComp className="w-4 h-4" />
                            </div>
                            <span className="text-[11px] font-bold text-slate-400">
                              {item.label}
                            </span>
                          </div>
                          <div>
                            <span className="text-lg md:text-xl font-bold text-slate-800">
                              {item.val != null ? item.val : "-"}
                            </span>
                            <span className="text-xs text-slate-500 ml-1">{item.unit}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section 2: Obesity Analysis */}
                <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-slate-100 mb-6">
                  <h4 className="text-base md:text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-red-500" />
                    2. การวิเคราะห์ภาวะอ้วน & ลงพุง (Obesity Analysis)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
                    {[
                      {
                        label: "BMI",
                        val: metrics.bmi.value,
                        unit: "kg/m²",
                        eval: metrics.bmi.evaluation,
                        icon: Activity,
                      },
                      {
                        label: "% ไขมันร่างกาย (PBF)",
                        val: metrics.pbf.value,
                        unit: "%",
                        eval: metrics.pbf.evaluation,
                        icon: Percent,
                      },
                      {
                        label: "ระดับไขมันช่องท้อง",
                        val: metrics.visceralFat.value,
                        unit: "ระดับ",
                        eval: metrics.visceralFat.evaluation,
                        icon: Flame,
                      },
                      {
                        label: "เส้นรอบเอว",
                        val: metrics.waist.value,
                        unit: "ซม.",
                        eval: metrics.waist.evaluation,
                        icon: Ruler,
                      },
                      {
                        label: "อัตราส่วนเอว/สะโพก",
                        val: metrics.whr.value,
                        unit: "",
                        eval: metrics.whr.evaluation,
                        icon: Target,
                      },
                    ].map((item, idx) => {
                      const IconComp = item.icon;
                      return (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <div className="p-2 bg-white rounded-xl shadow-xs text-slate-600">
                                <IconComp className="w-4 h-4" />
                              </div>
                              <EvaluationBadge evaluation={item.eval} />
                            </div>
                            <span className="text-xs font-bold text-slate-400">
                              {item.label}
                            </span>
                            <div className="mt-1">
                              <span className="text-xl md:text-2xl font-black text-slate-800">
                                {item.val != null ? item.val : "-"}
                              </span>
                              <span className="text-xs text-slate-500 ml-1">{item.unit}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6 text-yellow-700 text-sm">
                ⚠️ ยังไม่มีข้อมูลสมรรถภาพของผู้รับการฝึกคนนี้
              </div>
            )}

            {metrics && <SmartInsightSection insights={smartInsights} />}

            {/* Graphs & Charts */}
            <div className="bg-white rounded-3xl p-4 md:p-8 shadow-sm border border-slate-100 mb-4 md:mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h4 className="text-base md:text-lg font-bold text-slate-800">
                    กราฟแสดงพัฒนาการสมรรถภาพทางกาย
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    เปรียบเทียบแนวโน้ม น้ำหนัก, BMI, %ไขมัน และ มวลกล้ามเนื้อ
                  </p>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl gap-1 self-start md:self-auto text-xs font-semibold overflow-x-auto max-w-full">
                  {[
                    { id: "all", label: "ทั้งหมด" },
                    { id: "weight", label: "น้ำหนัก" },
                    { id: "bmi", label: "BMI" },
                    { id: "bodyFat", label: "% ไขมัน" },
                    { id: "muscleMass", label: "มวลกล้ามเนื้อ" },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => setChartFilter(btn.id)}
                      className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                        chartFilter === btn.id
                          ? "bg-white text-purple-600 shadow-sm font-bold"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {chartData.length < 2 ? (
                <div className="h-36 md:h-48 flex items-center justify-center text-slate-400 text-sm text-center px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  ต้องมีข้อมูลสมรรถภาพอย่างน้อย 2 ครั้งขึ้นไปเพื่อแสดงแนวโน้มกราฟ
                </div>
              ) : (
                <div className="h-[260px] md:h-[380px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#64748b" }}
                        dy={8}
                      />
                      {(chartFilter === "all" ||
                        chartFilter === "weight" ||
                        chartFilter === "bmi" ||
                        chartFilter === "bodyFat") && (
                        <YAxis
                          yAxisId="left"
                          domain={["auto", "auto"]}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: "#64748b" }}
                        />
                      )}
                      {(chartFilter === "all" || chartFilter === "muscleMass") && (
                        <YAxis
                          yAxisId={chartFilter === "all" ? "right" : "left"}
                          orientation={chartFilter === "all" ? "right" : "left"}
                          domain={["auto", "auto"]}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: "#F59E0B" }}
                        />
                      )}
                      <Tooltip
                        labelFormatter={(_, payload) => payload?.[0]?.payload?.fullDate || ""}
                        contentStyle={{
                          borderRadius: "16px",
                          border: "none",
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                          padding: "12px 16px",
                        }}
                      />
                      <Legend wrapperStyle={{ paddingTop: "12px" }} />
                      {(chartFilter === "all" || chartFilter === "weight") && (
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="weight"
                          name="น้ำหนัก (kg)"
                          stroke="#8B5CF6"
                          strokeWidth={3}
                          dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                          activeDot={{ r: 6 }}
                          connectNulls
                        />
                      )}
                      {(chartFilter === "all" || chartFilter === "bmi") && (
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="bmi"
                          name="BMI"
                          stroke="#3B82F6"
                          strokeWidth={3}
                          dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                          activeDot={{ r: 6 }}
                          connectNulls
                        />
                      )}
                      {(chartFilter === "all" || chartFilter === "bodyFat") && (
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="bodyFat"
                          name="% ไขมัน"
                          stroke="#10B981"
                          strokeWidth={3}
                          dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                          activeDot={{ r: 6 }}
                          connectNulls
                        />
                      )}
                      {(chartFilter === "all" || chartFilter === "muscleMass") && (
                        <Line
                          yAxisId={chartFilter === "all" ? "right" : "left"}
                          type="monotone"
                          dataKey="muscleMass"
                          name="มวลกล้ามเนื้อ (kg)"
                          stroke="#F59E0B"
                          strokeWidth={3}
                          dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                          activeDot={{ r: 6 }}
                          connectNulls
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Monthly Summary */}
            {monthlyData.length > 0 && (
              <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-slate-100 mb-4 md:mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <CalendarDays className="w-5 h-5 text-purple-600" />
                  <h4 className="text-base md:text-lg font-bold text-slate-800">
                    สรุปความเปลี่ยนแปลงรายเดือน
                  </h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs md:text-sm text-left">
                    <thead className="bg-slate-50 text-slate-400 font-bold uppercase">
                      <tr>
                        <th className="p-3">เดือน</th>
                        <th className="p-3 text-center">น้ำหนัก (kg)</th>
                        <th className="p-3 text-center">BMI</th>
                        <th className="p-3 text-center">% ไขมัน</th>
                        <th className="p-3 text-center">มวลกล้ามเนื้อ (kg)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {monthlyData.map((curr, idx) => {
                        const prev = monthlyData[idx - 1];
                        const diffWeight =
                          prev && curr.weight != null && prev.weight != null
                            ? (curr.weight - prev.weight).toFixed(1)
                            : null;
                        const diffBmi =
                          prev && curr.bmi != null && prev.bmi != null
                            ? (curr.bmi - prev.bmi).toFixed(1)
                            : null;
                        const diffFat =
                          prev && curr.bodyFat != null && prev.bodyFat != null
                            ? (curr.bodyFat - prev.bodyFat).toFixed(1)
                            : null;
                        const diffMuscle =
                          prev && curr.muscleMass != null && prev.muscleMass != null
                            ? (curr.muscleMass - prev.muscleMass).toFixed(1)
                            : null;

                        return (
                          <tr key={curr.month} className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-slate-700">{curr.month}</td>
                            <td className="p-3 text-center">
                              <span>{curr.weight ?? "-"}</span>
                              {diffWeight && (
                                <span
                                  className={`ml-1.5 text-[11px] md:text-xs font-bold ${
                                    parseFloat(diffWeight) < 0
                                      ? "text-green-600"
                                      : parseFloat(diffWeight) > 0
                                      ? "text-red-500"
                                      : "text-slate-400"
                                  }`}
                                >
                                  ({parseFloat(diffWeight) > 0 ? `+${diffWeight}` : diffWeight})
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-center">
                              <span>{curr.bmi ?? "-"}</span>
                              {diffBmi && (
                                <span
                                  className={`ml-1.5 text-[11px] md:text-xs font-bold ${
                                    parseFloat(diffBmi) < 0
                                      ? "text-green-600"
                                      : parseFloat(diffBmi) > 0
                                      ? "text-red-500"
                                      : "text-slate-400"
                                  }`}
                                >
                                  ({parseFloat(diffBmi) > 0 ? `+${diffBmi}` : diffBmi})
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-center">
                              <span>{curr.bodyFat != null ? `${curr.bodyFat}%` : "-"}</span>
                              {diffFat && (
                                <span
                                  className={`ml-1.5 text-[11px] md:text-xs font-bold ${
                                    parseFloat(diffFat) < 0
                                      ? "text-green-600"
                                      : parseFloat(diffFat) > 0
                                      ? "text-red-500"
                                      : "text-slate-400"
                                  }`}
                                >
                                  ({parseFloat(diffFat) > 0 ? `+${diffFat}` : diffFat}%)
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-center">
                              <span>
                                {curr.muscleMass != null ? `${curr.muscleMass} kg` : "-"}
                              </span>
                              {diffMuscle && (
                                <span
                                  className={`ml-1.5 text-[11px] md:text-xs font-bold ${
                                    parseFloat(diffMuscle) > 0
                                      ? "text-green-600"
                                      : parseFloat(diffMuscle) < 0
                                      ? "text-red-500"
                                      : "text-slate-400"
                                  }`}
                                >
                                  ({parseFloat(diffMuscle) > 0 ? `+${diffMuscle}` : diffMuscle} kg)
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Training Logs Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-4 md:px-8 py-4 md:py-5 border-b border-slate-100 flex items-center justify-between">
                <h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm md:text-base">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5 text-purple-600" /> ประวัติการฝึก
                </h4>
                <span className="text-xs md:text-sm text-slate-400">
                  {trainingLogs.length} ครั้ง
                </span>
              </div>

              {trainingLogs.length === 0 ? (
                <div className="py-12 md:py-16 text-center text-slate-400">
                  <Dumbbell className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">ยังไม่มีประวัติการฝึก</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-slate-50 text-slate-400 text-xs font-bold uppercase">
                      <tr>
                        {[
                          "วันที่",
                          "โปรแกรม",
                          "จำนวนท่า",
                          "เซตที่ทำ",
                          "เวลา",
                          "หมายเหตุ",
                          "รายละเอียด",
                        ].map((h) => (
                          <th key={h} className="px-4 md:px-6 py-3 md:py-4 text-left last:text-center">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-sm">
                      {trainingLogs.map((log) => (
                        <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 md:px-6 py-3 md:py-4 font-bold text-slate-700 whitespace-nowrap text-xs md:text-sm">
                            {new Date(log.training_date).toLocaleDateString("th-TH", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-4 md:px-6 py-3 md:py-4 text-slate-600 text-xs md:text-sm">
                            {log.program_id?.program_name || "-"}
                          </td>
                          <td className="px-4 md:px-6 py-3 md:py-4 text-center">
                            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                              {log.exercise_count || 0} ท่า
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-3 md:py-4 text-center">
                            <span className="px-2 py-1 bg-green-50 text-green-600 rounded-full text-xs font-semibold">
                              {log.completed_sets || 0}/{log.set_count || 0}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-3 md:py-4 text-center text-slate-500 whitespace-nowrap text-xs md:text-sm">
                            <span className="flex items-center justify-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTime(log.duration)}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-3 md:py-4 text-slate-500 max-w-[100px] md:max-w-xs truncate text-xs md:text-sm">
                            {log.note || <span className="text-slate-300">-</span>}
                          </td>
                          <td className="px-4 md:px-6 py-3 md:py-4 text-center">
                            <button
                              onClick={() => handleViewLog(log)}
                              className="p-1.5 md:p-2 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Log Modal */}
      {viewLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 md:p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <div>
                <h3 className="font-bold text-slate-800 text-sm md:text-base">รายละเอียดการฝึก</h3>
                <p className="text-xs md:text-sm text-slate-400 mt-0.5">
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
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            <div className="p-4 md:p-6">
              {loadingLog ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                </div>
              ) : logDetail ? (
                <div className="space-y-3 md:space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                    {[
                      { label: "โปรแกรม", value: logDetail.program_id?.program_name || "-" },
                      { label: "จำนวนท่า", value: `${viewLog.exercise_count || 0} ท่า` },
                      {
                        label: "เซตสำเร็จ",
                        value: `${viewLog.completed_sets || 0}/${viewLog.set_count || 0}`,
                      },
                      { label: "เวลา", value: formatTime(logDetail.duration) },
                    ].map((item) => (
                      <div key={item.label} className="p-2 md:p-3 bg-slate-50 rounded-xl">
                        <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                        <p className="text-xs md:text-sm font-semibold text-slate-700">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {logDetail.note && (
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                      <p className="text-xs text-blue-400 font-semibold mb-1">📝 หมายเหตุ</p>
                      <p className="text-sm text-blue-700">{logDetail.note}</p>
                    </div>
                  )}

                  {logDetail.sets &&
                    (() => {
                      const grouped = logDetail.sets.reduce((acc, s) => {
                        const key = s.exercise_id?._id || s.exercise_id;
                        const name = s.exercise_id?.exercise_name || "-";
                        const type = s.exercise_id?.exercise_type || "";
                        if (!acc[key]) acc[key] = { name, type, note: s.note, sets: [] };
                        acc[key].sets.push(s);
                        return acc;
                      }, {});

                      return (
                        <div className="space-y-3 pt-2">
                          <h4 className="font-bold text-slate-800 text-sm md:text-base border-b pb-2">
                            รายละเอียดในแต่ละท่า
                          </h4>
                          {Object.values(grouped).map((group, idx) => (
                            <div
                              key={idx}
                              className="border border-slate-100 rounded-2xl p-3 md:p-4 bg-slate-50/50"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-slate-700 text-sm">
                                  {group.name}
                                </span>
                                {group.type && (
                                  <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                                    {group.type}
                                  </span>
                                )}
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {group.sets.map((set, sIdx) => (
                                  <div
                                    key={sIdx}
                                    className={`p-2 rounded-xl border flex items-center justify-between ${
                                      set.completed
                                        ? "bg-green-50/50 border-green-200 text-green-700"
                                        : "bg-red-50/50 border-red-200 text-red-700"
                                    }`}
                                  >
                                    <span className="text-xs font-semibold">
                                      เซต {set.set_number || sIdx + 1}: {set.weight ?? 0}kg ×{" "}
                                      {set.reps ?? 0}
                                    </span>
                                    {set.completed ? (
                                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                    ) : (
                                      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 text-sm">ไม่พบข้อมูลรายละเอียด</div>
              )}
            </div>
          </div>
        </div>
      )}

      <TraineeReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        trainee={selectedTrainee}
        metrics={metrics}
        trainingLogs={trainingLogs}
        smartInsights={smartInsights}
      />
    </div>
  );
};

export default TrainerProgress;