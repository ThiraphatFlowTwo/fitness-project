import { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import {
  Dumbbell, User, Mail, Lock,
  Eye, EyeOff, IdCard, Zap, CheckCircle, AlertCircle, X
} from "lucide-react";

// ── Custom Alert Modal ──────────────────────────────────────
function AlertModal({ open, type = "error", title, message, onClose }) {
  if (!open) return null;

  const styles = {
    success: { icon: <CheckCircle className="w-5 h-5" />, bg: "bg-emerald-400/15 text-emerald-300" },
    error:   { icon: <AlertCircle className="w-5 h-5" />, bg: "bg-rose-400/15 text-rose-300" },
  };
  const s = styles[type] || styles.error;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ animation: "fadeIn 0.2s ease-out" }}
    >
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-sm rounded-3xl bg-slate-900/95 border border-white/10 shadow-2xl p-6 text-white"
        style={{ animation: "popIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3 mb-2">
          <div
            className={`w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center ${s.bg}`}
          >
            {s.icon}
          </div>
          <div className="pt-1.5">
            <p className="font-bold text-sm leading-snug">{title}</p>
          </div>
        </div>

        {message && (
          <p className="text-slate-300 text-sm leading-relaxed mt-3 whitespace-pre-line pl-[3.5rem] -mt-1">
            {message}
          </p>
        )}

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-blue-600 to-violet-600
                     shadow-lg shadow-blue-500/25 hover:opacity-90 active:scale-95 transition-all"
        >
          ตกลง
        </button>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.92) translateY(8px) } to { opacity: 1; transform: scale(1) translateY(0) } }
      `}</style>
    </div>
  );
}

const Field = ({ label, name, type = "text", placeholder, error, icon, rightEl, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </span>
      <input
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={`w-full pl-11 ${rightEl ? 'pr-12' : 'pr-5'} py-3.5 bg-white border-2 rounded-2xl text-sm outline-none
          transition-all placeholder:text-slate-300
          ${error 
            ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
            : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
          }`}
      />
      {rightEl && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {rightEl}
        </div>
      )}
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
    name: "",
    email: "",
    password: "",
    confirmPassword: "", // ➕ เพิ่ม State สำหรับยืนยันรหัสผ่าน
    student_id: "",
    role: "trainer"
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPw] = useState(false);
  const [showConfirmPassword, setShowConfirmPw] = useState(false); // ➕ เปิด/ปิดการมองเห็น Confirm Password

  const [alertModal, setAlertModal] = useState({
    open: false,
    type: "error",
    title: "",
    message: ""
  });

  const closeAlert = () => {
    const wasSuccess = alertModal.type === "success";
    setAlertModal(a => ({ ...a, open: false }));
    if (wasSuccess) navigate("/login");
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "กรุณากรอกชื่อ-นามสกุล";
    
    if (!form.email.trim()) {
      e.email = "กรุณากรอกอีเมลสำหรับเข้าใช้งาน";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      e.email = "รูปแบบอีเมลไม่ถูกต้อง";
    }

    // 🔒 1. ตรวจสอบรหัสผ่านอย่างน้อย 8 ตัวอักษร
    if (!form.password) {
      e.password = "กรุณากรอกรหัสผ่าน";
    } else if (form.password.length < 8) {
      e.password = "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร";
    }

    // 🔒 2. ตรวจสอบรหัสผ่านตรงกันสองครั้ง
    if (!form.confirmPassword) {
      e.confirmPassword = "กรุณากรอกยืนยันรหัสผ่าน";
    } else if (form.password !== form.confirmPassword) {
      e.confirmPassword = "รหัสผ่านที่ยืนยันไม่ตรงกัน";
    }

    if (form.role === "trainer") {
      if (!form.student_id.trim()) {
        e.student_id = "กรุณากรอกรหัสนักศึกษา";
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    try {
      setLoading(true);

      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
      };

      if (form.role === "trainer") {
        payload.student_id = form.student_id.trim();
      }

      const response = await api.post("/auth/register", payload);

      setAlertModal({
        open: true,
        type: "success",
        title: "ลงทะเบียนสำเร็จ!",
        message: response.data.message || "กรุณารอแอดมินหรืออาจารย์ตรวจสอบและอนุมัติสิทธิ์เข้าใช้งาน"
      });
    } catch (err) {
      setAlertModal({
        open: true,
        type: "error",
        title: "การลงทะเบียนไม่สำเร็จ",
        message: err.response?.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"
      });
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">ระบบจัดการเทรนเนอร์</p>
              <p className="text-blue-300 text-xs">ม.ราชภัฏเลย</p>
            </div>
          </div>

          <div>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-violet-400 rounded-full mb-6" />
            <h2 className="text-2xl font-black text-white mb-6 leading-tight">
              ร่วมเป็นส่วนหนึ่ง<br />
              <span className="bg-gradient-to-r from-blue-300 to-violet-300 bg-clip-text text-transparent">
                ของทีมกีฬาคุณภาพ
              </span>
            </h2>
            <p className="text-blue-200 text-sm max-w-sm leading-relaxed mb-6">
              ลงทะเบียนเพื่อเข้าสู่แพลตฟอร์มการจัดการ เรียนรู้ และพัฒนาเทรนเนอร์กีฬาสู่ระดับมาตรฐานสากล
            </p>
          </div>

          <p className="text-blue-300 text-xs">
            © 2567 วิทยาลัยการกีฬา คณะวิทยาศาสตร์และเทคโนโลยี
          </p>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-slate-50 overflow-y-auto">
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
          <div className="mb-7">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-3">
              <Zap className="w-3 h-3" /> ยินดีต้อนรับสมาชิกใหม่
            </span>
            <h1 className="text-3xl font-black text-slate-800 leading-tight">สมัครสมาชิก</h1>
            <p className="text-slate-500 text-sm mt-1">กรอกข้อมูลให้ครบถ้วนเพื่อสร้างบัญชีใหม่ของคุณ</p>
          </div>

          {/* Role Selection */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              ประเภทผู้ใช้งาน
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "trainer" })}
                className={`py-3 rounded-2xl text-xs font-bold border-2 transition-all ${
                  form.role === "trainer"
                    ? "border-blue-500 bg-blue-50/50 text-blue-600 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 text-slate-500"
                }`}
              >
                นักศึกษา (Trainer)
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "instructor" })}
                className={`py-3 rounded-2xl text-xs font-bold border-2 transition-all ${
                  form.role === "instructor"
                    ? "border-blue-500 bg-blue-50/50 text-blue-600 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 text-slate-500"
                }`}
              >
                อาจารย์ (Instructor)
              </button>
            </div>
          </div>

          {/* Fields */}
          <Field
            label="ชื่อ - นามสกุล"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="เช่น สมชาย ใจดี"
            error={errors.name}
            icon={<User className="w-4 h-4" />}
          />

          <Field
            label="อีเมลที่ใช้งานจริง"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="เช่น somchai@example.com"
            error={errors.email}
            icon={<Mail className="w-4 h-4" />}
          />

          {form.role === "trainer" && (
            <Field
              label="รหัสนักศึกษา"
              name="student_id"
              value={form.student_id}
              onChange={handleChange}
              placeholder="กรอกรหัสนักศึกษา 11 หลัก"
              error={errors.student_id}
              icon={<IdCard className="w-4 h-4" />}
            />
          )}

          {/* 🔒 รหัสผ่านตัวแรก */}
          <Field
            label="รหัสผ่าน"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            placeholder="กำหนดรหัสผ่าน (8 ตัวขึ้นไป)"
            error={errors.password}
            icon={<Lock className="w-4 h-4" />}
            rightEl={
              <button
                type="button"
                onClick={() => setShowPw(!showPassword)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          {/* 🔒 ยืนยันรหัสผ่าน */}
          <Field
            label="ยืนยันรหัสผ่านอีกครั้ง"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="กรอกรหัสผ่านเหมือนด้านบนอีกครั้ง"
            error={errors.confirmPassword}
            icon={<Lock className="w-4 h-4" />}
            rightEl={
              <button
                type="button"
                onClick={() => setShowConfirmPw(!showConfirmPassword)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full mt-4 py-3.5 rounded-2xl font-bold text-white text-sm
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

      <AlertModal
        open={alertModal.open}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        onClose={closeAlert}
      />
    </div>
  );
}