import { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import {
  Dumbbell, FileText, User, Mail, Lock,
  Eye, EyeOff, Shield, IdCard, Zap, CheckCircle
} from "lucide-react";

const Field = ({ label, name, type = "text", placeholder, error, icon, rightEl, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">{label}</label>
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
      <input
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={`w-full pl-11 ${rightEl ? "pr-12" : "pr-5"} py-3.5 bg-white border-2 rounded-2xl text-sm outline-none
          transition-all placeholder:text-slate-300
          ${error
            ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
            : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          }`}
      />
      {rightEl && <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightEl}</div>}
    </div>
    {error && (
      <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium">
        <span>⚠️</span> {error}
      </p>
    )}
  </div>
);

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    student_id: "", name: "", email: "",
    password: "", confirmPassword: "", role: "pending",
  });
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(false);
  const [showPassword, setShowPw] = useState(false);
  const [showConfirm, setShowCf]  = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.student_id) e.student_id = "กรุณากรอกรหัสประจำตัว";
    if (!form.name) e.name = "กรุณากรอกชื่อ-นามสกุล";
    if (!form.email) e.email = "กรุณากรอก Email";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "รูปแบบ Email ไม่ถูกต้อง";
    if (!form.password) e.password = "กรุณากรอกรหัสผ่าน";
    else if (form.password.length < 8) e.password = "รหัสผ่านต้องอย่างน้อย 8 ตัวอักษร";
    if (!form.confirmPassword) e.confirmPassword = "กรุณายืนยันรหัสผ่าน";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "รหัสผ่านไม่ตรงกัน";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      await api.post("/auth/register", {
        username: form.student_id, password: form.password,
        role: "pending", name: form.name,
        email: form.email, student_id: form.student_id,
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
    <div className="min-h-screen flex">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-violet-900/85" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">ระบบจัดการเทรนเนอร์</p>
              <p className="text-blue-300 text-xs">ม.ราชภัฏเลย</p>
            </div>
          </div>

          {/* Steps preview */}
          <div>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-violet-400 rounded-full mb-6" />
            <h2 className="text-2xl font-black text-white mb-6 leading-tight">
              เริ่มต้นเส้นทาง<br />
              <span className="bg-gradient-to-r from-blue-300 to-violet-300 bg-clip-text text-transparent">
                นักกีฬามืออาชีพ
              </span>
            </h2>
            <div className="space-y-4">
              {[
                { step: "01", text: "สมัครและรอการอนุมัติ" },
                { step: "02", text: "เลือกโปรแกรมฝึกซ้อม"  },
                { step: "03", text: "ติดตามผลและพัฒนาตัวเอง" },
              ].map(({ step, text }) => (
                <div key={step} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4 text-blue-300" />
                  </div>
                  <div>
                    <span className="text-[10px] text-blue-400 font-bold">STEP {step}</span>
                    <p className="text-white text-sm font-medium">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-blue-300 text-xs">
            © 2567 วิทยาลัยการกีฬา คณะวิทยาศาสตร์และเทคโนโลยี
          </p>
        </div>
      </div>

      {/* ── Right Panel (form) ── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-slate-50 overflow-y-auto">

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm">ระบบจัดการเทรนเนอร์</p>
            <p className="text-slate-400 text-xs">ม.ราชภัฏเลย</p>
          </div>
        </div>

        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="mb-7">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 bg-violet-50 px-3 py-1 rounded-full mb-3">
              <Zap className="w-3 h-3" /> สมัครสมาชิก
            </span>
            <h1 className="text-3xl font-black text-slate-800 leading-tight">สร้างบัญชีใหม่</h1>
            <p className="text-slate-500 text-sm mt-1">กรอกข้อมูลเพื่อรอการอนุมัติจากผู้ดูแลระบบ</p>
          </div>

          {/* Fields */}
          <Field label="รหัสประจำตัว" name="student_id" value={form.student_id}
            onChange={handleChange} placeholder="รหัสประจำตัวของคุณ"
            error={errors.student_id} icon={<IdCard className="w-4 h-4" />} />

          <Field label="ชื่อ-นามสกุล" name="name" value={form.name}
            onChange={handleChange} placeholder="ชื่อ-นามสกุล"
            error={errors.name} icon={<User className="w-4 h-4" />} />

          <Field label="อีเมล" name="email" type="email" value={form.email}
            onChange={handleChange} placeholder="example@xxx.com"
            error={errors.email} icon={<Mail className="w-4 h-4" />} />

          <Field label="รหัสผ่าน (อย่างน้อย 8 ตัว)" name="password"
            type={showPassword ? "text" : "password"} value={form.password}
            onChange={handleChange} placeholder="ตั้งรหัสผ่าน"
            error={errors.password} icon={<Lock className="w-4 h-4" />}
            rightEl={
              <button type="button" onClick={() => setShowPw(!showPassword)}
                className="text-slate-400 hover:text-slate-600 transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          <Field label="ยืนยันรหัสผ่าน" name="confirmPassword"
            type={showConfirm ? "text" : "password"} value={form.confirmPassword}
            onChange={handleChange} placeholder="กรอกรหัสผ่านอีกครั้ง"
            error={errors.confirmPassword} icon={<Shield className="w-4 h-4" />}
            rightEl={
              <button type="button" onClick={() => setShowCf(!showConfirm)}
                className="text-slate-400 hover:text-slate-600 transition-colors">
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          {/* Submit */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-2xl font-bold text-white text-sm
                       bg-gradient-to-r from-blue-600 to-violet-600
                       shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-violet-500/30
                       hover:opacity-90 active:scale-95 disabled:opacity-60 transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                กำลังดำเนินการ...
              </span>
            ) : "สมัครสมาชิก →"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">หรือ</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <p className="text-center text-sm text-slate-500">
            มีบัญชีแล้ว?{" "}
            <Link to="/login" className="font-bold text-blue-600 hover:text-violet-600 transition-colors">
              เข้าสู่ระบบที่นี่
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-10">
          © 2567 วิทยาลัยการกีฬา มหาวิทยาลัยราชภัฏเลย
        </p>
      </div>
    </div>
  );
}