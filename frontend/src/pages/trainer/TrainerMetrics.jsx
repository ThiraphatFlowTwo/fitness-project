import React, { useState } from 'react';
import { Save, Scale, Activity, Heart, Ruler, TrendingDown, TrendingUp, Minus, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // เพิ่มตัวช่วยเปลี่ยนหน้า

const TrainerMetrics = () => {
  const navigate = useNavigate();

  // ข้อมูลสถิติล่าสุด (ในอนาคตควรดึงมาจาก API ตาม traineeId ที่เลือก)
  const [lastRecord] = useState({
    weight: 50,
    bodyFat: 19.5,
    vo2Max: 40,
  });

  const [traineeInfo, setTraineeInfo] = useState({
    traineeId: '',
    date: new Date().toISOString().split('T')[0],
    weight: '',
    bodyFat: '',
    vo2Max: '',
    muscleMass: ''
  });

  // ฟังก์ชันสำหรับบันทึกข้อมูล
  const handleSave = async () => {
    // 1. ตรวจสอบว่าเลือกคนฝึกและใส่ข้อมูลสำคัญหรือยัง
    if (!traineeInfo.traineeId) {
      alert("⚠️ กรุณาเลือกผู้รับการฝึกก่อนบันทึก");
      return;
    }
    if (!traineeInfo.weight) {
      alert("⚠️ กรุณากรอกน้ำหนักปัจจุบัน");
      return;
    }

    try {
      // 2. จำลองการส่งข้อมูลไปที่ Backend (ในอนาคตใช้ axios.post)[cite: 1]
      console.log("กำลังส่งข้อมูลไปที่ระบบ...", traineeInfo);
      
      // ตัวอย่าง API Call:
      // await axios.post('/api/health-metrics', traineeInfo);

      // 3. แจ้งเตือนเมื่อสำเร็จ[cite: 1]
      alert(`✅ บันทึกพัฒนาการสำเร็จ!\nข้อมูลใหม่จะถูกนำไปแสดงบนกราฟแล้วครับ`);
      
      // 4. เปลี่ยนหน้าไปที่หน้าพัฒนาการเพื่อดูผลทันที[cite: 1]
      navigate('/trainer/progress');
      
    } catch (error) {
      alert("❌ เกิดข้อผิดพลาดในการบันทึก กรุณาลองใหม่อีกครั้ง");
    }
  };

  const getDiff = (current, last) => {
    if (!current || !last) return { val: 0, icon: <Minus className="w-3 h-3" />, color: 'text-slate-400' };
    const diff = current - last;
    if (diff > 0) return { val: diff.toFixed(1), icon: <TrendingUp className="w-3 h-3" />, color: 'text-red-500' };
    if (diff < 0) return { val: Math.abs(diff).toFixed(1), icon: <TrendingDown className="w-3 h-3" />, color: 'text-emerald-500' };
    return { val: 0, icon: <Minus className="w-3 h-3" />, color: 'text-slate-400' };
  };

  const weightDiff = getDiff(traineeInfo.weight, lastRecord.weight);

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-kanit">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Scale className="text-blue-600" /> บันทึกการเปลี่ยนแปลงสรีระ
            </h3>
            <p className="text-slate-500 text-sm">ข้อมูลรายเดือนเพื่อใช้เปรียบเทียบและแสดงกราฟพัฒนาการ[cite: 1]</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
             <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">ผู้รับการฝึก</label>
                <select 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={traineeInfo.traineeId}
                  onChange={(e) => setTraineeInfo({...traineeInfo, traineeId: e.target.value})}
                >
                  <option value="">-- เลือกชื่อผู้รับการฝึก --</option>
                  <option value="1">ประภาส สุขใจ</option>
                  <option value="2">สมหญิง ชัยชนะ</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">เดือนที่วัดผล</label>
                <input 
                  type="date" 
                  value={traineeInfo.date}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                  onChange={(e) => setTraineeInfo({...traineeInfo, date: e.target.value})}
                />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weight Input[cite: 1] */}
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Scale className="w-5 h-5" />
                </div>
                {traineeInfo.weight && (
                  <div className={`flex items-center gap-1 text-sm font-bold ${weightDiff.color} bg-white px-3 py-1 rounded-full shadow-sm`}>
                    {weightDiff.icon} {weightDiff.val} kg
                  </div>
                )}
              </div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">น้ำหนักปัจจุบัน (kg)</label>
              <input 
                type="number" step="0.1" placeholder="0.0"
                value={traineeInfo.weight}
                className="w-full bg-transparent text-3xl font-bold text-slate-800 outline-none"
                onChange={(e) => setTraineeInfo({...traineeInfo, weight: e.target.value})}
              />
              <p className="text-[10px] text-slate-400 mt-2 italic">* บันทึกครั้งก่อน: {lastRecord.weight} kg[cite: 1]</p>
            </div>

            {/* Body Fat Input[cite: 1] */}
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Activity className="w-5 h-5" />
                </div>
              </div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Body Fat (%)</label>
              <input 
                type="number" step="0.1" placeholder="0.0"
                value={traineeInfo.bodyFat}
                className="w-full bg-transparent text-3xl font-bold text-slate-800 outline-none"
                onChange={(e) => setTraineeInfo({...traineeInfo, bodyFat: e.target.value})}
              />
              <p className="text-[10px] text-slate-400 mt-2 italic">* บันทึกครั้งก่อน: {lastRecord.bodyFat} %[cite: 1]</p>
            </div>

            {/* VO2 Max Input[cite: 1] */}
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-4">
                <Heart className="w-5 h-5" />
              </div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">VO2 Max</label>
              <input 
                type="number" placeholder="0"
                value={traineeInfo.vo2Max}
                className="w-full bg-transparent text-3xl font-bold text-slate-800 outline-none"
                onChange={(e) => setTraineeInfo({...traineeInfo, vo2Max: e.target.value})}
              />
            </div>

            {/* Muscle Mass Input[cite: 1] */}
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-4">
                <Ruler className="w-5 h-5" />
              </div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">มวลกล้ามเนื้อ (kg)</label>
              <input 
                type="number" step="0.1" placeholder="0.0"
                value={traineeInfo.muscleMass}
                className="w-full bg-transparent text-3xl font-bold text-slate-800 outline-none"
                onChange={(e) => setTraineeInfo({...traineeInfo, muscleMass: e.target.value})}
              />
            </div>
          </div>

          {/* เชื่อมต่อปุ่มบันทึกกับ handleSave[cite: 1] */}
          <button 
            onClick={handleSave}
            className="w-full mt-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3 text-lg"
          >
            <Save className="w-6 h-6" /> บันทึกและเปรียบเทียบผล[cite: 1]
          </button>
        </div>

        <div className="mt-6 flex items-center gap-2 text-slate-400 text-sm justify-center">
          <Check className="w-4 h-4 text-emerald-500" />
          <span>เมื่อบันทึกแล้ว กราฟในหน้า "พัฒนาการ" จะอัปเดตจุดใหม่โดยอัตโนมัติ[cite: 1]</span>
        </div>
      </div>
    </div>
  );
};

export default TrainerMetrics;