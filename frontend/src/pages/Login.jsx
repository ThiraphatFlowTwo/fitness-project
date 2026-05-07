import { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell, Mail, Lock, Eye, EyeOff, Zap } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await api.post("/auth/login", form);

      const { token, user } = res.data;

      // ✅ เก็บข้อมูล login
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ redirect ตาม role
      if (user.role === "admin") {
        window.location.href = "/admin";
      } else if (user.role === "trainer") {
        window.location.href = "/trainer";
      } else if (user.role === "instructor") {
        window.location.href = "/instructor";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      alert(err.response?.data?.message || "เข้าสู่ระบบไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel (image) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-violet-900/85" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">
                ระบบจัดการเทรนเนอร์
              </p>
              <p className="text-blue-300 text-xs">ม.ราชภัฏเลย</p>
            </div>
          </div>

          {/* Center quote */}
          <div>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-violet-400 rounded-full mb-6" />
            <h2 className="text-3xl font-black text-white leading-tight mb-4">
              พัฒนาตัวเอง
              <br />
              <span className="bg-gradient-to-r from-blue-300 to-violet-300 bg-clip-text text-transparent">
                ทุกวัน ทุกก้าว
              </span>
            </h2>
            <p className="text-blue-200 text-sm leading-relaxed max-w-xs">
              ระบบจัดการโปรแกรมฝึกซ้อมและติดตามพัฒนาการสำหรับนักศึกษาวิทยาศาสตร์การกีฬา
            </p>
          </div>

          {/* Stats row */}
          <div className="flex gap-8">
            {[
              { v: "100+", l: "ผู้ใช้งาน" },
              { v: "50+", l: "ท่าฝึก" },
              { v: "24/7", l: "ใช้งานได้" },
            ].map(({ v, l }) => (
              <div key={l}>
                <p className="text-2xl font-black text-white">{v}</p>
                <p className="text-blue-300 text-xs">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel (form) ── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-slate-50">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm">
              ระบบจัดการเทรนเนอร์
            </p>
            <p className="text-slate-400 text-xs">ม.ราชภัฏเลย</p>
          </div>
        </div>

        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="mb-8">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-3">
              <Zap className="w-3 h-3" /> เข้าสู่ระบบ
            </span>
            <h1 className="text-3xl font-black text-slate-800 leading-tight">
              ยินดีต้อนรับ
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              กรุณาเข้าสู่ระบบเพื่อเริ่มใช้งาน
            </p>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              อีเมล
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                name="email"
                type="email"
                placeholder="example@xxx.com"
                onChange={handleChange}
                className="w-full pl-11 pr-5 py-3.5 bg-white border-2 border-slate-200 rounded-2xl text-sm outline-none
                           focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-300"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-7">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              รหัสผ่าน
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="กรอกรหัสผ่านของคุณ"
                onChange={handleChange}
                className="w-full pl-11 pr-12 py-3.5 bg-white border-2 border-slate-200 rounded-2xl text-sm outline-none
                           focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3.5 rounded-2xl font-bold text-white text-sm bg-gradient-to-r from-blue-600 to-violet-600
                       shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30
                       hover:opacity-90 active:scale-95 disabled:opacity-60 transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                กำลังเข้าสู่ระบบ...
              </span>
            ) : (
              "เข้าสู่ระบบ →"
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">หรือ</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <p className="text-center text-sm text-slate-500">
            ยังไม่มีบัญชี?{" "}
            <Link
              to="/register"
              className="font-bold text-blue-600 hover:text-violet-600 transition-colors"
            >
              สมัครสมาชิกที่นี่
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-12">
          © 2567 วิทยาลัยการกีฬา มหาวิทยาลัยราชภัฏเลย
        </p>
      </div>
    </div>
  );
}
