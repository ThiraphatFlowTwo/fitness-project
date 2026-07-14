import { useState, useEffect } from "react";
import { Camera, Lock, Eye, EyeOff, User, Mail, Building, Save, X, Loader2, AlertCircle, CheckCircle } from "lucide-react";

const API      = "http://localhost:5000/api/auth";
const getToken    = () => localStorage.getItem("token");
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization:  `Bearer ${getToken()}`,
});

export default function InstructorProfile() {
  const [userData,    setUserData]    = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [savingProf,  setSavingProf]  = useState(false);
  const [savingPass,  setSavingPass]  = useState(false);
  const [profileMsg,  setProfileMsg]  = useState(null);
  const [passMsg,     setPassMsg]     = useState(null);

  const [profile, setProfile] = useState({ name: "", email: "" });

  const [passwords, setPasswords] = useState({
    current: "", newPw: "", confirm: ""
  });

  const [showPw, setShowPw] = useState({
    current: false, newPw: false, confirm: false
  });

  // ── โหลด profile ──────────────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res  = await fetch(`${API}/profile`, { headers: authHeaders() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setUserData(data);
        setProfile({ name: data.name || "", email: data.email || "" });
      } catch (err) {
        setProfileMsg({ type: 'error', text: err.message || 'โหลดข้อมูลไม่สำเร็จ' });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ── บันทึกโปรไฟล์ ─────────────────────────────────────────────
  const handleSaveProfile = async () => {
    if (!profile.name || !profile.email) {
      setProfileMsg({ type: 'error', text: 'กรุณากรอกข้อมูลให้ครบ' }); return;
    }
    setSavingProf(true);
    setProfileMsg(null);
    try {
      const res  = await fetch(`${API}/profile`, {
        method: 'PUT', headers: authHeaders(),
        body: JSON.stringify({ name: profile.name, email: profile.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUserData(data.user);

      // อัปเดต localStorage
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        localStorage.setItem("user", JSON.stringify({
          ...u, name: data.user.name, email: data.user.email
        }));
      }
      setProfileMsg({ type: 'success', text: 'บันทึกข้อมูลสำเร็จ' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message || 'บันทึกไม่สำเร็จ' });
    } finally {
      setSavingProf(false);
    }
  };

  // ── เปลี่ยนรหัสผ่าน ───────────────────────────────────────────
  const handleChangePassword = async () => {
    setPassMsg(null);
    if (!passwords.current)               { setPassMsg({ type: 'error', text: 'กรุณากรอกรหัสผ่านปัจจุบัน' }); return; }
    if (passwords.newPw.length < 6)       { setPassMsg({ type: 'error', text: 'รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร' }); return; }
    if (passwords.newPw !== passwords.confirm) { setPassMsg({ type: 'error', text: 'รหัสผ่านใหม่ไม่ตรงกัน' }); return; }

    setSavingPass(true);
    try {
      const res  = await fetch(`${API}/change-password`, {
        method: 'PUT', headers: authHeaders(),
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.newPw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPassMsg({ type: 'success', text: 'เปลี่ยนรหัสผ่านสำเร็จ' });
      setPasswords({ current: "", newPw: "", confirm: "" });
    } catch (err) {
      setPassMsg({ type: 'error', text: err.message || 'เปลี่ยนรหัสผ่านไม่สำเร็จ' });
    } finally {
      setSavingPass(false);
    }
  };

  const toggleShow = (f) => setShowPw(p => ({ ...p, [f]: !p[f] }));

  const inputCls = "w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all";

  const pwFields = [
    { key: "current", label: "รหัสผ่านปัจจุบัน",  placeholder: "กรอกรหัสผ่านปัจจุบัน"    },
    { key: "newPw",   label: "รหัสผ่านใหม่",        placeholder: "อย่างน้อย 6 ตัวอักษร",
      hint: "ควรประกอบด้วยตัวอักษรและตัวเลข" },
    { key: "confirm", label: "ยืนยันรหัสผ่านใหม่", placeholder: "กรอกรหัสผ่านใหม่อีกครั้ง" },
  ];

  // ── Feedback component ────────────────────────────────────────
  const Feedback = ({ msg }) => !msg ? null : (
    <div className={`flex items-center gap-2 p-3 rounded-xl text-sm mb-4 ${
      msg.type === 'success'
        ? 'bg-green-50 border border-green-200 text-green-700'
        : 'bg-red-50 border border-red-200 text-red-600'
    }`}>
      {msg.type === 'success'
        ? <CheckCircle className="w-4 h-4 shrink-0" />
        : <AlertCircle className="w-4 h-4 shrink-0" />
      }
      {msg.text}
    </div>
  );

  // ── Render ────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      <span className="ml-2 text-gray-600">กำลังโหลดข้อมูล...</span>
    </div>
  );

  return (
    <div className="w-full min-h-screen p-6 bg-slate-50">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800">โปรไฟล์อาจารย์</h1>
        <p className="text-sm text-slate-400 mt-0.5">จัดการข้อมูลส่วนตัวและความปลอดภัย</p>
      </div>

      {/* Avatar Card */}
      <div className="bg-white rounded-2xl border-2 border-slate-100 p-5 mb-4 flex items-center gap-5">
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {userData?.name?.charAt(0) || '?'}
          </div>
        </div>
        <div>
          <p className="font-bold text-slate-800 text-base">{userData?.name}</p>
          <p className="text-sm text-slate-400 mt-0.5">{userData?.email} · อาจารย์</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1 text-xs bg-sky-50 text-sky-600 border border-sky-200 px-2.5 py-1 rounded-full font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              {userData?.status === 'active' ? 'ใช้งานอยู่' : userData?.status}
            </span>
            {userData?.created_at && (
              <span className="text-xs text-slate-400">
                สมัครเมื่อ {new Date(userData.created_at).toLocaleDateString('th-TH', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })}
              </span>
            )}
          </div>
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

        <Feedback msg={profileMsg} />

        <div className="space-y-4">
          {/* ชื่อ */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ชื่อ-นามสกุล</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" value={profile.name}
                onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                className={inputCls} placeholder="ชื่อ-นามสกุล" />
            </div>
          </div>

          {/* อีเมล */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">อีเมล</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="email" value={profile.email}
                onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                className={inputCls} placeholder="email@example.com" />
            </div>
          </div>

          {/* role — readonly */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">บทบาท</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" value={userData?.role || ''} disabled
                className="w-full pl-10 pr-4 py-3 bg-gray-100 border-2 border-slate-100 rounded-xl text-sm text-gray-500 cursor-not-allowed" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-slate-100">
          <button onClick={() => setProfile({ name: userData?.name || '', email: userData?.email || '' })}
            className="flex items-center gap-1.5 px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm text-slate-500 hover:bg-slate-50 transition-colors">
            <X className="w-4 h-4" />ยกเลิก
          </button>
          <button onClick={handleSaveProfile} disabled={savingProf}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold rounded-xl shadow-md hover:opacity-90 disabled:opacity-60 transition-all">
            {savingProf
              ? <><Loader2 className="w-4 h-4 animate-spin" />กำลังบันทึก...</>
              : <><Save className="w-4 h-4" />บันทึก</>
            }
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

        <Feedback msg={passMsg} />

        <div className="space-y-4">
          {pwFields.map(({ key, label, placeholder, hint }) => (
            <div key={key}>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input name={key} type={showPw[key] ? "text" : "password"}
                  value={passwords[key]}
                  onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full pl-10 pr-11 py-3 bg-white border-2 border-slate-100 rounded-xl text-sm outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all" />
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
          <button onClick={handleChangePassword} disabled={savingPass}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold rounded-xl shadow-md hover:opacity-90 disabled:opacity-60 transition-all">
            {savingPass
              ? <><Loader2 className="w-4 h-4 animate-spin" />กำลังเปลี่ยน...</>
              : <><Lock className="w-4 h-4" />เปลี่ยนรหัสผ่าน</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}
