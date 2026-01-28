import { useEffect, useState } from "react";
import api from "../../services/api";
import { Users, Calendar, Activity, BarChart3 } from "lucide-react";

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
    <div className="p-8 space-y-8">
      {/* ===== Header ===== */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500">ภาพรวมการจัดการระบบ</p>
      </div>

      {/* ===== Stat Cards ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="ผู้ใช้งานทั้งหมด"
          value={summary.totalUsers}
          icon={<Users />}
          color="bg-blue-500"
        />

        <StatCard
          title="ปีการศึกษาทั้งหมด"
          value={summary.totalAcademicYears}
          icon={<Calendar />}
          color="bg-green-500"
        />

        <StatCard
          title="ปีที่เปิดใช้งาน"
          value={summary.activeAcademicYear ? 1 : 0}
          icon={<Activity />}
          color="bg-emerald-500"
        />

        <StatCard
          title="สถานะระบบ"
          value="Online"
          icon={<BarChart3 />}
          color="bg-purple-500"
        />
      </div>

      {/* ===== Quick Actions + System Status ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">การจัดการด่วน</h2>
          <div className="grid grid-cols-2 gap-4">
            <QuickAction
              title="จัดการผู้ใช้"
              desc="เพิ่ม / ลบ / แก้ไขผู้ใช้"
              link="/admin/users"
            />
            <QuickAction
              title="จัดการปีการศึกษา"
              desc="ตั้งค่าปี / ภาคการศึกษา"
              link="/admin/academic-year"
            />
            <QuickAction title="รายงาน" desc="ดูสถิติการใช้งาน" link="#" />
            <QuickAction title="ตั้งค่าระบบ" desc="กำหนดค่าทั่วไป" link="#" />
          </div>
        </div>

        {/* Right */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl shadow p-6 text-white">
          <h2 className="text-xl font-semibold mb-4">สถานะระบบ</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between">
              <span>Server</span>
              <span className="text-green-400">Online</span>
            </li>

            <li className="flex justify-between">
              <span>Database</span>
              <span className="text-green-400">Connected</span>
            </li>

            <li className="flex justify-between">
              <span>Active Academic Year</span>
              <span className="text-emerald-400">
                {summary.activeAcademicYear
                  ? `${summary.activeAcademicYear.academic_year} / ${summary.activeAcademicYear.semester}`
                  : "ไม่มี"}
              </span>
            </li>

            <li className="flex justify-between">
              <span>System Version</span>
              <span>v1.0.0</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ===== Components ===== */

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
      <div className={`${color} text-white p-3 rounded-lg`}>{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function QuickAction({ title, desc, link }) {
  return (
    <a
      href={link}
      className="border rounded-lg p-4 hover:shadow transition block"
    >
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </a>
  );
}
