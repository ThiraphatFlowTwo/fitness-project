import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Import แดชบอร์ดแยกตามสิทธิ์จากโฟลเดอร์ย่อยของคุณ ────────────────
import InstructorDashboard from "./dashboard/InstructorDashboard";
import TrainerDashboard from "./dashboard/TrainerDashboard";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. ดึงข้อมูล User และ Token จาก localStorage ที่เก็บไว้ตอน Login
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    // 2. ถ้าไม่มีข้อมูลการเข้าสู่ระบบ ให้ดีดกลับไปหน้า Login ทันที
    if (!savedUser || !token) {
      localStorage.clear();
      navigate("/login");
      return;
    }

    try {
      setUser(JSON.parse(savedUser));
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.clear();
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // แสดงผลระหว่างกำลังโหลดข้อมูลสิทธิ์
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">กำลังตรวจสอบสิทธิ์เข้าใช้งาน...</p>
        </div>
      </div>
    );
  }

  // 3. ⚡ ตรวจสอบบทบาท (Role) เพื่อเลือก Component แดชบอร์ดที่ถูกต้องมาแสดงผล
  if (user?.role === "instructor") {
    return <InstructorDashboard />;
  }

  if (user?.role === "trainer") {
    return <TrainerDashboard />;
  }

  // 4. กรณีพิเศษ: หากมีบทบาทอื่น (เช่น pending รออนุมัติ หรือไม่มีสิทธิ์) ให้ดีดกลับหรือแจ้งเตือน
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-lg">
        <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
          ⚠️
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">อยู่ระหว่างรอการอนุมัติสิทธิ์</h2>
        <p className="text-sm text-slate-500 leading-relaxed mb-6">
          บัญชีของคุณยังไม่ได้รับการอนุมัติการใช้งานจากผู้ดูแลระบบ (Admin) หรือไม่มีสิทธิ์เข้าถึงหน้านี้ในขณะนี้
        </p>
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm transition-all"
        >
          กลับไปหน้าเข้าสู่ระบบ
        </button>
      </div>
    </div>
  );
}