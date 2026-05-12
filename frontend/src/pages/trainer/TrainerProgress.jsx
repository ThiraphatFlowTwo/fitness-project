import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp, Heart, Activity, Scale, Droplet,
  Target, Award, Clock, Loader2, AlertCircle,
  Calendar, Dumbbell, FileText, Eye, X
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const TRAINEE_API = "http://localhost:5000/api/trainees";
const FITNESS_API = "http://localhost:5000/api/fitness";
const LOG_API     = "http://localhost:5000/api/logs";

const getToken    = () => localStorage.getItem("token");
const authHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login"; // ✅ redirect ถ้าไม่มี token
    return {};
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const formatTime = (s) => {
  if (!s) return '-';
  const h   = Math.floor(s / 3600);
  const m   = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0
    ? `${h}ชม. ${m}นาที`
    : `${m}นาที ${sec}วินาที`;
};

const TrainerProgress = () => {
  const [trainees,         setTrainees]         = useState([]);
  const [selectedTrainee,  setSelectedTrainee]  = useState(null);
  const [fitnessRecords,   setFitnessRecords]   = useState([]);
  const [trainingLogs,     setTrainingLogs]     = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [loadingDetail,    setLoadingDetail]    = useState(false);
  const [error,            setError]            = useState('');

  // Modal ดูรายละเอียด log
  const [viewLog,     setViewLog]     = useState(null);
  const [logDetail,   setLogDetail]   = useState(null);
  const [loadingLog,  setLoadingLog]  = useState(false);

  // ── โหลดลูกเทรน ──────────────────────────────────────────────
  useEffect(() => {
    const fetchTrainees = async () => {
      try {
        const res  = await fetch(TRAINEE_API, { headers: authHeaders() });
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setTrainees(list);
        if (list.length > 0) setSelectedTrainee(list[0]);
      } catch {
        setError('โหลดข้อมูลไม่สำเร็จ');
      } finally {
        setLoading(false);
      }
    };
    fetchTrainees();
  }, []);

  // ── โหลดข้อมูลเมื่อเลือกลูกเทรน ──────────────────────────────
  useEffect(() => {
    if (!selectedTrainee) return;

    const fetchDetail = async () => {
      setLoadingDetail(true);
      try {
        const [fRes, lRes] = await Promise.all([
          fetch(`${FITNESS_API}/${selectedTrainee._id}`,               { headers: authHeaders() }),
          fetch(`${LOG_API}/by-trainee/${selectedTrainee._id}`,        { headers: authHeaders() }),
        ]);
        const [fData, lData] = await Promise.all([fRes.json(), lRes.json()]);
        setFitnessRecords(Array.isArray(fData) ? fData : []);
        setTrainingLogs(Array.isArray(lData)   ? lData : []);
      } catch {
        setError('โหลดข้อมูลรายละเอียดไม่สำเร็จ');
      } finally {
        setLoadingDetail(false);
      }
    };
    fetchDetail();
  }, [selectedTrainee]);

  // ── ดูรายละเอียด log ─────────────────────────────────────────
  const handleViewLog = async (log) => {
    setViewLog(log);
    setLoadingLog(true);
    try {
      const res  = await fetch(`${LOG_API}/${log._id}`, { headers: authHeaders() });
      const data = await res.json();
      setLogDetail(data);
    } catch {
      alert('โหลดรายละเอียดไม่สำเร็จ');
    } finally {
      setLoadingLog(false);
    }
  };

  // ── คำนวณ metrics จาก PhysicalFitness ────────────────────────
  const metrics = useMemo(() => {
    if (fitnessRecords.length === 0) return null;
    const sorted   = [...fitnessRecords].sort((a, b) => new Date(a.test_date) - new Date(b.test_date));
    const latest   = sorted[sorted.length - 1];
    const previous = sorted.length > 1 ? sorted[sorted.length - 2] : latest;
    const diff     = (cur, prev) => cur != null && prev != null ? (cur - prev).toFixed(1) : '0';

    return {
      bmi:     { value: latest.bmi,                change: diff(latest.bmi,                previous.bmi)                },
      bodyFat: { value: latest.body_fat_percent,    change: diff(latest.body_fat_percent,    previous.body_fat_percent)   },
      weight:  { value: latest.bmi ? (latest.bmi * Math.pow(1.7, 2)).toFixed(1) : null, change: '0' },
      vo2Max:  { value: latest.vo2_max,             change: diff(latest.vo2_max,             previous.vo2_max)            },
      lastDate: latest.test_date,
    };
  }, [fitnessRecords]);

  // ── แปลง fitnessRecords → chart data ─────────────────────────
  const chartData = useMemo(() => {
    return [...fitnessRecords]
      .sort((a, b) => new Date(a.test_date) - new Date(b.test_date))
      .map(r => ({
        date:    new Date(r.test_date).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' }),
        bmi:     r.bmi             || null,
        bodyFat: r.body_fat_percent || null,
        vo2Max:  r.vo2_max          || null,
      }));
  }, [fitnessRecords]);

  // ── HealthMetricCard ──────────────────────────────────────────
  const HealthMetricCard = ({ icon: Icon, label, value, unit, change }) => {
    const isDown = parseFloat(change) < 0;
    const isZero = parseFloat(change) === 0;
    const getColor = () => {
      if (isZero) return 'text-gray-500';
      if (label === 'VO2 Max') return !isDown ? 'text-green-600' : 'text-red-600';
      return isDown ? 'text-green-600' : 'text-red-600';
    };
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-slate-50 rounded-xl">
            <Icon className="w-6 h-6 text-slate-600" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-slate-800">{value ?? '-'}</span>
          <span className="text-sm text-slate-500 font-medium">{unit}</span>
        </div>
        <div className={`flex items-center gap-1 mt-2 text-sm font-bold ${getColor()}`}>
          {!isZero && <TrendingUp className={`w-4 h-4 ${isDown ? 'rotate-180' : ''}`} />}
          <span>{isZero ? 'คงที่' : `${parseFloat(change) > 0 ? '+' : ''}${change} ${unit}`}</span>
        </div>
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      <span className="ml-2 text-gray-600">กำลังโหลดข้อมูล...</span>
    </div>
  );

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
          <Activity className="text-purple-600" /> พัฒนาการผู้รับการฝึก
        </h3>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 mr-2" />{error}
          </div>
        )}

        {/* เลือกลูกเทรน */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">
                เลือกผู้รับการฝึก
              </label>
              {trainees.length === 0 ? (
                <p className="text-slate-400 text-sm">ยังไม่มีผู้รับการฝึก</p>
              ) : (
                <select
                  value={selectedTrainee?._id || ''}
                  onChange={e => {
                    const t = trainees.find(t => t._id === e.target.value);
                    setSelectedTrainee(t);
                  }}
                  className="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 focus:border-purple-500 outline-none bg-slate-50 font-semibold"
                >
                  {trainees.map(t => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* เป้าหมาย */}
            <div className="flex-1 bg-purple-50 border border-purple-100 p-4 rounded-2xl relative overflow-hidden">
              <Target className="absolute -right-2 -bottom-2 w-16 h-16 text-purple-200/50" />
              <p className="text-[10px] font-bold text-purple-400 uppercase mb-1">เป้าหมายปัจจุบัน</p>
              <p className="text-lg font-bold text-purple-700 flex items-center gap-2">
                <Award className="w-5 h-5" />
                {selectedTrainee?.goal || '-'}
              </p>
            </div>
          </div>

          {/* สถิติรวม */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-bold uppercase">ครั้งที่ฝึกทั้งหมด</span>
              <span className="text-2xl font-black text-slate-800">{trainingLogs.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-bold uppercase">ข้อมูลสมรรถภาพ</span>
              <span className="text-2xl font-black text-slate-800">{fitnessRecords.length}</span>
            </div>
            {metrics?.lastDate && (
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">ทดสอบสมรรถภาพล่าสุด</p>
                <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {new Date(metrics.lastDate).toLocaleDateString('th-TH', {
                    day: 'numeric', month: 'short', year: 'numeric'
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
            {/* Health Metrics */}
            {metrics ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <HealthMetricCard icon={Activity} label="BMI"       value={metrics.bmi.value}     unit=""  change={metrics.bmi.change}     />
                <HealthMetricCard icon={Droplet}  label="% ไขมัน"   value={metrics.bodyFat.value} unit="%" change={metrics.bodyFat.change} />
                <HealthMetricCard icon={Heart}    label="VO2 Max"   value={metrics.vo2Max.value}  unit=""  change={metrics.vo2Max.change}  />
                <HealthMetricCard icon={Scale}    label="ครั้งที่ฝึก" value={trainingLogs.length}  unit="ครั้ง" change="0" />
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-8 text-yellow-700 text-sm">
                ⚠️ ยังไม่มีข้อมูลสมรรถภาพของผู้รับการฝึกคนนี้
              </div>
            )}

            {/* กราฟพัฒนาการ */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
              <h4 className="text-lg font-bold text-slate-800 mb-6">
                กราฟแสดงพัฒนาการสมรรถภาพทางกาย
              </h4>
              {chartData.length < 2 ? (
                <div className="h-48 flex items-center justify-center text-slate-400">
                  <p>ต้องมีข้อมูลสมรรถภาพอย่างน้อย 2 ครั้งขึ้นไปเพื่อแสดงกราฟ</p>
                </div>
              ) : (
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                      <Legend />
                      <Line type="monotone" dataKey="bmi"     name="BMI"      stroke="#3B82F6" strokeWidth={3} dot={{ r: 5 }} connectNulls />
                      <Line type="monotone" dataKey="bodyFat" name="% ไขมัน"  stroke="#10B981" strokeWidth={3} dot={{ r: 5 }} connectNulls />
                      <Line type="monotone" dataKey="vo2Max"  name="VO2 Max"  stroke="#8B5CF6" strokeWidth={3} dot={{ r: 5 }} connectNulls />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* ตารางประวัติการฝึก */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  ประวัติการฝึก
                </h4>
                <span className="text-sm text-slate-400">{trainingLogs.length} ครั้ง</span>
              </div>

              {trainingLogs.length === 0 ? (
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
                        <th className="px-6 py-4 text-left">โปรแกรม</th>
                        <th className="px-6 py-4 text-center">จำนวนท่า</th>
                        <th className="px-6 py-4 text-center">เซตที่ทำ</th>
                        <th className="px-6 py-4 text-center">เวลา</th>
                        <th className="px-6 py-4 text-left">หมายเหตุ</th>
                        <th className="px-6 py-4 text-center">รายละเอียด</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-sm">
                      {trainingLogs.map(log => (
                        <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-700 whitespace-nowrap">
                            {new Date(log.training_date).toLocaleDateString('th-TH', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            {log.program_id?.program_name || '-'}
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
                          <td className="px-6 py-4 text-slate-500 max-w-xs truncate">
                            {log.note || <span className="text-slate-300">-</span>}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button onClick={() => handleViewLog(log)}
                              className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg transition-colors">
                              <Eye className="w-4 h-4" />
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

      {/* ===== Modal รายละเอียด Log ===== */}
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

                  {/* ข้อมูลหลัก */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'โปรแกรม',   value: logDetail.program_id?.program_name || '-' },
                      { label: 'จำนวนท่า',  value: `${viewLog.exercise_count || 0} ท่า` },
                      { label: 'เซตสำเร็จ', value: `${viewLog.completed_sets || 0}/${viewLog.set_count || 0}` },
                      { label: 'เวลา',      value: formatTime(logDetail.duration) },
                    ].map(item => (
                      <div key={item.label} className="p-3 bg-slate-50 rounded-xl">
                        <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                        <p className="text-sm font-semibold text-slate-700">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* หมายเหตุรวม */}
                  {logDetail.note && (
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                      <p className="text-xs text-blue-400 font-semibold mb-1">📝 หมายเหตุ</p>
                      <p className="text-sm text-blue-700">{logDetail.note}</p>
                    </div>
                  )}

                  {/* รายละเอียดแต่ละท่า */}
                  {logDetail.sets && (() => {
                    // group by exercise
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
                                <div key={set.set_number} className={`grid grid-cols-5 gap-2 text-sm py-1.5 px-1 rounded-lg mb-1 ${
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
};

export default TrainerProgress;