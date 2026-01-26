import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", form);

      const { token, user } = res.data;

      // เก็บ token + user
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // ⭐ Redirect ตาม role (เพิ่มตรงนี้)
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
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-500 to-gray-200">
      <div className="bg-white w-[420px] p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-1">ยินดีต้อนรับ</h1>
        <p className="text-center text-gray-500 mb-6">
          กรุณาเข้าสู่ระบบเพื่อใช้งาน
        </p>

        <input
          name="email"
          placeholder="อีเมล หรือ รหัสนักศึกษา"
          className="w-full bg-gray-100 rounded-full px-4 py-2 mb-3"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="รหัสผ่าน"
          className="w-full bg-gray-100 rounded-full px-4 py-2 mb-4"
          onChange={handleChange}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-full font-semibold mb-4"
        >
          เข้าสู่ระบบ
        </button>

        <div className="text-center text-sm">
          <Link to="/register" className="text-blue-600 hover:underline">
            ยังไม่มีบัญชี? สมัครสมาชิก
          </Link>
        </div>
      </div>
    </div>
  );
}
