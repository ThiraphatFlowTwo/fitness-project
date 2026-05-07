import React, { useState, useMemo } from 'react';
import { TrendingUp, Heart, Activity, Scale, Droplet, Target, Award, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TrainerProgress = () => {
  // 1. รายชื่อผู้รับการฝึก (เพิ่มข้อมูลเป้าหมายเข้าไปที่นี่)
  const [trainees] = useState([
    { id: '1', name: 'สมหญิง ชัยชนะ', goal: 'เพิ่มมวลกล้ามเนื้อ' },
    { id: '2', name: 'ประภาส สุขใจ', goal: 'ลดน้ำหนัก/ลดไขมัน' },
    { id: '3', name: 'วิชัย กล้าหาญ', goal: 'ความทนทาน (Cardio)' }
  ]);

  const [selectedTraineeId, setSelectedTraineeId] = useState('1');

  // 2. จำลองข้อมูลแยกตามรายคน
  const dataByTrainee = {
    '1': {
      chart: [
        { month: 'ม.ค.', bmi: 23.5, bodyFat: 20.5, weight: 48, vo2Max: 38 },
        { month: 'ก.พ.', bmi: 23.2, bodyFat: 20.0, weight: 47, vo2Max: 39 },
        { month: 'มี.ค.', bmi: 22.8, bodyFat: 19.5, weight: 46, vo2Max: 40 },
        { month: 'เม.ย.', bmi: 22.5, bodyFat: 19.0, weight: 45.5, vo2Max: 41 },
        { month: 'พ.ค.', bmi: 22.5, bodyFat: 18.2, weight: 45, vo2Max: 42 }
      ],
      history: [
        { date: '25 พ.ค. 2568', program: 'โปรแกรมเพิ่มกล้ามเนื้อ', result: 'พัฒนาการดีขึ้นต่อเนื่อง', status: 'ดีเยี่ยม', color: 'green' }
      ]
    },
    '2': {
      chart: [
        { month: 'ม.ค.', bmi: 26.5, bodyFat: 25.5, weight: 80, vo2Max: 32 },
        { month: 'พ.ค.', bmi: 24.5, bodyFat: 22.1, weight: 74, vo2Max: 36 }
      ],
      history: [
        { date: '20 พ.ค. 2568', program: 'ลดไขมันเร่งด่วน', result: 'น้ำหนักลดลงตามเป้า', status: 'ดี', color: 'blue' }
      ]
    },
    '3': { chart: [], history: [] }
  };

  // 3. คำนวณข้อมูลหน้าจอ
  const currentData = useMemo(() => {
    const trainee = trainees.find(t => t.id === selectedTraineeId); // หาข้อมูลคนฝึกที่เลือก
    const traineeData = dataByTrainee[selectedTraineeId] || { chart: [], history: [] };
    const logs = traineeData.chart;
    
    // จัดการกรณีไม่มีข้อมูล
    if (logs.length === 0) {
      return { traineeGoal: trainee.goal, chart: [], history: [], metrics: null };
    }

    const latest = logs[logs.length - 1];
    const previous = logs.length > 1 ? logs[logs.length - 2] : latest;
    const calcChange = (cur, prev) => (cur - prev).toFixed(1);

    return {
      traineeGoal: trainee.goal, // ส่งเป้าหมายออกไปแสดงผล
      chart: logs,
      history: traineeData.history,
      metrics: {
        bmi: { value: latest.bmi, change: calcChange(latest.bmi, previous.bmi) },
        bodyFat: { value: latest.bodyFat, change: calcChange(latest.bodyFat, previous.bodyFat) },
        weight: { value: latest.weight, change: calcChange(latest.weight, previous.weight) },
        vo2Max: { value: latest.vo2Max, change: calcChange(latest.vo2Max, previous.vo2Max) }
      }
    };
  }, [selectedTraineeId, trainees]);

  const HealthMetricCard = ({ icon: Icon, label, value, unit, change }) => {
    const isDown = parseFloat(change) < 0;
    const isZero = parseFloat(change) === 0;
    const getStatusColor = () => {
      if (isZero) return 'text-gray-500';
      if (label === 'VO2 Max') return !isDown ? 'text-green-600' : 'text-red-600';
      return isDown ? 'text-green-600' : 'text-red-600';
    };

    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-slate-50 rounded-xl"><Icon className="w-6 h-6 text-slate-600" /></div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-slate-800">{value || 0}</span>
          <span className="text-sm text-slate-500 font-medium">{unit}</span>
        </div>
        <div className={`flex items-center gap-1 mt-2 text-sm font-bold ${getStatusColor()}`}>
          {!isZero && <TrendingUp className={`w-4 h-4 ${isDown ? 'rotate-180' : ''}`} />}
          <span>{isZero ? 'คงที่' : `${change > 0 ? '+' : ''}${change} ${unit}`}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-kanit">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
          <Activity className="text-purple-600" /> พัฒนาการผู้รับการฝึก
        </h3>

        {/* ส่วนเลือกคนฝึกและเป้าหมายปัจจุบัน[cite: 1] */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">เลือกผู้รับการฝึก</label>
              <select
                value={selectedTraineeId}
                onChange={(e) => setSelectedTraineeId(e.target.value)}
                className="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 focus:border-purple-500 outline-none bg-slate-50 font-semibold"
              >
                {trainees.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>

            {/* แสดงเป้าหมายปัจจุบันตรงนี้[cite: 1] */}
            <div className="flex-1 bg-purple-50 border border-purple-100 p-4 rounded-2xl relative overflow-hidden">
              <Target className="absolute -right-2 -bottom-2 w-16 h-16 text-purple-200/50" />
              <p className="text-[10px] font-bold text-purple-400 uppercase mb-1">เป้าหมายปัจจุบัน</p>
              <p className="text-lg font-bold text-purple-700 flex items-center gap-2">
                <Award className="w-5 h-5" /> {currentData.traineeGoal}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase mb-1">ข้อมูลล่าสุดเมื่อ</p>
              <p className="text-lg font-bold text-slate-700 flex items-center gap-2"><Clock className="w-5 h-5 text-slate-400"/> 25 พ.ค. 2568</p>
            </div>
          </div>
        </div>

        {/* Health Metrics Cards[cite: 1] */}
        {currentData.metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <HealthMetricCard icon={Activity} label="BMI" value={currentData.metrics.bmi.value} unit="" change={currentData.metrics.bmi.change} />
            <HealthMetricCard icon={Droplet} label="% ไขมัน" value={currentData.metrics.bodyFat.value} unit="%" change={currentData.metrics.bodyFat.change} />
            <HealthMetricCard icon={Scale} label="น้ำหนักตัว" value={currentData.metrics.weight.value} unit="kg" change={currentData.metrics.weight.change} />
            <HealthMetricCard icon={Heart} label="VO2 Max" value={currentData.metrics.vo2Max.value} unit="" change={currentData.metrics.vo2Max.change} />
          </div>
        )}

        {/* กราฟพัฒนาการ[cite: 1] */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
          <h4 className="text-lg font-bold text-slate-800 mb-6">กราฟแสดงพัฒนาการ (เป้าหมาย: {currentData.traineeGoal})</h4>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentData.chart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Legend />
                <Line type="monotone" dataKey="bmi" name="BMI" stroke="#3B82F6" strokeWidth={3} />
                <Line type="monotone" dataKey="bodyFat" name="% ไขมัน" stroke="#10B981" strokeWidth={3} />
                <Line type="monotone" dataKey="weight" name="น้ำหนัก" stroke="#8B5CF6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ประวัติการฝึก[cite: 1] */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-50"><h4 className="font-bold text-slate-800">ประวัติการเข้าฝึก</h4></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 text-slate-400 text-xs font-bold uppercase">
                <tr><th className="px-8 py-4 text-left">วันที่</th><th className="px-8 py-4 text-left">โปรแกรม</th><th className="px-8 py-4 text-left">สรุป</th><th className="px-8 py-4 text-left">สถานะ</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {currentData.history.length > 0 ? currentData.history.map((record, i) => (
                  <tr key={i}>
                    <td className="px-8 py-4 font-bold">{record.date}</td>
                    <td className="px-8 py-4">{record.program}</td>
                    <td className="px-8 py-4">{record.result}</td>
                    <td className="px-8 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        record.color === 'green' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>{record.status}</span>
                    </td>
                  </tr>
                )) : <tr><td colSpan="4" className="px-8 py-10 text-center text-slate-400">ยังไม่มีข้อมูล</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerProgress;