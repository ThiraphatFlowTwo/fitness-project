import { Users, FileText, Clock, TrendingUp } from "lucide-react";
import { PageContainer } from "../../components/ui/layout/PageContainer";
import { StatCard } from "../../components/ui/cards/StatCard";
import { SectionCard } from "../../components/ui/cards/SectionCard";
import { QuickAction } from "../../components/ui/cards/QuickAction";
import { ActivityItem } from "../../components/ui/cards/ActivityItem";

export default function InstructorDashboard() {
  return (
    <PageContainer>
      <div className="space-y-8">
        {/* ===== Header ===== */}
        <div className="animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-1 bg-gradient-to-b from-navy-900 to-navy-700 rounded-full"></div>
            <h1 className="text-4xl font-bold text-navy-900">
              แดชบอร์ดอาจารย์
            </h1>
          </div>
          <p className="text-steel-500 ml-4 text-lg">ภาพรวมการจัดการผู้รับการฝึกและโปรแกรม</p>
        </div>

        {/* ===== Stat Cards ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatCard
            title="เทรนเนอร์ทั้งหมด"
            value="24"
            icon={<Users className="w-6 h-6" />}
            gradient="from-navy-900 to-navy-700"
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
            gradient="from-navy-800 to-sky-500"
          />

          <StatCard
            title="ความคืบหน้า"
            value="85%"
            icon={<TrendingUp className="w-6 h-6" />}
            gradient="from-emerald-500 to-emerald-600"
          />
        </div>

        {/* ===== Quick Actions ===== */}
        <SectionCard
          icon={<TrendingUp className="w-5 h-5 text-white" />}
          title="การจัดการด่วน"
          borderColor="navy"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickAction
              title="ดูผู้รับการฝึก"
              description="จัดการข้อมูลผู้รับการฝึก"
              icon={<Users className="w-5 h-5" />}
              link="/instructor/trainees"
              color="navy"
            />
            <QuickAction
              title="จัดการโปรแกรม"
              description="สร้างและแก้ไขโปรแกรม"
              icon={<FileText className="w-5 h-5" />}
              link="/instructor/programs"
              color="sky"
            />
            <QuickAction
              title="ประเมินผล"
              description="ประเมินผลการฝึก"
              icon={<Clock className="w-5 h-5" />}
              link="/instructor/trainees"
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

        {/* ===== Activity Timeline ===== */}
        <SectionCard
          title="กิจกรรมล่าสุด"
          borderColor="navy"
        >
          <div className="space-y-4">
            <ActivityItem
              icon={<Users className="w-5 h-5 text-navy-900" />}
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
              icon={<Clock className="w-5 h-5 text-navy-900" />}
              title="ประเมินผลสำเร็จ"
              description="ประเมินผลการฝึกของนักศึกษา B"
              time="1 วันที่แล้ว"
            />
          </div>
        </SectionCard>
      </div>
    </PageContainer>
  );
}
