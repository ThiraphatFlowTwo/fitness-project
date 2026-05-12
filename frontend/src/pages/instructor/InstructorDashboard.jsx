import { useState, useEffect } from "react";
import { useNavigate }         from "react-router-dom";
import { Users, FileText, Clock, TrendingUp, Loader2, AlertCircle, CheckCircle, Send } from "lucide-react";
import { PageContainer } from "../../components/ui/layout/PageContainer";
import { StatCard }      from "../../components/ui/cards/StatCard";
import { SectionCard }   from "../../components/ui/cards/SectionCard";
import { QuickAction }   from "../../components/ui/cards/QuickAction";

const API         = "http://localhost:5000/api/dashboard/instructor";
const getToken    = () => localStorage.getItem("token");
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization:  `Bearer ${getToken()}`,
});

export default function InstructorDashboard() {
  const navigate = useNavigate();

  const [stats,           setStats]           = useState({
    totalTrainers: 0, totalPrograms: 0, pendingPrograms: 0, activeYear: null
  });
  const [recentPrograms,  setRecentPrograms]  = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState('');

  // ── โหลดข้อมูล ────────────────────────────────────────────────
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res  = await fetch(API, { headers: authHeaders() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setStats(data.stats);
        setRecentPrograms(data.recentPrograms || []);
      } catch (err) {
        setError(err.message || 'โหลดข้อมูลไม่สำเร็จ');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return (
    <PageContainer>
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">กำลังโหลดข้อมูล...</span>
      </div>
    </PageContainer>
  );

  return (
    <PageContainer>
      <div className="space-y-8">

        {/* Header */}
        <div className="animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-1 bg-gradient-to-b from-navy-900 to-navy-700 rounded-full" />
            <h1 className="text-4xl font-bold text-navy-900">แดชบอร์ดอาจารย์</h1>
          </div>
          <p className="text-steel-500 ml-4 text-lg">ภาพรวมการจัดการผู้รับการฝึกและโปรแกรม</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 mr-2" />{error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatCard
            title="เทรนเนอร์ทั้งหมด"
            value={stats.totalTrainers}
            icon={<Users className="w-6 h-6" />}
            gradient="from-navy-900 to-navy-700"
          />
          <StatCard
            title="โปรแกรมฝึกทั้งหมด"
            value={stats.totalPrograms}
            icon={<FileText className="w-6 h-6" />}
            gradient="from-sky-500 to-sky-600"
          />
          <StatCard
            title="รออนุมัติ"
            value={stats.pendingPrograms}
            icon={<Clock className="w-6 h-6" />}
            gradient="from-navy-800 to-sky-500"
          />
          <StatCard
            title="ปีการศึกษา"
            value={stats.activeYear
              ? `${stats.activeYear.academic_year}/${stats.activeYear.semester}`
              : '-'
            }
            icon={<TrendingUp className="w-6 h-6" />}
            gradient="from-emerald-500 to-emerald-600"
          />
        </div>

        {/* Quick Actions */}
        <SectionCard
          icon={<TrendingUp className="w-5 h-5 text-white" />}
          title="การจัดการด่วน"
          borderColor="navy"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickAction
              title="ดูเทรนเนอร์"
              description="รายชื่อเทรนเนอร์ทั้งหมด"
              icon={<Users className="w-5 h-5" />}
              link="/instructor/trainees"
              color="navy"
            />
            <QuickAction
              title="จัดการโปรแกรม"
              description="อนุมัติ/ปฏิเสธโปรแกรม"
              icon={<FileText className="w-5 h-5" />}
              link="/instructor/programs"
              color="sky"
            />
            <QuickAction
              title="รออนุมัติ"
              description={`${stats.pendingPrograms} โปรแกรมรอดำเนินการ`}
              icon={<Clock className="w-5 h-5" />}
              link="/instructor/programs"
              color="navy"
            />
            <QuickAction
              title="โปรไฟล์"
              description="แก้ไขข้อมูลส่วนตัว"
              icon={<TrendingUp className="w-5 h-5" />}
              link="/instructor/profile"
              color="sky"
            />
          </div>
        </SectionCard>

        {/* โปรแกรมที่รออนุมัติล่าสุด */}
        <SectionCard
          title="โปรแกรมที่รออนุมัติล่าสุด"
          borderColor="navy"
        >
          {recentPrograms.length === 0 ? (
            <div className="py-8 text-center text-gray-400">
              <CheckCircle className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">ไม่มีโปรแกรมที่รออนุมัติ</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPrograms.map(p => (
                <div key={p._id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-yellow-100 rounded-xl flex items-center justify-center shrink-0">
                      <Send className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{p.program_name}</p>
                      <p className="text-xs text-slate-400">
                        เทรนเนอร์: {p.trainer_id?.name || '-'} →
                        ลูกเทรน: {p.trainee_id?.name || '-'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-slate-400">
                      {new Date(p.createdAt).toLocaleDateString('th-TH', {
                        day: 'numeric', month: 'short'
                      })}
                    </span>
                    <button
                      onClick={() => navigate('/instructor/programs')}
                      className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-colors">
                      ตรวจสอบ
                    </button>
                  </div>
                </div>
              ))}

              {stats.pendingPrograms > 5 && (
                <button
                  onClick={() => navigate('/instructor/programs')}
                  className="w-full text-sm text-blue-600 hover:text-blue-800 py-2 font-medium transition-colors">
                  ดูทั้งหมด ({stats.pendingPrograms} รายการ) →
                </button>
              )}
            </div>
          )}
        </SectionCard>

      </div>
    </PageContainer>
  );
}