import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  ClipboardList,
  Clock,
  CheckCircle,
  History,
  Bolt,
  UserPlus,
  PlusCircle,
  Edit,
  Dumbbell
} from 'lucide-react';
import { PageContainer } from "../../components/ui/layout/PageContainer";
import { StatCard } from "../../components/ui/cards/StatCard";
import { SectionCard } from "../../components/ui/cards/SectionCard";
import { ActivityItem } from "../../components/ui/cards/ActivityItem";

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

  const QuickActionButton = ({ icon: Icon, label, onClick, gradient }) => (
    <button
      onClick={onClick}
      className={`bg-gradient-to-r ${gradient} text-white p-4 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 flex flex-col items-center space-y-2`}
    >
      <Icon className="w-6 h-6" />
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );

  return (
    <PageContainer>
      <div className="space-y-8">
        {/* ===== Header ===== */}
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold text-navy-900">แดชบอร์ดเทรนเนอร์</h2>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="ผู้รับการฝึกทั้งหมด"
            value={stats.totalTrainees}
            icon={<Users className="w-6 h-6" />}
            gradient="from-navy-900 to-navy-700"
          />
          <StatCard
            title="โปรแกรมการฝึก"
            value={stats.totalPrograms}
            icon={<ClipboardList className="w-6 h-6" />}
            gradient="from-navy-800 to-navy-600"
          />
          <StatCard
            title="รออนุมัติ"
            value={stats.pendingApproval}
            icon={<Clock className="w-6 h-6" />}
            gradient="from-sky-500 to-sky-600"
          />
          <StatCard
            title="บันทึกผลวันนี้"
            value={stats.todayResults}
            icon={<CheckCircle className="w-6 h-6" />}
            gradient="from-emerald-500 to-emerald-600"
          />
        </div>

        {/* Recent Activities & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard
            icon={<History className="w-5 h-5 text-white" />}
            title="กิจกรรมล่าสุด"
            borderColor="navy"
          >
            <div className="space-y-4">
              {recentActivities.map(activity => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-b-0 border-gray-200">
                    <div className="w-10 h-10 bg-navy-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="text-navy-900 w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-navy-900">{activity.title}</p>
                      <p className="text-xs text-steel-700">{activity.description}</p>
                      <p className="text-xs text-steel-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard
            icon={<Bolt className="w-5 h-5 text-white" />}
            title="การดำเนินการด่วน"
            borderColor="navy"
          >
            <div className="grid grid-cols-2 gap-4">
              <QuickActionButton
                icon={UserPlus}
                label="เพิ่มผู้รับการฝึก"
                gradient="from-navy-900 to-navy-700"
                onClick={() => navigate('/trainer/trainees')}
              />
              <QuickActionButton
                icon={PlusCircle}
                label="สร้างโปรแกรมฝึก"
                gradient="from-navy-800 to-navy-600"
                onClick={() => navigate('/trainer/programs')}
              />
              <QuickActionButton
                icon={Dumbbell}
                label="เพิ่มท่าการฝึก"
                gradient="from-sky-500 to-sky-600"
                onClick={() => navigate('/trainer/exercises')}
              />
              <QuickActionButton
                icon={Edit}
                label="บันทึกผลการฝึก"
                gradient="from-emerald-500 to-emerald-600"
                onClick={() => navigate('/trainer/results')}
              />
            </div>
          </SectionCard>
        </div>
      </div>
    </PageContainer>
  );
};

export default TrainerDashboard;
