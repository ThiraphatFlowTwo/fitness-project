export default function InstructorDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b-4 border-blue-600 px-6 py-3 flex justify-between items-center">
        <div className="flex flex-col text-sm">
          <span className="font-bold">ระบบจัดการเทรนเนอร์</span>
          <span className="text-gray-500">
            วิทยาลัยสารพัดช่าง คณะวิทยาศาสตร์และเทคโนโลยี
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">นายสมชาย ใจดี</span>
          <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center">
            👤
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-col items-center mt-12 gap-6">
        {/* Profile Card */}
        <div className="bg-white w-[420px] rounded-xl shadow-md px-6 py-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center text-3xl">
            👤
          </div>

          <h2 className="text-xl font-semibold">นายสมชาย ใจดี</h2>
          <p className="text-gray-500 mt-1">นักศึกษา</p>
          <p className="text-gray-700 text-sm mt-1">
            sb66xxxxxx@lru.ac.th
          </p>
        </div>

        {/* Button */}
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-base font-medium shadow">
          + เพิ่มลูกเทรน
        </button>
      </main>
    </div>
  );
}