import { Link } from 'react-router-dom';
import {
  Dumbbell, ClipboardList, BarChart3, Shield,
  LogIn, Rocket, Zap, Target, Users, Trophy, ChevronDown
} from 'lucide-react';

const stats = [
  { value: '100+', label: 'ผู้ใช้งาน',          icon: Users  },
  { value: '50+',  label: 'ท่าออกกำลังกาย',     icon: Dumbbell },
  { value: '24/7', label: 'เข้าใช้งานได้ตลอด',  icon: Zap    },
];

const features = [
  {
    icon: ClipboardList,
    title: 'จัดการข้อมูล',
    desc: 'บันทึกและแก้ไขข้อมูลเทรนเนอร์ได้ง่ายดาย รองรับทุกอุปกรณ์',
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'from-blue-50 to-cyan-50',
    border: 'border-blue-100',
  },
  {
    icon: BarChart3,
    title: 'ติดตามผลการฝึก',
    desc: 'วิเคราะห์พัฒนาการและสรุปผลแบบ real-time ครบทุกมิติ',
    gradient: 'from-violet-500 to-purple-600',
    bg: 'from-violet-50 to-purple-50',
    border: 'border-violet-100',
    featured: true,
  },
  {
    icon: Shield,
    title: 'ระบบความปลอดภัย',
    desc: 'ควบคุมสิทธิ์การเข้าถึงข้อมูลอย่างเป็นระบบและปลอดภัย',
    gradient: 'from-emerald-500 to-teal-500',
    bg: 'from-emerald-50 to-teal-50',
    border: 'border-emerald-100',
  },
];

const steps = [
  { no: '01', icon: LogIn,        title: 'เข้าสู่ระบบ',     desc: 'ล็อกอินด้วยบัญชีที่แอดมินอนุมัติแล้ว' },
  { no: '02', icon: Target,       title: 'ตั้งเป้าหมาย',    desc: 'เลือกโปรแกรมฝึกและกำหนดเป้าหมาย'      },
  { no: '03', icon: Dumbbell,     title: 'ฝึกซ้อม',          desc: 'ดำเนินการฝึกตามโปรแกรมที่วางไว้'       },
  { no: '04', icon: Trophy,       title: 'ดูผลลัพธ์',       desc: 'ติดตามพัฒนาการและรับรายงานผล'           },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 leading-tight">ระบบจัดการเทรนเนอร์</p>
              <p className="text-[10px] text-slate-400">วิทยาลัยการกีฬา ม.ราชภัฏเลย</p>
            </div>
          </div>
          <Link
            to="/login"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition-all active:scale-95"
          >
            <LogIn className="w-4 h-4" />
            เข้าสู่ระบบ
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* BG Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600')" }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-900/80 to-violet-900/85" />

        {/* Decorative circles */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center gap-16">
          {/* Left */}
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-blue-200 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              <Zap className="w-3 h-3" />
              มหาวิทยาลัยราชภัฏเลย
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
              ระบบจัดการ<br />
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                เทรนเนอร์นักศึกษา
              </span>
            </h1>
            <p className="text-slate-300 text-base md:text-lg mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              แพลตฟอร์มจัดการโปรแกรมฝึกซ้อม บันทึกผล และติดตามพัฒนาการ
              สำหรับคณะวิทยาศาสตร์และเทคโนโลยี
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
  <Link
    to="/login"
    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-violet-600 text-white px-8 py-3.5 rounded-full font-bold shadow-xl hover:shadow-blue-500/30 hover:opacity-90 transition-all active:scale-95 text-sm"
  >
    <Rocket className="w-4 h-4" />
    เริ่มใช้งานเลย
  </Link>

  <a
    href="#features"
    className="inline-flex items-center justify-center gap-2 border border-white/30 hover:bg-white/10 text-white px-8 py-3.5 rounded-full font-semibold text-sm backdrop-blur-sm transition-all"
  >
    <ChevronDown className="w-4 h-4" />
    ดูรายละเอียด
  </a>
</div>
</div>

          {/* Right — stat cards */}
          <div className="flex-shrink-0 grid grid-cols-1 gap-4 w-full max-w-xs">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl px-6 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white leading-tight">{value}</p>
                  <p className="text-xs text-blue-200">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L1440 80L1440 30C1200 70 960 10 720 30C480 50 240 10 0 30L0 80Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">ฟีเจอร์</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 mt-2 mb-3">
            ครบทุกความต้องการ
          </h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            ระบบที่ออกแบบมาเพื่อการจัดการเทรนเนอร์อย่างมีประสิทธิภาพ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc, gradient, bg, border, featured }) => (
            <div
              key={title}
              className={`
                relative rounded-3xl p-7 border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group
                bg-gradient-to-br ${bg} ${border}
                ${featured ? 'ring-2 ring-violet-400/40 shadow-lg shadow-violet-100' : 'shadow-sm'}
              `}
            >
              {featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow">
                  ⭐ ยอดนิยม
                </span>
              )}
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg mb-5 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-slate-50 py-24 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-violet-600 uppercase tracking-widest">วิธีใช้งาน</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mt-2">
              เริ่มต้นง่ายใน 4 ขั้นตอน
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ no, icon: Icon, title, desc }, i) => (
              <div key={no} className="relative bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1 text-center">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-6 h-0.5 bg-gradient-to-r from-blue-200 to-violet-200 z-10" />
                )}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg mx-auto mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-black text-slate-300 tracking-widest">{no}</span>
                <h3 className="font-bold text-slate-800 mt-1 mb-2">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="relative rounded-3xl overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 to-violet-900/90" />
          <div className="relative z-10 py-16 px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              พร้อมเริ่มต้นใช้งานแล้วหรือยัง?
            </h2>
            <p className="text-blue-200 mb-8 max-w-lg mx-auto text-sm leading-relaxed">
              เข้าสู่ระบบเพื่อจัดการข้อมูลเทรนเนอร์และโปรแกรมฝึกสอนได้ทันที
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-3.5 rounded-full font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-sm active:scale-95"
            >
              <Rocket className="w-4 h-4" />
              เข้าสู่ระบบตอนนี้
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-900 text-slate-400 py-10 text-center text-xs">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
              <Dumbbell className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-sm">ระบบจัดการเทรนเนอร์</span>
          </div>
          <p className="text-slate-500">© 2567 วิทยาลัยการกีฬา คณะวิทยาศาสตร์และเทคโนโลยี มหาวิทยาลัยราชภัฏเลย</p>
        </div>
      </footer>
    </div>
  );
}