import React, { useState } from 'react';
import { TrendingUp, Heart, Activity, Scale, Droplet } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TrainerProgress = () => {
  // =====================================================
  // STATE MANAGEMENT
  // =====================================================

  const [trainees] = useState([
    { id: 1, name: 'สมหญิง ชัยชนะ' },
    { id: 2, name: 'ประภาส สุขใจ' },
    { id: 3, name: 'วิชัย กล้าหาญ' }
  ]);

  const [selectedTraineeId, setSelectedTraineeId] = useState('1');

  const [healthData] = useState({
    bmi: { value: 22.5, change: -0.5, status: 'down' },
    bodyFat: { value: 18.2, change: -1.2, status: 'down' },
    weight: { value: 45, change: -2, status: 'down' },
    vo2Max: { value: 42, change: 3, status: 'up' }
  });

  const [progressHistory] = useState([
    {
      date: '25 ม.ค. 2568',
      program: 'โปรแกรมเพิ่มมวลกล้ามเนื้อ',
      result: 'ฝึกครบ 3 เซต มีความพร้อมดีมาก',
      status: 'ดีเยี่ยม',
      statusColor: 'green'
    },
    {
      date: '23 ม.ค. 2568',
      program: 'โปรแกรมเพิ่มมวลกล้ามเนื้อ',
      result: 'ฝึกครบตามโปรแกรม',
      status: 'ดี',
      statusColor: 'blue'
    },
    {
      date: '20 ม.ค. 2568',
      program: 'โปรแกรมเพิ่มมวลกล้ามเนื้อ',
      result: 'รู้สึกเหนื่อยเล็กน้อย แต่ฝึกครบ',
      status: 'ปานกลาง',
      statusColor: 'yellow'
    }
  ]);

  // Chart data
  const [chartData] = useState([
    { month: 'ม.ค.', bmi: 23.5, bodyFat: 20.5, weight: 48, vo2Max: 38 },
    { month: 'ก.พ.', bmi: 23.2, bodyFat: 20.0, weight: 47, vo2Max: 39 },
    { month: 'มี.ค.', bmi: 22.8, bodyFat: 19.5, weight: 46, vo2Max: 40 },
    { month: 'เม.ย.', bmi: 22.5, bodyFat: 19.0, weight: 45.5, vo2Max: 41 },
    { month: 'พ.ค.', bmi: 22.5, bodyFat: 18.2, weight: 45, vo2Max: 42 }
  ]);

  // =====================================================
  // COMPONENTS
  // =====================================================

  const HealthMetricCard = ({ icon: Icon, label, value, unit, change, status }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${
          label === 'BMI' ? 'bg-blue-50' :
          label === '% ไขมัน' ? 'bg-green-50' :
          label === 'ของคล้ำเนื้อ' ? 'bg-purple-50' :
          'bg-pink-50'
        }`}>
          <Icon className={`w-6 h-6 ${
            label === 'BMI' ? 'text-blue-600' :
            label === '% ไขมัน' ? 'text-green-600' :
            label === 'ของคล้ำเนื้อ' ? 'text-purple-600' :
            'text-pink-600'
          }`} />
        </div>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <div className="space-y-1">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-gray-800">{value}</span>
          {unit && <span className="text-lg text-gray-500">{unit}</span>}
        </div>
        <div className={`flex items-center space-x-1 text-sm ${
          status === 'down' ? 'text-green-600' : 'text-red-600'
        }`}>
          <TrendingUp className={`w-4 h-4 ${status === 'down' ? 'rotate-180' : ''}`} />
          <span>{status === 'down' ? '' : '+'}{change} {unit}</span>
        </div>
      </div>
    </div>
  );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* Content */}
      <div className="p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">พัฒนาการผู้รับการฝึก</h3>

        {/* Select Trainee */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            เลือกผู้รับการฝึก
          </label>
          <select
            value={selectedTraineeId}
            onChange={(e) => setSelectedTraineeId(e.target.value)}
            className="w-full md:w-1/3 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 bg-white"
          >
            {trainees.map(trainee => (
              <option key={trainee.id} value={trainee.id}>
                {trainee.name}
              </option>
            ))}
          </select>
        </div>

        {/* Health Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <HealthMetricCard
            icon={Activity}
            label="BMI"
            value={healthData.bmi.value}
            unit=""
            change={healthData.bmi.change}
            status={healthData.bmi.status}
          />
          <HealthMetricCard
            icon={Droplet}
            label="% ไขมัน"
            value={healthData.bodyFat.value}
            unit="%"
            change={healthData.bodyFat.change}
            status={healthData.bodyFat.status}
          />
          <HealthMetricCard
            icon={Scale}
            label="ของคล้ำเนื้อ"
            value={healthData.weight.value}
            unit="kg"
            change={healthData.weight.change}
            status={healthData.weight.status}
          />
          <HealthMetricCard
            icon={Heart}
            label="VO2 Max"
            value={healthData.vo2Max.value}
            unit=""
            change={healthData.vo2Max.change}
            status={healthData.vo2Max.status}
          />
        </div>

        {/* Chart Area */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
          <h4 className="text-lg font-bold text-gray-800 mb-6">กราฟแสดงพัฒนาการ</h4>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="bmi" 
                stroke="#3B82F6" 
                name="BMI" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="bodyFat" 
                stroke="#10B981" 
                name="% ไขมัน" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#8B5CF6" 
                name="น้ำหนัก (kg)" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="vo2Max" 
                stroke="#EC4899" 
                name="VO2 Max" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Progress History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h4 className="text-lg font-bold text-gray-800">ประวัติการฝึก</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">วันที่</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">โปรแกรม</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ผลการฝึก</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ระดับ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {progressHistory.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800">{record.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{record.program}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{record.result}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        record.statusColor === 'green' ? 'bg-green-100 text-green-700' :
                        record.statusColor === 'blue' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerProgress;