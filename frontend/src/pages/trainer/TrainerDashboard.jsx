import { User, Mail, Award, Activity, TrendingUp, Calendar, Dumbbell, Plus } from "lucide-react";

export default function TrainerDashboard() {
  return (
    <div className="min-h-screen bg-steel-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b-4 border-sky-500 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-navy-700 to-sky-600 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold bg-gradient-to-r from-navy-600 to-sky-600 bg-clip-text text-transparent">
              ระบบจัดการเทรนเนอร์
            </span>
            <span className="text-xs text-steel-500">
              วิทยาลัยการกีฬา มหาวิทยาลัยราชภัฏเลย
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-steel-700">นายสมชาย ใจดี</span>
          <div className="w-10 h-10 bg-gradient-to-br from-navy-700 to-sky-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
            ส
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center py-12 px-4 gap-8">
        {/* Welcome Section */}
        <div className="text-center max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-navy-600 to-sky-600 bg-clip-text text-transparent mb-3">
            ยินดีต้อนรับ!
          </h1>
          <p className="text-steel-600 text-lg">
            จัดการข้อมูลเทรนเนอร์และผู้รับการฝึกของคุณได้ที่นี่
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl w-full max-w-md overflow-hidden border-2 border-navy-200/50">
          {/* Card Header */}
          <div className="h-2 w-full bg-gradient-to-r from-navy-700 to-sky-600"></div>

          <div className="px-8 py-8">
            {/* Avatar */}
            <div className="flex justify-center mb-5">
              <div className="w-24 h-24 bg-gradient-to-br from-navy-700 to-sky-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                <User className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Name */}
            <h2 className="text-2xl font-extrabold text-center text-steel-800 mb-1">
              นายสมชาย ใจดี
            </h2>
            <p className="text-center text-steel-500 mb-6">นักศึกษา / Trainer</p>

            {/* Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-navy-50 to-sky-50 rounded-xl border-2 border-navy-200/30">
                <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-navy-600" />
                </div>
                <div>
                  <p className="text-xs text-steel-500">รหัสประจำตัว</p>
                  <p className="font-semibold text-steel-800">SB66XXXXXX</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-sky-50 to-navy-50 rounded-xl">
                <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <p className="text-xs text-steel-500">อีเมล</p>
                  <p className="font-semibold text-steel-800">sb66xxxxxx@lru.ac.th</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-gradient-to-br from-navy-50 to-navy-100 rounded-xl p-3 text-center border-2 border-navy-200/30">
                <p className="text-2xl font-bold bg-gradient-to-r from-navy-600 to-sky-600 bg-clip-text text-transparent">5</p>
                <p className="text-xs text-steel-500">ผู้รับการฝึก</p>
              </div>
              <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl p-3 text-center border-2 border-sky-200/30">
                <p className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-sky-500 bg-clip-text text-transparent">3</p>
                <p className="text-xs text-steel-500">โปรแกรม</p>
              </div>
              <div className="bg-gradient-to-br from-navy-50 to-sky-50 rounded-xl p-3 text-center border-2 border-navy-200/30">
                <p className="text-2xl font-bold bg-gradient-to-r from-navy-600 to-sky-600 bg-clip-text text-transparent">85%</p>
                <p className="text-xs text-steel-500">ความคืบหน้า</p>
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full bg-gradient-to-r from-navy-700 to-sky-600 hover:from-navy-800 hover:to-sky-700 text-white px-8 py-3 rounded-xl text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2">
              <User className="w-5 h-5" />
              <Plus className="w-4 h-4" />
              เพิ่มลูกเทรน
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-5 border-2 border-navy-200/50 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-navy-500 to-navy-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold bg-gradient-to-r from-navy-600 to-navy-500 bg-clip-text text-transparent">12</p>
            <p className="text-sm text-steel-500">ท่าออกกำลังกาย</p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-5 border-2 border-navy-200/50 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-sky-500 bg-clip-text text-transparent">4</p>
            <p className="text-sm text-steel-500">เครดิตที่ได้</p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-5 border-2 border-navy-200/50 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-navy-600 to-sky-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold bg-gradient-to-r from-navy-600 to-sky-600 bg-clip-text text-transparent">2567</p>
            <p className="text-sm text-steel-500">ปีการศึกษา</p>
          </div>
        </div>
      </main>
    </div>
  );
}