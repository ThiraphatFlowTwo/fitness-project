import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  Users,
  Calendar,
  Activity,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Server,
  Database,
  Clock,
} from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ===== Header ===== */}
        <div className="animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-1 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-slate-600 ml-4 text-lg">ภาพรวมการจัดการระบบ</p>
        </div>

        {/* ===== Stat Cards ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatCard
            title="ผู้ใช้งานทั้งหมด"
            value={summary.totalUsers}
            icon={<Users className="w-6 h-6" />}
            gradient="from-blue-500 to-blue-600"
            delay="0"
          />

          <StatCard
            title="ปีการศึกษาทั้งหมด"
            value={summary.totalAcademicYears}
            icon={<Calendar className="w-6 h-6" />}
            gradient="from-emerald-500 to-emerald-600"
            delay="100"
          />

          <StatCard
            title="ปีที่เปิดใช้งาน"
            value={summary.activeAcademicYear ? 1 : 0}
            icon={<Activity className="w-6 h-6" />}
            gradient="from-purple-500 to-purple-600"
            delay="200"
          />

          <StatCard
            title="สถานะระบบ"
            value="Online"
            icon={<TrendingUp className="w-6 h-6" />}
            gradient="from-orange-500 to-orange-600"
            delay="300"
            showPulse={true}
          />
        </div>

        {/* ===== Main Content Grid ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions - 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  การจัดการด่วน
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <QuickAction
                  title="จัดการผู้ใช้"
                  desc="เพิ่ม / ลบ / แก้ไขผู้ใช้"
                  icon={<Users className="w-5 h-5" />}
                  link="/admin/users"
                  color="blue"
                />
                <QuickAction
                  title="จัดการปีการศึกษา"
                  desc="ตั้งค่าปี / ภาคการศึกษา"
                  icon={<Calendar className="w-5 h-5" />}
                  link="/admin/academic-year"
                  color="emerald"
                />
                <QuickAction
                  title="รายงาน"
                  desc="ดูสถิติการใช้งาน"
                  icon={<BarChart3 className="w-5 h-5" />}
                  link="#"
                  color="purple"
                />
                <QuickAction
                  title="ตั้งค่าระบบ"
                  desc="กำหนดค่าทั่วไป"
                  icon={<Activity className="w-5 h-5" />}
                  link="#"
                  color="orange"
                />
              </div>
            </div>
          </div>

          {/* System Status - 1 column */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl p-6 text-white border border-slate-700/50 relative overflow-hidden">
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <Server className="w-6 h-6 text-blue-400" />
                  <h2 className="text-2xl font-bold">สถานะระบบ</h2>
                </div>

                <ul className="space-y-4">
                  <StatusItem
                    icon={<Server className="w-4 h-4" />}
                    label="Server"
                    status="Online"
                    statusColor="text-emerald-400"
                  />

                  <StatusItem
                    icon={<Database className="w-4 h-4" />}
                    label="Database"
                    status="Connected"
                    statusColor="text-emerald-400"
                  />

                  <StatusItem
                    icon={<Calendar className="w-4 h-4" />}
                    label="Active Academic Year"
                    status={
                      summary.activeAcademicYear
                        ? `${summary.activeAcademicYear.academic_year} / ${summary.activeAcademicYear.semester}`
                        : "ไม่มี"
                    }
                    statusColor="text-blue-400"
                  />

                  <StatusItem
                    icon={<Activity className="w-4 h-4" />}
                    label="System Version"
                    status="v1.0.0"
                    statusColor="text-slate-400"
                  />
                </ul>

                {/* System Health Indicator */}
                <div className="mt-6 pt-4 border-t border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">
                      System Health
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-emerald-400">
                        Excellent
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Activity Timeline (Optional Enhancement) ===== */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-slate-600" />
              <h2 className="text-2xl font-bold text-slate-800">ข้อมูลสำคัญ</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoCard
              icon={<CheckCircle className="w-5 h-5 text-emerald-500" />}
              title="ระบบพร้อมใช้งาน"
              description="ทุกฟังก์ชันทำงานปกติ"
            />
            <InfoCard
              icon={<Users className="w-5 h-5 text-blue-500" />}
              title="ผู้ใช้งานออนไลน์"
              description="มีผู้ใช้งานในระบบ"
            />
            <InfoCard
              icon={<Activity className="w-5 h-5 text-purple-500" />}
              title="ประสิทธิภาพสูง"
              description="ระบบทำงานได้ดีเยี่ยม"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Components ===== */

function StatCard({ title, value, icon, gradient, delay, showPulse }) {
  return (
    <div
      className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-white/20 transform hover:-translate-y-1"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-4">
        <div
          className={`bg-gradient-to-br ${gradient} text-white p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300 relative`}
        >
          {icon}
          {showPulse && (
            <div className="absolute inset-0 rounded-xl bg-white/30 animate-ping"></div>
          )}
        </div>
        <div className="flex-1">
          <p className="text-slate-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ title, desc, link, icon, color }) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    emerald:
      "from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700",
    purple:
      "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
    orange:
      "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
  };

  return (
    <a
      href={link}
      className="group relative bg-gradient-to-br from-slate-50 to-white rounded-xl p-5 border-2 border-slate-200 hover:border-slate-300 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl overflow-hidden"
    >
      {/* Background gradient effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
      ></div>

      <div className="relative z-10">
        <div
          className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${colorClasses[color]} text-white mb-3 group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
        <h3 className="font-bold text-slate-800 text-lg mb-1">{title}</h3>
        <p className="text-sm text-slate-600">{desc}</p>
      </div>
    </a>
  );
}

function StatusItem({ icon, label, status, statusColor }) {
  return (
    <li className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
      <div className="flex items-center gap-2">
        <span className="text-slate-400">{icon}</span>
        <span className="text-slate-300 text-sm">{label}</span>
      </div>
      <span className={`font-semibold text-sm ${statusColor}`}>{status}</span>
    </li>
  );
}

function InfoCard({ icon, title, description }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 hover:shadow-md transition-shadow duration-300">
      <div className="mt-1">{icon}</div>
      <div>
        <h3 className="font-semibold text-slate-800 mb-1">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </div>
  );
}