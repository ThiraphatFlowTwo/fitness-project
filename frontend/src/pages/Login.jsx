import { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await api.post("/auth/login", form);
      const { token, user } = res.data;

      // เก็บ token + user
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect ตาม role
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "trainer") {
        navigate("/trainer/dashboard");
      } else if (user.role === "instructor") {
        navigate("/instructor/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert(err.response?.data?.message || "เข้าสู่ระบบไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white border border-gray-200 rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-teal-300";

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <div className="min-h-[calc(100vh-96px)] flex items-center justify-center bg-gray-50">
        <div className="bg-white w-[420px] p-10 rounded-3xl shadow-2xl">
          <h1 className="text-2xl font-bold text-center mb-1 text-gray-800">
            ยินดีต้อนรับ
          </h1>
          <p className="text-center text-gray-500 mb-8">
            กรุณาเข้าสู่ระบบเพื่อใช้งาน
          </p>

          {/* Email */}
          <div className="mb-5">
            <label className="text-sm text-gray-600">อีเมล</label>
            <input
              name="email"
              type="email"
              placeholder="example@xxx.com"
              className={inputClass}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="mb-8">
            <label className="text-sm text-gray-600">รหัสผ่าน</label>
            <input
              name="password"
              type="password"
              placeholder="กรอกรหัสผ่านของคุณ"
              className={inputClass}
              onChange={handleChange}
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 rounded-full font-semibold text-white
                       bg-gradient-to-r from-teal-400 to-orange-400
                       hover:opacity-90 transition shadow-md"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>

          <div className="text-center text-sm mt-6 text-gray-600">
            ยังไม่มีบัญชี?{" "}
            <Link to="/register" className="text-teal-600 hover:underline">
              สมัครสมาชิก
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}