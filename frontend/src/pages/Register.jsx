import { useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    student_id: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "trainer",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    // ตรวจรหัสผ่าน
    if (form.password !== form.confirmPassword) {
      return alert("รหัสผ่านไม่ตรงกัน");
    }

    // ตรวจรหัสประจำตัว
    if (!form.student_id) {
      return alert("กรุณากรอกรหัสนักศึกษา / รหัสบุคลากร");
    }

    try {
      await api.post("/auth/register", {
        username: form.student_id, // ⭐ ใช้รหัสประจำตัวเป็น username
        password: form.password,
        role: form.role,
        name: form.name,
        email: form.email,
        student_id: form.student_id,
      });

      alert("สมัครสมาชิกสำเร็จ");
    } catch (err) {
      console.log("REGISTER ERROR:", err.response?.data);
      alert(err.response?.data?.message || "สมัครสมาชิกไม่สำเร็จ");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-500 to-gray-200">
      <div className="bg-white w-[420px] p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-1">สร้างบัญชีใหม่</h1>
        <p className="text-center text-gray-500 mb-6">
          กรอกข้อมูลเพื่อสมัครใช้งานระบบ
        </p>

        {/* รหัสนักศึกษา / บุคลากร */}
        <input
          name="student_id"
          placeholder="รหัสนักศึกษา / รหัสบุคลากร"
          className="w-full bg-gray-100 rounded-full px-4 py-2 mb-3"
          onChange={handleChange}
        />

        {/* ชื่อ-นามสกุล */}
        <input
          name="name"
          placeholder="ชื่อ-นามสกุล"
          className="w-full bg-gray-100 rounded-full px-4 py-2 mb-3"
          onChange={handleChange}
        />

        {/* อีเมล (ไม่ใช้ login แต่เก็บไว้ในระบบ) */}
        <input
          name="email"
          type="email"
          placeholder="อีเมล (สำหรับติดต่อ)"
          className="w-full bg-gray-100 rounded-full px-4 py-2 mb-3"
          onChange={handleChange}
        />

        {/* รหัสผ่าน */}
        <input
          name="password"
          type="password"
          placeholder="รหัสผ่าน (อย่างน้อย 8 ตัว)"
          className="w-full bg-gray-100 rounded-full px-4 py-2 mb-3"
          onChange={handleChange}
        />

        {/* ยืนยันรหัสผ่าน */}
        <input
          name="confirmPassword"
          type="password"
          placeholder="ยืนยันรหัสผ่าน"
          className="w-full bg-gray-100 rounded-full px-4 py-2 mb-3"
          onChange={handleChange}
        />

        {/* เลือกบทบาท */}
        <select
          name="role"
          className="w-full bg-gray-100 rounded-full px-4 py-2 mb-4"
          onChange={handleChange}
        >
          <option value="trainer">นักศึกษา (Trainer)</option>
          <option value="instructor">อาจารย์ (Instructor)</option>
        </select>

        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-full font-semibold mb-4"
        >
          ลงทะเบียน
        </button>

        <div className="text-center text-sm">
          <Link to="/login" className="text-blue-600 hover:underline">
            มีบัญชีแล้ว? เข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </div>
  );
}
