import React, { useState, useEffect } from 'react';
import { Save, User, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const API      = "http://localhost:5000/api/auth";
const getToken    = () => localStorage.getItem("token");
const authHeaders = () => {
  const token = localStorage.getItem("token");
  // ✅ ไม่ redirect ออกเองตรงนี้ — แค่ส่ง header เปล่าไป backend จะตอบ 401 เอง
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
};

const TrainerProfile = () => {
  const [profileForm, setProfileForm] = useState({
    name:  '',
    email: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  });

  const [userData,      setUserData]      = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPass,    setSavingPass]    = useState(false);

  // feedback messages
  const [profileMsg,    setProfileMsg]    = useState(null); // { type: 'success'|'error', text }
  const [passMsg,       setPassMsg]       = useState(null);

  // ── โหลดข้อมูล profile ───────────────────────────────────────
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

  // ── บันทึกโปรไฟล์ ─────────────────────────────────────────────
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.name || !profileForm.email) {
      setProfileMsg({ type: 'error', text: 'กรุณากรอกข้อมูลให้ครบ' });
      return;
    }
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      const res  = await fetch(`${API}/profile`, {
        method:  'PUT',
        headers: authHeaders(),
        body:    JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setUserData(data.user);
      // อัปเดต localStorage ด้วย
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

  // ── เปลี่ยนรหัสผ่าน ───────────────────────────────────────────
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
        method:  'PUT',
        headers: authHeaders(),
        body:    JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword:     passwordForm.newPassword,
        }),
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

  // ── Render ────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      <span className="ml-2 text-gray-600">กำลังโหลดข้อมูล...</span>
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">จัดการโปรไฟล์ส่วนตัว</h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Avatar + สถานะ */}
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-5xl font-bold">
                {userData?.name?.charAt(0) || '?'}
              </span>
            </div>
            <p className="font-semibold text-gray-800">{userData?.name}</p>
            <p className="text-sm text-gray-400 mt-1">@{userData?.username}</p>

            <div className="mt-4 space-y-2">
              <div className="p-3 bg-gray-50 rounded-lg text-left">
                <p className="text-xs text-gray-400 mb-1">บทบาท</p>
                <p className="text-sm font-semibold text-gray-700 capitalize">{userData?.role}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-left">
                <p className="text-xs text-gray-400 mb-1">สถานะบัญชี</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  userData?.status === 'active'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {userData?.status === 'active' ? 'ใช้งานปกติ' : userData?.status}
                </span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-left">
                <p className="text-xs text-gray-400 mb-1">สมัครเมื่อ</p>
                <p className="text-sm font-semibold text-gray-700">
                  {userData?.created_at
                    ? new Date(userData.created_at).toLocaleDateString('th-TH', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })
                    : '-'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* ฟอร์ม */}
          <div className="lg:col-span-2 space-y-6">

            {/* ── ข้อมูลส่วนตัว ── */}
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <h4 className="font-semibold text-gray-800">ข้อมูลส่วนตัว</h4>

              {/* feedback */}
              {profileMsg && (
                <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
                  profileMsg.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-red-50 border border-red-200 text-red-600'
                }`}>
                  {profileMsg.type === 'success'
                    ? <CheckCircle className="w-4 h-4 shrink-0" />
                    : <AlertCircle className="w-4 h-4 shrink-0" />
                  }
                  {profileMsg.text}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อ-นามสกุล</label>
                <input type="text" value={profileForm.name}
                  onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
                  placeholder="ชื่อ-นามสกุล" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">อีเมล</label>
                <input type="email" value={profileForm.email}
                  onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
                  placeholder="email@example.com" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">รหัสผู้ใช้</label>
                <input type="text" value={userData?.username || ''}
                  disabled
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed text-gray-500" />
                <p className="text-xs text-gray-400 mt-1">ไม่สามารถเปลี่ยนรหัสผู้ใช้ได้</p>
              </div>

              <div className="flex space-x-3 pt-2">
                <button type="submit" disabled={savingProfile}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors disabled:opacity-60">
                  {savingProfile
                    ? <><Loader2 className="w-5 h-5 animate-spin" /><span>กำลังบันทึก...</span></>
                    : <><Save className="w-5 h-5" /><span>บันทึกข้อมูล</span></>
                  }
                </button>
                <button type="button"
                  onClick={() => setProfileForm({ name: userData?.name || '', email: userData?.email || '' })}
                  className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-colors">
                  ยกเลิก
                </button>
              </div>
            </form>

            {/* ── เปลี่ยนรหัสผ่าน ── */}
            <div className="pt-6 border-t">
              <h4 className="font-semibold text-gray-800 mb-4">เปลี่ยนรหัสผ่าน</h4>

              {passMsg && (
                <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
                  passMsg.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-red-50 border border-red-200 text-red-600'
                }`}>
                  {passMsg.type === 'success'
                    ? <CheckCircle className="w-4 h-4 shrink-0" />
                    : <AlertCircle className="w-4 h-4 shrink-0" />
                  }
                  {passMsg.text}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">รหัสผ่านปัจจุบัน</label>
                  <input type="password" value={passwordForm.currentPassword}
                    onChange={e => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
                    placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">รหัสผ่านใหม่</label>
                  <input type="password" value={passwordForm.newPassword}
                    onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
                    placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ยืนยันรหัสผ่านใหม่</label>
                  <input type="password" value={passwordForm.confirmPassword}
                    onChange={e => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
                    placeholder="••••••••" />
                </div>
                <button type="submit" disabled={savingPass}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
                  {savingPass
                    ? <><Loader2 className="w-5 h-5 animate-spin" /><span>กำลังเปลี่ยน...</span></>
                    : <span>เปลี่ยนรหัสผ่าน</span>
                  }
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