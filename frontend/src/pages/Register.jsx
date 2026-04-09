import { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FileText, User, Mail, Lock, Eye, EyeOff, Shield, IdCard } from "lucide-react";

const Field = ({ label, name, type = "text", placeholder, error, icon, rightEl, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-xs font-semibold text-steel-600 uppercase tracking-wider mb-1.5">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-steel-400 text-base">{icon}</span>
      <input
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={`w-full pl-11 pr-${rightEl ? "12" : "5"} py-3 text-sm rounded-xl border bg-steel-50 outline-none transition
          focus:ring-2 focus:ring-sky-500 focus:border-transparent
          ${error ? "border-rose-400 bg-rose-50" : "border-steel-200"}`}
      />
      {rightEl && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightEl}</div>
      )}
    </div>
    {error && (
      <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
        ⚠️ {error}
      </p>
    )}
  </div>
);

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    student_id: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "pending", // กำหนดค่าเริ่มต้นเป็น "pending" เพื่อรอการอนุมัติจาก Admin
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
        role: form.role || "pending",
        name: form.name,
        email: form.email,
        student_id: form.student_id,
      });
      alert("สมัครสมาชิกสำเร็จ! กรุณารอ Admin อนุมัติสิทธิ์การใช้งาน");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "สมัครสมาชิกไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10"
        style={{ background: "#f8f9fa" }}
      >
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-navy-200/50">
            <div
              className="h-2 w-full"
              style={{ background: "linear-gradient(to right, #486581, #0ea5e9)" }}
            />

            <div className="px-10 py-8">
              <div className="flex justify-center mb-5">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md"
                  style={{ background: "linear-gradient(135deg, #486581, #0ea5e9)" }}
                >
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-extrabold text-center text-steel-800 mb-1">
                สมัครสมาชิกใหม่
              </h1>
              <p className="text-center text-steel-400 text-sm mb-7">
                กรุณากรอกข้อมูลเพื่อรอการอนุมัติจากผู้ดูแลระบบ
              </p>

              {/* ส่วนกรอกข้อมูล (Role Selector ถูกลบออกถาวร) */}
              <Field
                label="รหัสประจำตัว"
                name="student_id"
                value={form.student_id}
                onChange={handleChange}
                placeholder="รหัสประจำตัวของคุณ"
                error={errors.student_id}
                icon={<IdCard className="w-4 h-4" />}
              />
              <Field
                label="ชื่อ-นามสกุล"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="ชื่อ-นามสกุล"
                error={errors.name}
                icon={<User className="w-4 h-4" />}
              />
              <Field
                label="อีเมล"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="example@xxx.com"
                error={errors.email}
                icon={<Mail className="w-4 h-4" />}
              />
              <Field
                label="รหัสผ่าน (อย่างน้อย 8 ตัว)"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="ตั้งรหัสผ่าน"
                error={errors.password}
                icon={<Lock className="w-4 h-4" />}
                rightEl={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-steel-400 hover:text-steel-600 text-sm"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
              <Field
                label="ยืนยันรหัสผ่าน"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="กรอกรหัสผ่านอีกครั้ง"
                error={errors.confirmPassword}
                icon={<Shield className="w-4 h-4" />}
                rightEl={
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="text-steel-400 hover:text-steel-600 text-sm"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />

              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl font-semibold text-white text-sm
                           transition-all shadow-md hover:shadow-lg hover:opacity-90
                           active:scale-95 disabled:opacity-60"
                style={{ background: "linear-gradient(to right, #486581, #0ea5e9)" }}
              >
                {loading ? "กำลังดำเนินการ..." : "สมัครสมาชิก →"}
              </button>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-steel-200" />
                <span className="text-xs text-steel-400">หรือ</span>
                <div className="flex-1 h-px bg-steel-200" />
              </div>

              <p className="text-center text-sm text-steel-500">
                มีบัญชีแล้ว?{" "}
                <Link to="/login" className="font-semibold text-sky-600 hover:text-sky-700 hover:underline transition">
                  เข้าสู่ระบบที่นี่
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-steel-400 mt-5">
            © 2567 วิทยาลัยการกีฬา มหาวิทยาลัยราชภัฏเลย
          </p>
        </div>
      </div>
    </>
  );
}