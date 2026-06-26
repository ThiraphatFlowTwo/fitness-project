import React, { useState, useEffect } from 'react';
import { Save, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const API = "http://localhost:5000/api/auth";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) { window.location.href = "/login"; return {}; }
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
};

const TrainerProfile = () => {
  const [profileForm,    setProfileForm]    = useState({ name: '', email: '' });
  const [passwordForm,   setPasswordForm]   = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [userData,       setUserData]       = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [savingProfile,  setSavingProfile]  = useState(false);
  const [savingPass,     setSavingPass]     = useState(false);
  const [profileMsg,     setProfileMsg]     = useState(null);
  const [passMsg,        setPassMsg]        = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res  = await fetch(`${API}/profile`, { headers: authHeaders() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setUserData(data);
        setProfileForm({ name: data.name || '', email: data.email || '' });
      } catch (err) {
        setProfileMsg({ type: 'error', text: err.message || 'โหลดข้อมูลไม่สำเร็จ' });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.name || !profileForm.email) {
      setProfileMsg({ type: 'error', text: 'กรุณากรอกข้อมูลให้ครบ' }); return;
    }
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      const res  = await fetch(`${API}/profile`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(profileForm) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUserData(data.user);
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        localStorage.setItem("user", JSON.stringify({ ...u, name: data.user.name, email: data.user.email }));
      }
      setProfileMsg({ type: 'success', text: 'บันทึกข้อมูลสำเร็จ' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message || 'บันทึกไม่สำเร็จ' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassMsg(null);
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPassMsg({ type: 'error', text: 'กรุณากรอกข้อมูลให้ครบ' }); return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPassMsg({ type: 'error', text: 'รหัสผ่านใหม่ไม่ตรงกัน' }); return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPassMsg({ type: 'error', text: 'รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร' }); return;
    }
    setSavingPass(true);
    try {
      const res  = await fetch(`${API}/change-password`, {
        method: 'PUT', headers: authHeaders(),
        body: JSON.stringify({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPassMsg({ type: 'success', text: 'เปลี่ยนรหัสผ่านสำเร็จ' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPassMsg({ type: 'error', text: err.message || 'เปลี่ยนรหัสผ่านไม่สำเร็จ' });
    } finally {
      setSavingPass(false);
    }
  };

  const FeedbackMsg = ({ msg }) => msg ? (
    <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
      msg.type === 'success'
        ? 'bg-green-50 border border-green-200 text-green-700'
        : 'bg-red-50 border border-red-200 text-red-600'
    }`}>
      {msg.type === 'success'
        ? <CheckCircle className="w-4 h-4 shrink-0" />
        : <AlertCircle className="w-4 h-4 shrink-0" />}
      {msg.text}
    </div>
  ) : null;

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      <span className="ml-2 text-gray-600">กำลังโหลดข้อมูล...</span>
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">จัดการโปรไฟล์ส่วนตัว</h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

          {/* Avatar + สถานะ */}
          <div className="text-center">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg">
              <span className="text-white text-4xl md:text-5xl font-bold">
                {userData?.name?.charAt(0) || '?'}
              </span>
            </div>
            <p className="font-semibold text-gray-800">{userData?.name}</p>
            <p className="text-sm text-gray-400 mt-1">@{userData?.username}</p>

            <div className="mt-3 md:mt-4 space-y-2">
              {[
                { label: 'บทบาท',      value: <span className="text-sm font-semibold text-gray-700 capitalize">{userData?.role}</span> },
                { label: 'สถานะบัญชี', value: (
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    userData?.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {userData?.status === 'active' ? 'ใช้งานปกติ' : userData?.status}
                  </span>
                )},
                { label: 'สมัครเมื่อ', value: (
                  <span className="text-sm font-semibold text-gray-700">
                    {userData?.created_at ? new Date(userData.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                  </span>
                )},
              ].map(item => (
                <div key={item.label} className="p-2 md:p-3 bg-gray-50 rounded-lg text-left">
                  <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                  {item.value}
                </div>
              ))}
            </div>
          </div>

          {/* ฟอร์ม */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">

            {/* ข้อมูลส่วนตัว */}
            <form onSubmit={handleSaveProfile} className="space-y-3 md:space-y-4">
              <h4 className="font-semibold text-gray-800">ข้อมูลส่วนตัว</h4>
              <FeedbackMsg msg={profileMsg} />

              {[
                { label: 'ชื่อ-นามสกุล', type: 'text',  value: profileForm.name,  onChange: e => setProfileForm(p => ({ ...p, name: e.target.value })),  placeholder: 'ชื่อ-นามสกุล', required: true },
                { label: 'อีเมล',         type: 'email', value: profileForm.email, onChange: e => setProfileForm(p => ({ ...p, email: e.target.value })), placeholder: 'email@example.com', required: true },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">{f.label}</label>
                  <input type={f.type} value={f.value} onChange={f.onChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 md:px-4 focus:ring-2 focus:ring-purple-500 text-sm md:text-base"
                    placeholder={f.placeholder} required={f.required} />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">รหัสผู้ใช้</label>
                <input type="text" value={userData?.username || ''} disabled
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 md:px-4 bg-gray-100 cursor-not-allowed text-gray-500 text-sm md:text-base" />
                <p className="text-xs text-gray-400 mt-1">ไม่สามารถเปลี่ยนรหัสผู้ใช้ได้</p>
              </div>

              <div className="flex space-x-2 md:space-x-3 pt-2">
                <button type="submit" disabled={savingProfile}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2.5 md:py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors disabled:opacity-60 text-sm md:text-base">
                  {savingProfile
                    ? <><Loader2 className="w-4 h-4 animate-spin" /><span>กำลังบันทึก...</span></>
                    : <><Save className="w-4 h-4" /><span>บันทึกข้อมูล</span></>}
                </button>
                <button type="button"
                  onClick={() => setProfileForm({ name: userData?.name || '', email: userData?.email || '' })}
                  className="px-4 md:px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 md:py-3 rounded-lg font-semibold transition-colors text-sm md:text-base">
                  ยกเลิก
                </button>
              </div>
            </form>

            {/* เปลี่ยนรหัสผ่าน */}
            <div className="pt-4 md:pt-6 border-t">
              <h4 className="font-semibold text-gray-800 mb-3 md:mb-4">เปลี่ยนรหัสผ่าน</h4>
              <FeedbackMsg msg={passMsg} />

              <form onSubmit={handleChangePassword} className="space-y-3 mt-3">
                {[
                  { label: 'รหัสผ่านปัจจุบัน', key: 'currentPassword', placeholder: '••••••••' },
                  { label: 'รหัสผ่านใหม่',     key: 'newPassword',     placeholder: '••••••••' },
                  { label: 'ยืนยันรหัสผ่านใหม่', key: 'confirmPassword', placeholder: '••••••••' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">{f.label}</label>
                    <input type="password" value={passwordForm[f.key]}
                      onChange={e => setPasswordForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 md:px-4 focus:ring-2 focus:ring-purple-500 text-sm md:text-base"
                      placeholder={f.placeholder} />
                  </div>
                ))}
                <button type="submit" disabled={savingPass}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2.5 md:py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60 text-sm md:text-base">
                  {savingPass
                    ? <><Loader2 className="w-4 h-4 animate-spin" /><span>กำลังเปลี่ยน...</span></>
                    : <span>เปลี่ยนรหัสผ่าน</span>}
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerProfile;