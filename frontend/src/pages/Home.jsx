import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-blue-600">
              ระบบจัดการเทรนเนอร์
            </h1>
            <p className="text-xs text-gray-500">
              วิทยาลัยการกีฬา คณะวิทยาศาสตร์และเทคโนโลยี
            </p>
          </div>

          <Link
            to="/login"
            className="flex items-center gap-2 border px-4 py-2 rounded-full hover:bg-gray-100"
          >
            👤 Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative h-[420px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1554284126-aa88f22d8b74')"
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-white text-center px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            ระบบจัดการข้อมูลเทรนเนอร์นักศึกษา
          </h1>

          <p className="text-sm md:text-base mb-6 max-w-xl">
            สำหรับรายวิชาการคอมพิวเตอร์ คณะวิทยาศาสตร์และเทคโนโลยี
            มหาวิทยาลัยราชภัฏเลย
          </p>

          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full font-semibold"
          >
            เข้าสู่ระบบ
          </Link>
        </div>
      </section>
    </div>
  )
}