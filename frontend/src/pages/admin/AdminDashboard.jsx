import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  Users,
  Calendar,
  Activity,
  BarChart3,
  TrendingUp,
  CheckCircle,
  Server,
  Database,
  Clock,
  Zap,
} from "lucide-react";
import { PageContainer } from "../../components/ui/layout/PageContainer";
import { StatCard } from "../../components/ui/cards/StatCard";
import { SectionCard } from "../../components/ui/cards/SectionCard";
import { QuickAction } from "../../components/ui/cards/QuickAction";
import { InfoCard } from "../../components/ui/cards/InfoCard";
import { StatusItem } from "../../components/ui/cards/StatusItem";

export default function AdminDashboard() {
  const [summary, setSummary] = useState({
    totalUsers: 0,
    totalAcademicYears: 0,
    activeAcademicYear: null,
  });

  const fetchSummary = async () => {
    try {
      const res = await api.get("/dashboard/admin-summary");
      setSummary(res.data);
    } catch (err) {
      console.error("โหลด summary ไม่สำเร็จ", err);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <PageContainer>
      <div className="space-y-8">
        {/* ===== Header ===== */}
        <div className="animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-1 bg-gradient-to-b from-navy-900 to-navy-700 rounded-full"></div>
            <h1 className="text-4xl font-bold text-navy-900">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-gray-600 ml-4 text-lg">ภาพรวมการจัดการระบบ</p>
        </div>

        {/* ===== Stat Cards ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="ผู้ใช้งานทั้งหมด"
            value={summary.totalUsers}
            icon={<Users className="w-5 h-5 text-white" />}
            gradient="from-navy-900 to-navy-800"
          />

          <StatCard
            title="ปีการศึกษาทั้งหมด"
            value={summary.totalAcademicYears}
            icon={<Calendar className="w-5 h-5 text-white" />}
            gradient="from-navy-900 to-navy-800"
          />

          <StatCard
            title="ปีที่เปิดใช้งาน"
            value={summary.activeAcademicYear ? 1 : 0}
            icon={<Activity className="w-5 h-5 text-white" />}
            gradient="from-sky-500 to-sky-600"
          />

          <StatCard
            title="สถานะระบบ"
            value="Online"
            icon={<TrendingUp className="w-5 h-5 text-white" />}
            gradient="from-emerald-500 to-emerald-600"
            showPulse={true}
          />
        </div>

        {/* ===== Main Content Grid ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions - 2 columns */}
          <div className="lg:col-span-2">
            <SectionCard
              icon={<BarChart3 className="w-5 h-5 text-white" />}
              title="การจัดการด่วน"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <QuickAction
                  title="จัดการผู้ใช้"
                  description="เพิ่ม / ลบ / แก้ไขผู้ใช้"
                  icon={<Users className="w-5 h-5" />}
                  link="/admin/users"
                  color="navy"
                />
                <QuickAction
                  title="จัดการปีการศึกษา"
                  description="ตั้งค่าปี / ภาคการศึกษา"
                  icon={<Calendar className="w-5 h-5" />}
                  link="/admin/academic-year"
                  color="navy"
                />
                <QuickAction
                  title="รายงาน"
                  description="ดูสถิติการใช้งาน"
                  icon={<BarChart3 className="w-5 h-5" />}
                  link="#"
                  color="navy"
                />
                <QuickAction
                  title="ตั้งค่าระบบ"
                  description="กำหนดค่าทั่วไป"
                  icon={<Activity className="w-5 h-5" />}
                  link="#"
                  color="navy"
                />
              </div>
            </SectionCard>
          </div>

          {/* System Status - 1 column */}
          <div className="lg:col-span-1">
            <SectionCard
              icon={<Server className="w-5 h-5 text-white" />}
              title="สถานะระบบ"
              borderColor="emerald"
            >
              <ul className="space-y-4">
                <StatusItem
                  icon={<Server className="w-4 h-4 text-navy-700" />}
                  label="Server"
                  status="Online"
                  statusColor="emerald"
                />

                <StatusItem
                  icon={<Database className="w-4 h-4 text-navy-700" />}
                  label="Database"
                  status="Connected"
                  statusColor="emerald"
                />

                <StatusItem
                  icon={<Calendar className="w-4 h-4 text-navy-700" />}
                  label="Active Academic Year"
                  status={
                    summary.activeAcademicYear
                      ? `${summary.activeAcademicYear.academic_year} / ${summary.activeAcademicYear.semester}`
                      : "ไม่มี"
                  }
                  statusColor="navy"
                />

                <StatusItem
                  icon={<Activity className="w-4 h-4 text-navy-700" />}
                  label="System Version"
                  status="v1.0.0"
                  statusColor="navy"
                />
              </ul>

              {/* System Health Indicator */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-medium">
                    System Health
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-emerald-600">
                      Excellent
                    </span>
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>

        {/* ===== Important Information ===== */}
        <SectionCard
          icon={<Clock className="w-5 h-5 text-white" />}
          title="ข้อมูลสำคัญ"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard
              icon={<CheckCircle className="w-5 h-5 text-emerald-600" />}
              title="ระบบพร้อมใช้งาน"
              description="ทุกฟังก์ชันทำงานปกติ"
            />
            <InfoCard
              icon={<Users className="w-5 h-5 text-navy-700" />}
              title="ผู้ใช้งานออนไลน์"
              description="มีผู้ใช้งานในระบบ"
            />
            <InfoCard
              icon={<Zap className="w-5 h-5 text-sky-600" />}
              title="ประสิทธิภาพสูง"
              description="ระบบทำงานได้ดีเยี่ยม"
            />
          </div>
        </SectionCard>
      </div>
    </PageContainer>
  );
}
