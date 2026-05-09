// InstructorProfile.jsx
import { useState } from "react";
import { Camera, Lock, Eye, EyeOff, User, Mail, Phone, Building, Save, X } from "lucide-react";

export default function InstructorProfile() {
  const [profile, setProfile] = useState({
    firstName: "สมศรี", lastName: "มีสุข",
    email: "somsri@university.ac.th",
    phone: "081-234-5678",
    department: "คณะวิทยาศาสตร์การกีฬา",
  });
  const [passwords, setPasswords] = useState({ current: "", newPw: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });

  const initials = (profile.firstName[0] ?? "") + (profile.lastName[0] ?? "");

  const handleProfileChange  = e => setProfile({ ...profile, [e.target.name]: e.target.value });
  const handlePasswordChange = e => setPasswords({ ...passwords, [e.target.name]: e.target.value });
  const toggleShow = f => setShowPw({ ...showPw, [f]: !showPw[f] });

  const handleSaveProfile = () => alert("บันทึกข้อมูลเรียบร้อย");
  const handleChangePassword = () => {
    if (!passwords.current) return alert("กรุณากรอกรหัสผ่านปัจจุบัน");
    if (passwords.newPw.length < 8) return alert("รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร");
    if (passwords.newPw !== passwords.confirm) return alert("รหัสผ่านใหม่ไม่ตรงกัน");
    alert("เปลี่ยนรหัสผ่านเรียบร้อย");
    setPasswords({ current: "", newPw: "", confirm: "" });
  };

  const inputCls = (err) => `w-full pl-10 pr-4 py-3 bg-white border-2 rounded-xl text-sm outline-none transition-all
    ${err ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
          : "border-slate-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"}`;

  const fields = [
    { name: "firstName",  label: "ชื่อ",          icon: User,     type: "text",  half: true  },
    { name: "lastName",   label: "นามสกุล",        icon: User,     type: "text",  half: true  },
    { name: "email",      label: "อีเมล",          icon: Mail,     type: "email", half: false },
    { name: "phone",      label: "เบอร์โทรศัพท์",  icon: Phone,    type: "tel",   half: false },
    { name: "department", label: "สังกัด / คณะ",   icon: Building, type: "text",  half: false },
  ];

  const pwFields = [
    { key: "current", label: "รหัสผ่านปัจจุบัน",   placeholder: "กรอกรหัสผ่านปัจจุบัน"   },
    { key: "newPw",   label: "รหัสผ่านใหม่",         placeholder: "อย่างน้อย 8 ตัวอักษร",
      hint: "ควรประกอบด้วยตัวอักษร ตัวเลข และอักขระพิเศษ" },
    { key: "confirm", label: "ยืนยันรหัสผ่านใหม่",  placeholder: "กรอกรหัสผ่านใหม่อีกครั้ง" },
  ];

  return (
    <div className="w-full min-h-screen p-6 bg-slate-50">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800">โปรไฟล์อาจารย์</h1>
        <p className="text-sm text-slate-400 mt-0.5">จัดการข้อมูลส่วนตัวและความปลอดภัย</p>
      </div>

      {/* Avatar Card */}
      <div className="bg-white rounded-2xl border-2 border-slate-100 p-5 mb-4 flex items-center gap-5">
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
            {initials}
          </div>
          <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-white border-2 border-slate-200 rounded-lg flex items-center justify-center shadow-sm hover:border-blue-400 transition-colors">
            <Camera className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>
        <div>
          <p className="font-bold text-slate-800 text-base">{profile.firstName} {profile.lastName}</p>
          <p className="text-sm text-slate-400 mt-0.5">อาจารย์ผู้ดูแล · {profile.department}</p>
          <span className="inline-flex items-center gap-1 mt-2 text-xs bg-sky-50 text-sky-600 border border-sky-200 px-2.5 py-1 rounded-full font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            ใช้งานอยู่
          </span>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-2xl border-2 border-slate-100 p-5 mb-4">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-white" />
          </div>
          <h2 className="text-sm font-bold text-slate-700">ข้อมูลส่วนตัว</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {fields.map(({ name, label, icon: Icon, type, half }) => (
            <div key={name} className={half ? "" : "col-span-2"}>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  name={name}
                  type={type}
                  value={profile[name]}
                  onChange={handleProfileChange}
                  className={inputCls(false)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-slate-100">
          <button onClick={() => alert("ยกเลิก")} className="flex items-center gap-1.5 px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm text-slate-500 hover:bg-slate-50 transition-colors">
            <X className="w-4 h-4" /> ยกเลิก
          </button>
          <button onClick={handleSaveProfile} className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all">
            <Save className="w-4 h-4" /> บันทึก
          </button>
        </div>
      </div>

      {/* Password Form */}
      <div className="bg-white rounded-2xl border-2 border-slate-100 p-5">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Lock className="w-3.5 h-3.5 text-white" />
          </div>
          <h2 className="text-sm font-bold text-slate-700">เปลี่ยนรหัสผ่าน</h2>
        </div>

        <div className="space-y-4">
          {pwFields.map(({ key, label, placeholder, hint }) => (
            <div key={key}>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  name={key}
                  type={showPw[key] ? "text" : "password"}
                  value={passwords[key]}
                  onChange={handlePasswordChange}
                  placeholder={placeholder}
                  className="w-full pl-10 pr-11 py-3 bg-white border-2 border-slate-100 rounded-xl text-sm outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all"
                />
                <button type="button" onClick={() => toggleShow(key)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPw[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {hint && <p className="text-xs text-slate-400 mt-1.5">{hint}</p>}
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-5 pt-4 border-t border-slate-100">
          <button onClick={handleChangePassword} className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all">
            <Lock className="w-4 h-4" /> เปลี่ยนรหัสผ่าน
          </button>
        </div>
      </div>
    </div>
  );
}