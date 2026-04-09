import { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Dumbbell, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await api.post("/auth/login", form);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "trainer") navigate("/trainer");
      else if (user.role === "instructor") navigate("/instructor");
      else navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "เข้าสู่ระบบไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4"
        style={{
          background: "#f8f9fa",
        }}
      >
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-navy-200/50">
            {/* Card Header Banner */}
            <div
              className="h-2 w-full"
              style={{
                background: "linear-gradient(to right, #486581, #0ea5e9)",
              }}
            />

            <div className="px-10 py-10">
              {/* Logo / Icon */}
              <div className="flex justify-center mb-5">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md"
                  style={{
                    background: "linear-gradient(135deg, #486581, #0ea5e9)",
                  }}
                >
                  <Dumbbell className="w-8 h-8 text-white" />
                </div>
              </div>

              <h1 className="text-2xl font-extrabold text-center text-steel-800 mb-1">
                ยินดีต้อนรับ
              </h1>
              <p className="text-center text-steel-400 text-sm mb-8">
                กรุณาเข้าสู่ระบบเพื่อใช้งาน
              </p>

              {/* Email Field */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-steel-600 uppercase tracking-wider mb-2">
                  อีเมล
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-steel-400 text-sm">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    name="email"
                    type="email"
                    placeholder="example@xxx.com"
                    className="w-full pl-11 pr-5 py-3 bg-steel-50 border border-steel-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-8">
                <label className="block text-xs font-semibold text-steel-600 uppercase tracking-wider mb-2">
                  รหัสผ่าน
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-steel-400 text-sm">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="กรอกรหัสผ่านของคุณ"
                    className="w-full pl-11 pr-12 py-3 bg-steel-50 border border-steel-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-steel-400 hover:text-steel-600 text-sm"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all shadow-md hover:shadow-lg hover:opacity-90 active:scale-95 disabled:opacity-60"
                style={{
                  background: "linear-gradient(to right, #486581, #0ea5e9)",
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    กำลังเข้าสู่ระบบ...
                  </span>
                ) : (
                  "เข้าสู่ระบบ →"
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-steel-200" />
                <span className="text-xs text-steel-400">หรือ</span>
                <div className="flex-1 h-px bg-steel-200" />
              </div>

              {/* Register Link */}
              <p className="text-center text-sm text-steel-500">
                ยังไม่มีบัญชี?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-sky-600 hover:text-sky-700 hover:underline transition"
                >
                  สมัครสมาชิกที่นี่
                </Link>
              </p>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-steel-400 mt-5">
            © 2567 วิทยาลัยการกีฬา มหาวิทยาลัยราชภัฏเลย
          </p>
        </div>
      </div>
    </>
  );
}