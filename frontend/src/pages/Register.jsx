import { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    student_id: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "trainer",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.student_id)
      newErrors.student_id = "กรุณากรอกรหัสประจำตัว";
    if (!form.name) newErrors.name = "กรุณากรอกชื่อ-นามสกุล";

    if (!form.email) {
      newErrors.email = "กรุณากรอก Email";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "รูปแบบ Email ไม่ถูกต้อง";
    }

    if (!form.password) {
      newErrors.password = "กรุณากรอกรหัสผ่าน";
    } else if (form.password.length < 8) {
      newErrors.password = "รหัสผ่านต้องอย่างน้อย 8 ตัวอักษร";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "กรุณายืนยันรหัสผ่าน";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "รหัสผ่านไม่ตรงกัน";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      await api.post("/auth/register", {
        username: form.student_id,
        password: form.password,
        role: form.role,
        name: form.name,
        email: form.email,
        student_id: form.student_id,
      });

      alert("สมัครสมาชิกสำเร็จ! รอแอดมินอนุมัติ");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "สมัครสมาชิกไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (err) =>
    `w-full bg-white border border-gray-200 rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-teal-300 ${
      err ? "border-red-500" : ""
    }`;

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <div className="min-h-[calc(100vh-96px)] flex items-center justify-center bg-gray-50">
        <div className="bg-white w-[420px] p-10 rounded-3xl shadow-2xl">
          <h1 className="text-2xl font-bold text-center mb-1 text-gray-800">
            สร้างบัญชีผู้ใช้ใหม่
          </h1>
          <p className="text-center text-gray-500 mb-8">
            กรอกข้อมูลเพื่อสมัครใช้งานระบบ
          </p>

          {/* รหัสประจำตัว */}
          <div className="mb-4">
            <label className="text-sm text-gray-600">รหัสประจำตัว</label>
            <input
              name="student_id"
              placeholder="รหัสประจำตัวของคุณ"
              className={inputClass(errors.student_id)}
              onChange={handleChange}
            />
            {errors.student_id && (
              <p className="text-red-500 text-xs mt-1">
                {errors.student_id}
              </p>
            )}
          </div>

          {/* ชื่อ-นามสกุล */}
          <div className="mb-4">
            <label className="text-sm text-gray-600">ชื่อ-นามสกุล</label>
            <input
              name="name"
              placeholder="ชื่อ-นามสกุล"
              className={inputClass(errors.name)}
              onChange={handleChange}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="text-sm text-gray-600">อีเมล</label>
            <input
              name="email"
              type="email"
              placeholder="example@xxx.com"
              className={inputClass(errors.email)}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="text-sm text-gray-600">
              รหัสผ่าน <span className="text-red-500 text-xs">(อย่างน้อย 8 ตัว)</span>
            </label>
            <input
              name="password"
              type="password"
              placeholder="ตั้งรหัสผ่าน"
              className={inputClass(errors.password)}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="text-sm text-gray-600">ยืนยันรหัสผ่าน</label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="กรอกรหัสผ่านอีกครั้ง"
              className={inputClass(errors.confirmPassword)}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="mb-6">
            <label className="text-sm text-gray-600">ประเภทผู้ใช้</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className={inputClass(errors.role)}
            >
              <option value="trainer">นักศึกษา (Trainer)</option>
              <option value="instructor">อาจารย์ (Instructor)</option>
            </select>
          </div>

          {/* Submit */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full py-3 rounded-full font-semibold text-white
                       bg-gradient-to-r from-teal-400 to-orange-400
                       hover:opacity-90 transition shadow-md"
          >
            {loading ? "กำลังสมัคร..." : "ลงทะเบียน"}
          </button>

          <div className="text-center text-sm mt-6 text-gray-600">
            มีบัญชีแล้ว?{" "}
            <Link to="/login" className="text-teal-600 hover:underline">
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}