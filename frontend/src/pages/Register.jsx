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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.student_id) newErrors.student_id = "กรุณากรอกรหัสประจำตัว";
    if (!form.name) newErrors.name = "กรุณากรอกชื่อ-นามสกุล";
    if (!form.email) newErrors.email = "กรุณากรอก Email";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "รูปแบบ Email ไม่ถูกต้อง";
    if (!form.password) newErrors.password = "กรุณากรอกรหัสผ่าน";
    else if (form.password.length < 8) newErrors.password = "รหัสผ่านต้องอย่างน้อย 8 ตัวอักษร";
    if (!form.confirmPassword) newErrors.confirmPassword = "กรุณายืนยันรหัสผ่าน";
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = "รหัสผ่านไม่ตรงกัน";
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

  const Field = ({ label, name, type = "text", placeholder, error, icon, rightEl }) => (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base">{icon}</span>
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          onChange={handleChange}
          className={`w-full pl-11 pr-${rightEl ? "12" : "5"} py-3 text-sm rounded-xl border bg-gray-50 outline-none transition
            focus:ring-2 focus:ring-teal-300 focus:border-transparent
            ${error ? "border-red-400 bg-red-50" : "border-gray-200"}`}
        />
        {rightEl && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightEl}</div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  );

  return (
    <>
      <Navbar />
      <div
        className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10"
        style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #fef3ec 100%)" }}
      >
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Top gradient bar */}
            <div
              className="h-2 w-full"
              style={{ background: "linear-gradient(to right, #2dd4bf, #fb923c)" }}
            />

            <div className="px-10 py-8">
              {/* Header */}
              <div className="flex justify-center mb-5">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md"
                  style={{ background: "linear-gradient(135deg, #2dd4bf, #fb923c)" }}
                >
                  📝
                </div>
              </div>
              <h1 className="text-2xl font-extrabold text-center text-gray-800 mb-1">
                สร้างบัญชีผู้ใช้ใหม่
              </h1>
              <p className="text-center text-gray-400 text-sm mb-7">
                กรอกข้อมูลเพื่อสมัครใช้งานระบบ
              </p>

              {/* Role Selector — Pills */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  ประเภทผู้ใช้
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "trainer", label: "🎓 นักศึกษา (Trainer)" },
                    { value: "instructor", label: "👨‍🏫 อาจารย์ (Instructor)" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm({ ...form, role: opt.value })}
                      className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition-all
                        ${form.role === opt.value
                          ? "text-white border-transparent shadow-md"
                          : "bg-gray-50 border-gray-200 text-gray-500 hover:border-teal-300"
                        }`}
                      style={
                        form.role === opt.value
                          ? { background: "linear-gradient(to right, #2dd4bf, #fb923c)" }
                          : {}
                      }
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fields */}
              <Field
                label="รหัสประจำตัว"
                name="student_id"
                placeholder="รหัสประจำตัวของคุณ"
                error={errors.student_id}
                icon="🪪"
              />
              <Field
                label="ชื่อ-นามสกุล"
                name="name"
                placeholder="ชื่อ-นามสกุล"
                error={errors.name}
                icon="👤"
              />
              <Field
                label="อีเมล"
                name="email"
                type="email"
                placeholder="example@xxx.com"
                error={errors.email}
                icon="✉️"
              />
              <Field
                label="รหัสผ่าน (อย่างน้อย 8 ตัว)"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="ตั้งรหัสผ่าน"
                error={errors.password}
                icon="🔒"
                rightEl={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 text-sm"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                }
              />
              <Field
                label="ยืนยันรหัสผ่าน"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="กรอกรหัสผ่านอีกครั้ง"
                error={errors.confirmPassword}
                icon="🔐"
                rightEl={
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="text-gray-400 hover:text-gray-600 text-sm"
                  >
                    {showConfirm ? "🙈" : "👁️"}
                  </button>
                }
              />

              {/* Submit */}
              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl font-semibold text-white text-sm
                           transition-all shadow-md hover:shadow-lg hover:opacity-90
                           active:scale-95 disabled:opacity-60"
                style={{ background: "linear-gradient(to right, #2dd4bf, #fb923c)" }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    กำลังสมัคร...
                  </span>
                ) : "ลงทะเบียน →"}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">หรือ</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <p className="text-center text-sm text-gray-500">
                มีบัญชีแล้ว?{" "}
                <Link to="/login" className="font-semibold text-teal-500 hover:text-teal-600 hover:underline transition">
                  เข้าสู่ระบบที่นี่
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-5">
            © 2567 วิทยาลัยการกีฬา มหาวิทยาลัยราชภัฏเลย
          </p>
        </div>
      </div>
    </>
  );
}