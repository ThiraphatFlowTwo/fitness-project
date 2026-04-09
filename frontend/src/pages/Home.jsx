import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow">
              🏋️
            </div>
            <div>
              <h1 className="text-base font-bold text-blue-700 leading-tight">
                ระบบจัดการเทรนเนอร์
              </h1>
              <p className="text-xs text-gray-400">
                วิทยาลัยการกีฬา คณะวิทยาศาสตร์และเทคโนโลยี
              </p>
            </div>
          </div>
          <Link
            to="/login"
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-all shadow-sm"
          >
            👤 เข้าสู่ระบบ
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-white text-center px-6">
          <span className="bg-blue-500/30 border border-blue-400/50 text-blue-200 text-xs font-semibold px-4 py-1 rounded-full mb-4 uppercase tracking-widest">
            มหาวิทยาลัยราชภัฏเลย
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight drop-shadow-lg">
            ระบบจัดการข้อมูล<br className="hidden md:block" />
            <span className="text-blue-400">เทรนเนอร์นักศึกษา</span>
          </h1>
          <p className="text-sm md:text-base text-gray-300 mb-8 max-w-lg leading-relaxed">
            สำหรับรายวิชาการคอมพิวเตอร์ คณะวิทยาศาสตร์และเทคโนโลยี
            มหาวิทยาลัยราชภัฏเลย
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 transition-all px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-blue-500/40 text-sm"
            >
              🚀 เข้าสู่ระบบ
            </Link>
            <a
              href="#features"
              className="border border-white/40 hover:bg-white/10 transition-all px-8 py-3 rounded-full font-semibold text-sm"
            >
              ดูรายละเอียด
            </a>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      {/* Feature Cards */}
      <section id="features" className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-center text-2xl font-bold text-gray-700 mb-2">ฟีเจอร์หลัก</h2>
        <p className="text-center text-gray-400 text-sm mb-10">ระบบที่ออกแบบมาเพื่อการจัดการเทรนเนอร์อย่างมีประสิทธิภาพ</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: '📋', title: 'จัดการข้อมูล', desc: 'บันทึกและแก้ไขข้อมูลเทรนเนอร์ได้ง่ายดาย' },
            { icon: '📊', title: 'รายงานผล', desc: 'ติดตามผลและสรุปข้อมูลแบบ real-time' },
            { icon: '🔒', title: 'ระบบความปลอดภัย', desc: 'ควบคุมสิทธิ์การเข้าถึงข้อมูลอย่างเป็นระบบ' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-center">
              <div className="text-4xl mb-3">{icon}</div>
              <h3 className="font-bold text-gray-700 mb-2">{title}</h3>
              <p className="text-sm text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-6 text-center text-xs text-gray-400">
        © 2567 วิทยาลัยการกีฬา คณะวิทยาศาสตร์และเทคโนโลยี มหาวิทยาลัยราชภัฏเลย
      </footer>
    </div>
  )
}