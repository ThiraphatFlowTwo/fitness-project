import { Link } from 'react-router-dom';
import { Dumbbell, ClipboardList, BarChart3, Shield, LogIn, ArrowDown, Rocket } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-steel-50">
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-steel-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-navy-700 to-sky-600 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base font-bold bg-gradient-to-r from-navy-600 to-sky-600 bg-clip-text text-transparent leading-tight">
                ระบบจัดการเทรนเนอร์
              </h1>
              <p className="text-xs text-steel-400">
                วิทยาลัยการกีฬา คณะวิทยาศาสตร์และเทคโนโลยี
              </p>
            </div>
          </div>
          <Link
            to="/login"
            className="flex items-center gap-2 bg-gradient-to-r from-navy-700 to-sky-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:from-navy-800 hover:to-sky-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            <LogIn className="w-4 h-4" />
            เข้าสู่ระบบ
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative h-[500px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1554284126-aa88f22d8b74')"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/70 via-navy-800/60 to-steel-900/70"></div>
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-white text-center px-6">
          <span className="bg-sky-500/30 border border-sky-400/50 text-sky-100 text-xs font-semibold px-4 py-1 rounded-full mb-4 uppercase tracking-widest">
            มหาวิทยาลัยราชภัฏเลย
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight drop-shadow-lg">
            ระบบจัดการข้อมูล<br className="hidden md:block" />
            <span className="bg-gradient-to-r from-sky-400 to-sky-600 bg-clip-text text-transparent">เทรนเนอร์นักศึกษา</span>
          </h1>
          <p className="text-sm md:text-base text-steel-200 mb-8 max-w-lg leading-relaxed">
            สำหรับรายวิชาการคอมพิวเตอร์ คณะวิทยาศาสตร์และเทคโนโลยี
            มหาวิทยาลัยราชภัฏเลย
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/login"
              className="bg-gradient-to-r from-navy-700 to-sky-600 hover:from-navy-800 hover:to-sky-700 transition-all px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl text-sm hover:scale-105"
            >
              <Rocket className="w-4 h-4 inline mr-2" />
              เข้าสู่ระบบ
            </Link>
            <a
              href="#features"
              className="border border-white/40 hover:bg-white/10 transition-all px-8 py-3 rounded-full font-semibold text-sm backdrop-blur-sm"
            >
              ดูรายละเอียด
            </a>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="url(#wave-gradient)"/>
            <defs>
              <linearGradient id="wave-gradient" x1="0" y1="0" x2="1440" y2="0">
                <stop offset="0%" stopColor="#f0f4f8"/>
                <stop offset="50%" stopColor="#e9ecef"/>
                <stop offset="100%" stopColor="#f0f4f8"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>

      {/* Feature Cards */}
      <section id="features" className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-center text-2xl font-bold bg-gradient-to-r from-navy-600 to-sky-600 bg-clip-text text-transparent mb-2">ฟีเจอร์หลัก</h2>
        <p className="text-center text-steel-500 text-sm mb-10">ระบบที่ออกแบบมาเพื่อการจัดการเทรนเนอร์อย่างมีประสิทธิภาพ</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: <ClipboardList className="w-6 h-6" />, title: 'จัดการข้อมูล', desc: 'บันทึกและแก้ไขข้อมูลเทรนเนอร์ได้ง่ายดาย', color: 'from-navy-500 to-navy-600' },
            { icon: <BarChart3 className="w-6 h-6" />, title: 'รายงานผล', desc: 'ติดตามผลและสรุปข้อมูลแบบ real-time', color: 'from-sky-500 to-sky-600' },
            { icon: <Shield className="w-6 h-6" />, title: 'ระบบความปลอดภัย', desc: 'ควบคุมสิทธิ์การเข้าถึงข้อมูลอย่างเป็นระบบ', color: 'from-navy-600 to-sky-500' },
          ].map(({ icon, title, desc, color }) => (
            <div key={title} className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border-2 border-navy-200/50 text-center hover:-translate-y-2">
              <div className={`text-4xl mb-4 w-16 h-16 mx-auto bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                {icon}
              </div>
              <h3 className="font-bold text-steel-700 mb-2">{title}</h3>
              <p className="text-sm text-steel-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-navy-700 to-sky-600 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-white">
            <div className="group">
              <div className="text-5xl font-extrabold mb-2 group-hover:scale-110 transition-transform">100+</div>
              <div className="text-sky-100 text-sm font-medium">ผู้ใช้งาน</div>
            </div>
            <div className="group">
              <div className="text-5xl font-extrabold mb-2 group-hover:scale-110 transition-transform">50+</div>
              <div className="text-steel-100 text-sm font-medium">ท่าออกกำลังกาย</div>
            </div>
            <div className="group">
              <div className="text-5xl font-extrabold mb-2 group-hover:scale-110 transition-transform">24/7</div>
              <div className="text-sky-100 text-sm font-medium">เข้าใช้งานได้ตลอด</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-br from-navy-50 to-steel-50 rounded-3xl p-8 md:p-12 text-center border-2 border-navy-200/50 shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-steel-800 mb-4">
            พร้อมเริ่มต้นใช้งานระบบ?
          </h2>
          <p className="text-steel-600 mb-6 max-w-xl mx-auto">
            เข้าสู่ระบบเพื่อจัดการข้อมูลเทรนเนอร์และโปรแกรมฝึกสอนของคุณได้ทันที
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-navy-700 to-sky-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <Rocket className="w-4 h-4" />
            เข้าสู่ระบบตอนนี้
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-steel-900 text-steel-400 py-8 text-center text-xs">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-navy-700 to-sky-600 rounded-lg flex items-center justify-center text-white">
              <Dumbbell className="w-4 h-4" />
            </div>
            <span className="font-bold bg-gradient-to-r from-sky-400 to-sky-600 bg-clip-text text-transparent">
              ระบบจัดการเทรนเนอร์
            </span>
          </div>
          <p>© 2567 วิทยาลัยการกีฬา คณะวิทยาศาสตร์และเทคโนโลยี มหาวิทยาลัยราชภัฏเลย</p>
        </div>
      </footer>
    </div>
  )
}