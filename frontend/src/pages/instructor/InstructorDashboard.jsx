import { Users, FileText, Clock, TrendingUp } from "lucide-react";

export default function InstructorDashboard() {
  return (
    <div className="min-h-screen bg-steel-50 p-4 sm:p-6 lg:p-8 font-kanit">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ===== Header ===== */}
        <div className="animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-1 bg-gradient-to-b from-navy-700 to-sky-600 rounded-full"></div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-navy-600 to-sky-600 bg-clip-text text-transparent">
              แดชบอร์ดอาจารย์
            </h1>
          </div>
          <p className="text-steel-600 ml-4 text-lg">ภาพรวมการจัดการผู้รับการฝึกและโปรแกรม</p>
        </div>

        {/* ===== Stat Cards ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatCard
            title="เทรนเนอร์ทั้งหมด"
            value="24"
            icon={<Users className="w-6 h-6" />}
            gradient="from-navy-500 to-navy-600"
          />

          <StatCard
            title="โปรแกรมฝึก"
            value="6"
            icon={<FileText className="w-6 h-6" />}
            gradient="from-sky-500 to-sky-600"
          />

          <StatCard
            title="รอประเมินผล"
            value="3"
            icon={<Clock className="w-6 h-6" />}
            gradient="from-navy-600 to-sky-500"
          />

          <StatCard
            title="ความคืบหน้า"
            value="85%"
            icon={<TrendingUp className="w-6 h-6" />}
            gradient="from-sky-400 to-navy-500"
          />
        </div>

        {/* ===== Quick Actions ===== */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-2 border-navy-200/50">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 bg-gradient-to-br from-navy-700 to-sky-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-navy-600 to-sky-600 bg-clip-text text-transparent">
              การจัดการด่วน
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickAction
              title="ดูผู้รับการฝึก"
              desc="จัดการข้อมูลผู้รับการฝึก"
              icon={<Users className="w-5 h-5" />}
              link="/instructor/trainees"
              color="navy"
            />
            <QuickAction
              title="จัดการโปรแกรม"
              desc="สร้างและแก้ไขโปรแกรม"
              icon={<FileText className="w-5 h-5" />}
              link="/instructor/programs"
              color="sky"
            />
            <QuickAction
              title="ประเมินผล"
              desc="ประเมินผลการฝึก"
              icon={<Clock className="w-5 h-5" />}
              link="/instructor/trainees"
              color="navy"
            />
            <QuickAction
              title="โปรไฟล์"
              desc="แก้ไขข้อมูลส่วนตัว"
              icon={<TrendingUp className="w-5 h-5" />}
              link="/instructor/profile"
              color="sky"
            />
          </div>
        </div>

        {/* ===== Activity Timeline ===== */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-2 border-navy-200/50">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-navy-600 to-sky-600 bg-clip-text text-transparent mb-4">
            กิจกรรมล่าสุด
          </h2>

          <div className="space-y-4">
            <ActivityItem
              icon={<Users className="w-5 h-5 text-navy-500" />}
              title="เพิ่มผู้รับการฝึกใหม่"
              description="นักศึกษา A ถูกเพิ่มเข้าสู่ระบบ"
              time="2 ชั่วโมงที่แล้ว"
            />
            <ActivityItem
              icon={<FileText className="w-5 h-5 text-sky-500" />}
              title="อัปเดตโปรแกรมฝึก"
              description="โปรแกรม 'ฟิตเนสเบื้องต้น' ถูกอัปเดต"
              time="5 ชั่วโมงที่แล้ว"
            />
            <ActivityItem
              icon={<Clock className="w-5 h-5 text-navy-600" />}
              title="ประเมินผลสำเร็จ"
              description="ประเมินผลการฝึกของนักศึกษา B"
              time="1 วันที่แล้ว"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Sub-Components ===== */

function StatCard({ title, value, icon, gradient }) {
  return (
    <div className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-navy-200/50 transform hover:-translate-y-1">
      <div className="flex items-center gap-4">
        <div
          className={`bg-gradient-to-br ${gradient} text-white p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300 border border-white/20`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-steel-700 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-navy-600 to-sky-600 bg-clip-text text-transparent">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ title, desc, link, icon, color }) {
  const colorClasses = {
    navy: "from-navy-500 to-navy-600 hover:from-navy-600 hover:to-navy-700",
    sky: "from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700",
  };

  const iconBgClasses = {
    navy: "bg-gradient-to-br from-navy-100 to-navy-200 text-navy-600 group-hover:bg-gradient-to-br group-hover:from-navy-500 group-hover:to-navy-600 group-hover:text-white",
    sky: "bg-gradient-to-br from-sky-100 to-sky-200 text-sky-600 group-hover:bg-gradient-to-br group-hover:from-sky-500 group-hover:to-sky-600 group-hover:text-white",
  };

  return (
    <a
      href={link}
      className="group relative bg-gradient-to-br from-white to-navy-50/50 rounded-xl p-5 border-2 border-navy-200/50 hover:border-navy-300 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl overflow-hidden"
    >
      {/* Background gradient effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
      ></div>

      <div className="relative z-10">
        <div
          className={`inline-flex p-2 rounded-lg ${iconBgClasses[color]} mb-3 group-hover:scale-110 transition-all duration-300`}
        >
          {icon}
        </div>
        <h3 className="font-bold text-steel-800 text-lg mb-1">{title}</h3>
        <p className="text-sm text-steel-600">{desc}</p>
      </div>
    </a>
  );
}

function ActivityItem({ icon, title, description, time }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-white to-navy-50/50 border-2 border-navy-200/50 hover:shadow-md transition-shadow">
      <div className="mt-1 bg-gradient-to-br from-navy-100 to-sky-100 rounded-lg p-2 border border-white/20">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-steel-800 mb-1">{title}</h3>
        <p className="text-sm text-steel-700">{description}</p>
      </div>
      <span className="text-xs text-steel-400 whitespace-nowrap">{time}</span>
    </div>
  );
}