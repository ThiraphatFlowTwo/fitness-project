import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Users, Dumbbell, Clock, Loader2,
  AlertCircle, Calendar, Eye, X, Activity,
} from "lucide-react";
import api from "../../services/api"; // ✅ ใช้ axios แทน fetch

const formatTime = (s) => {
  if (!s) return '-';
  const h   = Math.floor(s / 3600);
  const m   = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0 ? `${h}ชม. ${m}นาที` : `${m}นาที ${sec}วินาที`;
};

const bmiBadge = (bmi) => {
  if (!bmi) return { label: '-', cls: 'bg-slate-100 text-slate-400' };
  if (bmi < 18.5) return { label: bmi.toFixed(1), cls: 'bg-blue-50 text-blue-600' };
  if (bmi < 25)   return { label: bmi.toFixed(1), cls: 'bg-green-50 text-green-600' };
  if (bmi < 30)   return { label: bmi.toFixed(1), cls: 'bg-amber-50 text-amber-600' };
  return             { label: bmi.toFixed(1), cls: 'bg-red-50 text-red-600' };
};

const GRADIENTS = [
  "from-teal-400 to-cyan-500", "from-blue-400 to-indigo-500",
  "from-amber-400 to-orange-500", "from-violet-400 to-purple-500",
  "from-rose-400 to-pink-500", "from-green-400 to-emerald-500",
];

