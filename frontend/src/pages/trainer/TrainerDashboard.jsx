import { User, Mail, Award, Activity, TrendingUp, Calendar, Dumbbell, Plus } from "lucide-react";

export default function TrainerDashboard() {
  return (
    <div className="min-h-screen bg-steel-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b-4 border-sky-500 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-navy-700 to-sky-600 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold bg-gradient-to-r from-navy-600 to-sky-600 bg-clip-text text-transparent">
              ระบบจัดการเทรนเนอร์
            </span>
            <span className="text-xs text-steel-500">
              วิทยาลัยการกีฬา มหาวิทยาลัยราชภัฏเลย
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-steel-700">นายสมชาย ใจดี</span>
          <div className="w-10 h-10 bg-gradient-to-br from-navy-700 to-sky-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
            ส
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center py-12 px-4 gap-8">
        {/* Welcome Section */}
        <div className="text-center max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-navy-600 to-sky-600 bg-clip-text text-transparent mb-3">
            ยินดีต้อนรับ!
          </h1>
          <p className="text-steel-600 text-lg">
            จัดการข้อมูลเทรนเนอร์และผู้รับการฝึกของคุณได้ที่นี่
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl w-full max-w-md overflow-hidden border-2 border-navy-200/50">
          {/* Card Header */}
          <div className="h-2 w-full bg-gradient-to-r from-navy-700 to-sky-600"></div>

          <div className="px-8 py-8">
            {/* Avatar */}
            <div className="flex justify-center mb-5">
              <div className="w-24 h-24 bg-gradient-to-br from-navy-700 to-sky-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                <User className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Name */}
            <h2 className="text-2xl font-extrabold text-center text-steel-800 mb-1">
              นายสมชาย ใจดี
            </h2>
            <p className="text-center text-steel-500 mb-6">นักศึกษา / Trainer</p>

            {/* Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-navy-50 to-sky-50 rounded-xl border-2 border-navy-200/30">
                <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-navy-600" />
                </div>
                <div>
                  <p className="text-xs text-steel-500">รหัสประจำตัว</p>
                  <p className="font-semibold text-steel-800">SB66XXXXXX</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-sky-50 to-navy-50 rounded-xl">
                <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <p className="text-xs text-steel-500">อีเมล</p>
                  <p className="font-semibold text-steel-800">sb66xxxxxx@lru.ac.th</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-gradient-to-br from-navy-50 to-navy-100 rounded-xl p-3 text-center border-2 border-navy-200/30">
                <p className="text-2xl font-bold bg-gradient-to-r from-navy-600 to-sky-600 bg-clip-text text-transparent">5</p>
                <p className="text-xs text-steel-500">ผู้รับการฝึก</p>
              </div>
              <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl p-3 text-center border-2 border-sky-200/30">
                <p className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-sky-500 bg-clip-text text-transparent">3</p>
                <p className="text-xs text-steel-500">โปรแกรม</p>
              </div>
              <div className="bg-gradient-to-br from-navy-50 to-sky-50 rounded-xl p-3 text-center border-2 border-navy-200/30">
                <p className="text-2xl font-bold bg-gradient-to-r from-navy-600 to-sky-600 bg-clip-text text-transparent">85%</p>
                <p className="text-xs text-steel-500">ความคืบหน้า</p>
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full bg-gradient-to-r from-navy-700 to-sky-600 hover:from-navy-800 hover:to-sky-700 text-white px-8 py-3 rounded-xl text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2">
              <User className="w-5 h-5" />
              <Plus className="w-4 h-4" />
              เพิ่มลูกเทรน
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-5 border-2 border-navy-200/50 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-navy-500 to-navy-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold bg-gradient-to-r from-navy-600 to-navy-500 bg-clip-text text-transparent">12</p>
            <p className="text-sm text-steel-500">ท่าออกกำลังกาย</p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-5 border-2 border-navy-200/50 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-sky-500 bg-clip-text text-transparent">4</p>
            <p className="text-sm text-steel-500">เครดิตที่ได้</p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-5 border-2 border-navy-200/50 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-navy-600 to-sky-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold bg-gradient-to-r from-navy-600 to-sky-600 bg-clip-text text-transparent">2567</p>
            <p className="text-sm text-steel-500">ปีการศึกษา</p>
          </div>
        </div>
      </main>
    </div>
  );
}

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

