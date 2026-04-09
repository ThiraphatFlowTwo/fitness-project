import { Link, useNavigate } from "react-router-dom";
import { Dumbbell, LogOut } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  // Safe parsing: ป้องกันแอปพังถ้าข้อมูลใน localStorage ไม่ถูกต้อง
  const getUserData = () => {
    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  };

  const user = getUserData();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // ใช้ window.location.href แทน navigate ถ้าต้องการล้าง state ทั้งหมดให้สะอาด
    window.location.href = "/login"; 
  };

  return (
    // เพิ่ม font-kanit ที่นี่
    <nav className="w-full bg-white/90 backdrop-blur-md shadow-sm px-6 py-3 flex items-center justify-between border-b border-steel-200 sticky top-0 z-50 font-kanit">
      {/* Logo / Brand */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 bg-gradient-to-br from-navy-700 to-sky-600 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Dumbbell className="w-6 h-6" />
        </div>
        <div>
          <span className="font-bold text-lg bg-gradient-to-r from-navy-600 to-sky-600 bg-clip-text text-transparent">
            Fitness Project
          </span>
          <p className="text-[10px] text-steel-400 leading-tight uppercase tracking-wider">วิทยาลัยการกีฬา</p>
        </div>
      </Link>

      {/* Menu Area */}
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="text-steel-600 hover:text-sky-600 font-medium transition-colors text-sm"
        >
          หน้าแรก
        </Link>

        {!token ? (
          <Link
            to="/login"
            className="bg-gradient-to-r from-navy-700 to-sky-600 hover:from-navy-800 hover:to-sky-700 text-white px-5 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            เข้าสู่ระบบ
          </Link>
        ) : (
          <div className="flex items-center gap-3 pl-3 border-l border-steel-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-navy-700 to-sky-600 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-sm">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="hidden sm:block leading-none">
                <p className="text-xs font-semibold text-steel-800">{user?.name || "User"}</p>
                <p className="text-[10px] text-steel-400 capitalize">{user?.role || "Member"}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              title="ออกจากระบบ"
              className="bg-steel-50 hover:bg-rose-50 text-steel-400 hover:text-rose-600 p-2 rounded-full transition-all border border-steel-200 hover:border-rose-200 group"
            >
              <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}