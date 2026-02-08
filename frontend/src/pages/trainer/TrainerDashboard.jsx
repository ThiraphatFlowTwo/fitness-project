import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ClipboardList, Clock, CheckCircle, History, Bolt, UserPlus, PlusCircle, Edit, Dumbbell } from 'lucide-react';

const TrainerDashboard = () => {
  const navigate = useNavigate();
  
  const [stats] = useState({
    totalTrainees: 12,
    totalPrograms: 8,
    pendingApproval: 3,
    todayResults: 5
  });

  const [recentActivities] = useState([
    {
      id: 1,
      type: 'approval',
      title: 'อนุมัติโปรแกรมการฝึก',
      description: 'โปรแกรมเพิ่มความแข็งแรงสำหรับ สมหญิง ชัยชนะ',
      time: '2 ชั่วโมงที่แล้ว',
      icon: CheckCircle,
      color: 'green'
    },
    {
      id: 2,
      type: 'trainee',
      title: 'เพิ่มผู้รับการฝึกใหม่',
      description: 'ประภาส สุขใจ - อายุ 22 ปี',
      time: '5 ชั่วโมงที่แล้ว',
      icon: UserPlus,
      color: 'blue'
    },
    {
      id: 3,
      type: 'result',
      title: 'บันทึกผลการฝึก',
      description: 'บันทึกผลการฝึก 3 รายการ',
      time: 'เมื่อวานนี้',
      icon: Edit,
      color: 'purple'
    }
  ]);

  const StatCard = ({ title, value, icon: Icon, color, borderColor }) => (
    <div className={`bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 ${borderColor}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`w-14 h-14 bg-${color}-100 rounded-full flex items-center justify-center`}>
          <Icon className={`text-${color}-500 w-7 h-7`} />
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => {
    const Icon = activity.icon;
    return (
      <div className="flex items-start space-x-3 pb-4 border-b last:border-b-0">
        <div className={`w-10 h-10 bg-${activity.color}-100 rounded-full flex items-center justify-center flex-shrink-0`}>
          <Icon className={`text-${activity.color}-600 w-5 h-5`} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800">{activity.title}</p>
          <p className="text-xs text-gray-500">{activity.description}</p>
          <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
        </div>
      </div>
    );
  };

  const QuickActionButton = ({ icon: Icon, label, onClick, gradient }) => (
    <button
      onClick={onClick}
      className={`bg-gradient-to-r ${gradient} text-white p-4 rounded-lg hover:shadow-lg transition-all flex flex-col items-center space-y-2`}
    >
      <Icon className="w-6 h-6" />
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="ผู้รับการฝึกทั้งหมด"
          value={stats.totalTrainees}
          icon={Users}
          color="blue"
          borderColor="border-blue-500"
        />
        <StatCard
          title="โปรแกรมการฝึก"
          value={stats.totalPrograms}
          icon={ClipboardList}
          color="green"
          borderColor="border-green-500"
        />
        <StatCard
          title="รออนุมัติ"
          value={stats.pendingApproval}
          icon={Clock}
          color="yellow"
          borderColor="border-yellow-500"
        />
        <StatCard
          title="บันทึกผลวันนี้"
          value={stats.todayResults}
          icon={CheckCircle}
          color="purple"
          borderColor="border-purple-500"
        />
      </div>

      {/* Recent Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <History className="text-purple-600 mr-2 w-5 h-5" />
            กิจกรรมล่าสุด
          </h3>
          <div className="space-y-4">
            {recentActivities.map(activity => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Bolt className="text-purple-600 mr-2 w-5 h-5" />
            การดำเนินการด่วน
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <QuickActionButton
              icon={UserPlus}
              label="เพิ่มผู้รับการฝึก"
              gradient="from-blue-500 to-blue-600"
              onClick={() => navigate('/trainer/trainees')}
            />
            <QuickActionButton
              icon={PlusCircle}
              label="สร้างโปรแกรมฝึก"
              gradient="from-green-500 to-green-600"
              onClick={() => navigate('/trainer/programs')}
            />
            <QuickActionButton
              icon={Dumbbell}
              label="เพิ่มท่าการฝึก"
              gradient="from-purple-500 to-purple-600"
              onClick={() => navigate('/trainer/exercises')}
            />
            <QuickActionButton
              icon={Edit}
              label="บันทึกผลการฝึก"
              gradient="from-orange-500 to-orange-600"
              onClick={() => navigate('/trainer/results')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;