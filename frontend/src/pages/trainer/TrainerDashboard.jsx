import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, ClipboardList, Clock, CheckCircle,
  History, Bolt, UserPlus, PlusCircle, Edit,
  Dumbbell, Loader2, AlertCircle
} from 'lucide-react';
import { PageContainer } from "../../components/ui/layout/PageContainer";
import { StatCard }       from "../../components/ui/cards/StatCard";
import { SectionCard }    from "../../components/ui/cards/SectionCard";

const API      = "http://localhost:5000/api/dashboard/trainer";
const getToken    = () => localStorage.getItem("token");
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization:  `Bearer ${getToken()}`,
});

const TrainerDashboard = () => {
  const navigate = useNavigate();

  const [stats,    setStats]    = useState({ totalTrainees: 0, totalPrograms: 0, pendingApproval: 0, todayLogs: 0 });
  const [logs,     setLogs]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res  = await fetch(API, { headers: authHeaders() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setStats(data.stats);
        setLogs(data.recentLogs || []);
      } catch (err) {
        setError(err.message || 'โหลดข้อมูลไม่สำเร็จ');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const QuickActionButton = ({ icon: Icon, label, onClick, gradient }) => (
    <button
      onClick={onClick}
      className={`bg-gradient-to-r ${gradient} text-white p-3 md:p-4 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 flex flex-col items-center space-y-1.5`}
    >
      <Icon className="w-5 h-5 md:w-6 md:h-6" />
      <span className="text-xs md:text-sm font-semibold leading-tight text-center">{label}</span>
    </button>
  );

  if (loading) return (
    <PageContainer>
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-2 text-gray-600">กำลังโหลดข้อมูล...</span>
      </div>
    </PageContainer>
  );

  return (
    <PageContainer>
      <div className="space-y-4 md:space-y-8">

        {/* Header */}
        <div>
          <h2 className="text-lg md:text-2xl font-bold text-navy-900">แดชบอร์ดเทรนเนอร์</h2>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 mr-2 shrink-0" />{error}
          </div>
        )}

        {/* Stats — 2 คอลัมน์บนมือถือ, 4 บน desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          <StatCard
            title="ผู้รับการฝึกทั้งหมด"
            value={stats.totalTrainees}
            icon={<Users className="w-5 h-5 md:w-6 md:h-6" />}
            gradient="from-navy-900 to-navy-700"
          />
          <StatCard
            title="โปรแกรมการฝึก"
            value={stats.totalPrograms}
            icon={<ClipboardList className="w-5 h-5 md:w-6 md:h-6" />}
            gradient="from-navy-800 to-navy-600"
          />
          <StatCard
            title="รออนุมัติ"
            value={stats.pendingApproval}
            icon={<Clock className="w-5 h-5 md:w-6 md:h-6" />}
            gradient="from-sky-500 to-sky-600"
          />
          <StatCard
            title="บันทึกผลวันนี้"
            value={stats.todayLogs}
            icon={<CheckCircle className="w-5 h-5 md:w-6 md:h-6" />}
            gradient="from-emerald-500 to-emerald-600"
          />
        </div>

        {/* Activities + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">

          {/* กิจกรรมล่าสุด */}
          <SectionCard
            icon={<History className="w-4 h-4 md:w-5 md:h-5 text-white" />}
            title="กิจกรรมล่าสุด"
            borderColor="navy"
          >
            {logs.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">ยังไม่มีกิจกรรม</p>
            ) : (
              <div className="space-y-3">
                {logs.map(log => (
                  <div key={log._id} className="flex items-start gap-2.5 pb-3 border-b last:border-b-0 border-gray-200">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                      <Edit className="text-purple-600 w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm font-semibold text-gray-800">บันทึกผลการฝึก</p>
                      <p className="text-xs text-gray-500 truncate">
                        {log.trainee_id?.name || '-'} — {log.program_id?.program_name || '-'}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(log.training_date).toLocaleDateString('th-TH', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* การดำเนินการด่วน */}
          <SectionCard
            icon={<Bolt className="w-4 h-4 md:w-5 md:h-5 text-white" />}
            title="การดำเนินการด่วน"
            borderColor="navy"
          >
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <QuickActionButton
                icon={UserPlus}   label="เพิ่มผู้รับการฝึก"
                gradient="from-navy-900 to-navy-700"
                onClick={() => navigate('/trainer/trainees')}
              />
              <QuickActionButton
                icon={PlusCircle} label="สร้างโปรแกรมฝึก"
                gradient="from-navy-800 to-navy-600"
                onClick={() => navigate('/trainer/programs')}
              />
              <QuickActionButton
                icon={Dumbbell}   label="เพิ่มท่าการฝึก"
                gradient="from-sky-500 to-sky-600"
                onClick={() => navigate('/trainer/exercises')}
              />
              <QuickActionButton
                icon={Edit}       label="บันทึกผลการฝึก"
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