const STATUS_CONFIG = {
  active:   { label: "ใช้งานอยู่", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  pending:  { label: "รออนุมัติ",  bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500"   },
  inactive: { label: "ปิดใช้งาน", bg: "bg-slate-100",  text: "text-slate-500",   dot: "bg-slate-400"   },
};

const PROGRAM_STATUS = {
  draft:    { label: "ร่าง",        bg: "bg-slate-100",  text: "text-slate-500"   },
  pending:  { label: "รออนุมัติ",   bg: "bg-amber-50",   text: "text-amber-600"   },
  approved: { label: "อนุมัติแล้ว", bg: "bg-emerald-50", text: "text-emerald-600" },
  rejected: { label: "ไม่อนุมัติ",  bg: "bg-red-50",     text: "text-red-600"     },
};

export default function TrainerDetail() {
  const { trainerId } = useParams();
  const navigate      = useNavigate();

  const [trainer,     setTrainer]     = useState(null);
  const [trainees,    setTrainees]    = useState([]);
  const [logs,        setLogs]        = useState([]);
  const [fitness,     setFitness]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [activeTab,   setActiveTab]   = useState('trainees');

  const [viewTrainee, setViewTrainee] = useState(null);
  const [viewLog,     setViewLog]     = useState(null);
  const [logDetail,   setLogDetail]   = useState(null);
  const [loadingLog,  setLoadingLog]  = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError('');
      try {
        // ✅ ใช้ api (axios) แทน fetch ทั้งหมด
        const [trainerRes, traineesRes, logsRes, fitnessRes] = await Promise.all([
          api.get("/instructor/trainers"),
          api.get(`/instructor/trainer/${trainerId}/trainees`),
          api.get(`/instructor/trainer/${trainerId}/logs`),
          api.get(`/instructor/trainer/${trainerId}/fitness`),
        ]);

        const found = Array.isArray(trainerRes.data)
          ? trainerRes.data.find(t => t._id === trainerId)
          : null;

        setTrainer(found || null);
        setTrainees(Array.isArray(traineesRes.data) ? traineesRes.data : []);
        setLogs(Array.isArray(logsRes.data)         ? logsRes.data     : []);
        setFitness(Array.isArray(fitnessRes.data)   ? fitnessRes.data  : []);
      } catch (err) {
        setError(err.response?.data?.message || 'โหลดข้อมูลไม่สำเร็จ');
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
      // ✅ ใช้ api (axios)
      const res = await api.get(`/instructor/log/${log._id}`);
      setLogDetail(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'โหลดรายละเอียดไม่สำเร็จ');
    } finally {
      setLoadingLog(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      <span className="ml-2 text-gray-600">กำลังโหลดข้อมูล...</span>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen text-red-500">
      <AlertCircle className="w-5 h-5 mr-2" />{error}
    </div>
  );

  const st = STATUS_CONFIG[trainer?.status] || STATUS_CONFIG.pending;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">

        <button onClick={() => navigate('/instructor/trainees')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">กลับรายชื่อเทรนเนอร์</span>
        </button>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
          <div className="flex flex-wrap items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg shrink-0">
              {trainer?.name?.charAt(0) || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-slate-800">{trainer?.name}</h1>
                <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-semibold ${st.bg} ${st.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                  {st.label}
                </span>
              </div>
              <p className="text-slate-400 text-sm mb-1">@{trainer?.username}</p>
              <p className="text-slate-500 text-sm">{trainer?.email}</p>
              {trainer?.created_at && (
                <p className="text-slate-400 text-xs mt-2">
                  สมัครเมื่อ {new Date(trainer.created_at).toLocaleDateString('th-TH', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
              )}
            </div>
            <div className="flex gap-4 shrink-0">
              <div className="p-4 bg-blue-50 rounded-2xl text-center min-w-[80px]">
                <p className="text-3xl font-black text-blue-700">{trainees.length}</p>
                <p className="text-xs text-blue-500 mt-1 font-medium">ลูกเทรน</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-2xl text-center min-w-[80px]">
                <p className="text-3xl font-black text-purple-700">{logs.length}</p>
                <p className="text-xs text-purple-500 mt-1 font-medium">ครั้งที่ฝึก</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-2xl text-center min-w-[80px]">
                <p className="text-3xl font-black text-emerald-700">{fitness.length}</p>
                <p className="text-xs text-emerald-500 mt-1 font-medium">ผลสมรรถภาพ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {[
            { key: 'trainees', label: `ลูกเทรน (${trainees.length})`,    icon: Users    },
            { key: 'logs',     label: `ประวัติการฝึก (${logs.length})`,   icon: Calendar },
            { key: 'fitness',  label: `ผลสมรรถภาพ (${fitness.length})`,   icon: Activity },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
              }`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: ลูกเทรน */}
        {activeTab === 'trainees' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-800">รายชื่อลูกเทรน</h2>
            </div>
            {trainees.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>ยังไม่มีลูกเทรน</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {trainees.map((t, i) => (
                  <div key={t._id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                      {t.name?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm">{t.name}</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-xs text-slate-400">{t.gender} • {t.age} ปี</span>
                        {t.goal && (
                          <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">{t.goal}</span>
                        )}
                      </div>
                    </div>
                    <div className="hidden md:flex gap-4 text-xs text-slate-500 shrink-0">
                      {t.height && <span>ส่วนสูง {t.height} ซม.</span>}
                      {t.weight && <span>น้ำหนัก {t.weight} กก.</span>}
                    </div>
                    <button onClick={() => setViewTrainee(t)}
                      className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-slate-100 rounded-xl text-xs text-slate-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all shrink-0">
                      <Eye className="w-3.5 h-3.5" />ดูข้อมูล
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: ประวัติการฝึก */}
        {activeTab === 'logs' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-800">ประวัติการฝึกทั้งหมด</h2>
            </div>
            {logs.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <Dumbbell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>ยังไม่มีประวัติการฝึก</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 text-slate-400 text-xs font-bold uppercase">
                    <tr>
                      <th className="px-6 py-4 text-left">วันที่</th>
                      <th className="px-6 py-4 text-left">ลูกเทรน</th>
                      <th className="px-6 py-4 text-left">โปรแกรม</th>
                      <th className="px-6 py-4 text-center">สถานะโปรแกรม</th>
                      <th className="px-6 py-4 text-center">จำนวนท่า</th>
                      <th className="px-6 py-4 text-center">เซตสำเร็จ</th>
                      <th className="px-6 py-4 text-center">เวลา</th>
                      <th className="px-6 py-4 text-center">รายละเอียด</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-sm">
                    {logs.map(log => {
                      const ps = PROGRAM_STATUS[log.program_id?.status] || PROGRAM_STATUS.draft;
                      return (
                        <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-700 whitespace-nowrap">
                            {new Date(log.training_date).toLocaleDateString('th-TH', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4 text-slate-600">{log.trainee_id?.name || '-'}</td>
                          <td className="px-6 py-4 text-slate-600">{log.program_id?.program_name || '-'}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${ps.bg} ${ps.text}`}>
                              {ps.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                              {log.exercise_count || 0} ท่า
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="px-2 py-1 bg-green-50 text-green-600 rounded-full text-xs font-semibold">
                              {log.completed_sets || 0}/{log.set_count || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center text-slate-500 whitespace-nowrap">
                            <span className="flex items-center justify-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTime(log.duration)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button onClick={() => handleViewLog(log)}
                              className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg transition-colors">
                              <Eye className="w-4 h-4" />
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

        {/* Tab: ผลสมรรถภาพ */}
        {activeTab === 'fitness' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-800">ผลทดสอบสมรรถภาพร่างกาย</h2>
            </div>
            {fitness.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>ยังไม่มีข้อมูลสมรรถภาพ</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 text-slate-400 text-xs font-bold uppercase">
                    <tr>
                      <th className="px-6 py-4 text-left">ลูกเทรน</th>
                      <th className="px-6 py-4 text-left">วันที่ทดสอบ</th>
                      <th className="px-6 py-4 text-center">BMI</th>
                      <th className="px-6 py-4 text-center">ไขมัน %</th>
                      <th className="px-6 py-4 text-center">VO₂ Max</th>
                      <th className="px-6 py-4 text-center">ชีพจร (bpm)</th>
                      <th className="px-6 py-4 text-center">ความแข็งแรง</th>
                      <th className="px-6 py-4 text-center">ความยืดหยุ่น</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-sm">
                    {fitness.map(f => {
                      const bmi = bmiBadge(f.bmi);
                      return (
                        <tr key={f._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-slate-800">{f.trainee_id?.name || '-'}</td>
                          <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                            {new Date(f.test_date).toLocaleDateString('th-TH', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${bmi.cls}`}>
                              {bmi.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center text-slate-600">
                            {f.body_fat_percent != null ? `${f.body_fat_percent}%` : '-'}
                          </td>
                          <td className="px-6 py-4 text-center text-slate-600">
                            {f.vo2_max?.toFixed(1) || '-'}
                          </td>
                          <td className="px-6 py-4 text-center text-slate-600">
                            {f.resting_heart_rate || '-'}
                          </td>
                          <td className="px-6 py-4 text-center text-slate-600">
                            {f.muscle_strength || '-'}
                          </td>
                          <td className="px-6 py-4 text-center text-slate-600">
                            {f.flexibility || '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            <div className="px-6 py-3 border-t border-slate-50 flex flex-wrap gap-3 text-xs text-slate-500">
              <span className="font-semibold">BMI:</span>
              {[
                { cls: 'bg-blue-50 text-blue-600',   label: 'ต่ำกว่าเกณฑ์ (<18.5)' },
                { cls: 'bg-green-50 text-green-600', label: 'ปกติ (18.5–24.9)'      },
                { cls: 'bg-amber-50 text-amber-600', label: 'น้ำหนักเกิน (25–29.9)' },
                { cls: 'bg-red-50 text-red-600',     label: 'อ้วน (≥30)'            },
              ].map(b => (
                <span key={b.label} className={`px-2 py-0.5 rounded-full font-medium ${b.cls}`}>
                  {b.label}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Modal ข้อมูลลูกเทรน */}
      {viewTrainee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <h3 className="font-bold text-slate-800">ข้อมูลลูกเทรน</h3>
              <button onClick={() => setViewTrainee(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow">
                  {viewTrainee.name?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-800">{viewTrainee.name}</p>
                  <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-medium">
                    {viewTrainee.goal || 'ไม่ระบุเป้าหมาย'}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'เพศ',     value: viewTrainee.gender || '-' },
                  { label: 'อายุ',    value: viewTrainee.age    ? `${viewTrainee.age} ปี`     : '-' },
                  { label: 'ส่วนสูง', value: viewTrainee.height ? `${viewTrainee.height} ซม.` : '-' },
                  { label: 'น้ำหนัก', value: viewTrainee.weight ? `${viewTrainee.weight} กก.` : '-' },
                ].map(item => (
                  <div key={item.label} className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                    <p className="text-sm font-semibold text-slate-700">{item.value}</p>
                  </div>
                ))}
              </div>
              {viewTrainee.healthCondition && (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-xs text-blue-400 font-semibold mb-1">🏥 ข้อมูลสุขภาพพื้นฐาน</p>
                  <p className="text-sm text-blue-700">{viewTrainee.healthCondition}</p>
                </div>
              )}
              {viewTrainee.createdAt && (
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs text-slate-400 font-semibold">วันที่เพิ่มเข้าระบบ</span>
                  <span className="text-sm text-slate-700 font-medium">
                    {new Date(viewTrainee.createdAt).toLocaleDateString('th-TH', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>
            <div className="p-6 border-t">
              <button onClick={() => setViewTrainee(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold">
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal รายละเอียด Log */}
      {viewLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <div>
                <h3 className="font-bold text-slate-800">รายละเอียดการฝึก</h3>
                <p className="text-sm text-slate-400 mt-0.5">
                  {new Date(viewLog.training_date).toLocaleDateString('th-TH', {
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
              </div>
              <button onClick={() => { setViewLog(null); setLogDetail(null); }}
                className="text-slate-400 hover:text-slate-600">
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
                      { label: 'ลูกเทรน',   value: logDetail.trainee_id?.name         || '-' },
                      { label: 'โปรแกรม',   value: logDetail.program_id?.program_name || '-' },
                      { label: 'เซตสำเร็จ', value: `${viewLog.completed_sets || 0}/${viewLog.set_count || 0}` },
                      { label: 'เวลา',      value: formatTime(logDetail.duration)            },
                    ].map(item => (
                      <div key={item.label} className="p-3 bg-slate-50 rounded-xl">
                        <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                        <p className="text-sm font-semibold text-slate-700">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  {logDetail.program_id?.instructor_comment && (
                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                      <p className="text-xs text-amber-500 font-semibold mb-1">💬 ความคิดเห็นอาจารย์</p>
                      <p className="text-sm text-amber-700">{logDetail.program_id.instructor_comment}</p>
                    </div>
                  )}
                  {logDetail.note && (
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                      <p className="text-xs text-blue-400 font-semibold mb-1">📝 หมายเหตุ</p>
                      <p className="text-sm text-blue-700">{logDetail.note}</p>
                    </div>
                  )}
                  {logDetail.sets && (() => {
                    const grouped = logDetail.sets.reduce((acc, s) => {
                      const key  = s.exercise_id?._id || s.exercise_id;
                      const name = s.exercise_id?.exercise_name || '-';
                      const type = s.exercise_id?.exercise_type || '';
                      if (!acc[key]) acc[key] = { name, type, note: s.note, sets: [] };
                      acc[key].sets.push(s);
                      return acc;
                    }, {});
                    return (
                      <div className="space-y-3">
                        <p className="text-sm font-semibold text-slate-600">ท่าออกกำลังกาย</p>
                        {Object.entries(grouped).map(([key, ex]) => (
                          <div key={key} className="border border-slate-100 rounded-xl overflow-hidden">
                            <div className="px-4 py-3 bg-slate-50 flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-slate-800 text-sm">{ex.name}</p>
                                <p className="text-xs text-slate-400">{ex.type}</p>
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
                              {ex.sets.sort((a, b) => a.set_number - b.set_number).map(set => (
                                <div key={set.set_number}
                                  className={`grid grid-cols-5 gap-2 text-sm py-1.5 px-1 rounded-lg mb-1 ${
                                    set.completed ? 'bg-green-50' : 'bg-white'
                                  }`}>
                                  <span className="font-bold text-slate-600">{set.set_number}</span>
                                  <span className="text-center text-slate-600">{set.weight ?? '-'}</span>
                                  <span className="text-center text-slate-600">{set.reps ?? '-'}</span>
                                  <span className="text-center text-slate-600">{set.rpe ?? '-'}</span>
                                  <span className="text-center">{set.completed ? '✅' : '—'}</span>
                                </div>
                              ))}
                              {ex.note && (
                                <p className="text-xs text-slate-400 mt-2 italic">💬 {ex.note}</p>
                              )}
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
              <button onClick={() => { setViewLog(null); setLogDetail(null); }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold">
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}