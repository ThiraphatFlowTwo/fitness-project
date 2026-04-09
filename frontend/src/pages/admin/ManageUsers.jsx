import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Power,
  Mail,
  Lock,
  User,
  Shield,
  Edit2,
  X,
} from "lucide-react";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState({});
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "trainer",
    name: "",
    email: "",
  });

  // ===== EDIT USER STATE =====
  const [showEdit, setShowEdit] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
  });

  const fetchUsers = async () => {
    const res = await api.get("/admin/users");
    setUsers(res.data);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
    });
    setShowEdit(true);
  };

  const handleUpdateUser = async () => {
    try {
      await api.put(`/admin/users/${editingUser._id}`, {
        name: editForm.name,
        email: editForm.email,
      });

      setShowEdit(false);
      fetchUsers(); // โหลดข้อมูลใหม่
    } catch (err) {
      alert("แก้ไขไม่สำเร็จ");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ===== FORM VALIDATION =====
  const validate = () => {
    const newErrors = {};

    if (!newUser.username) newErrors.username = "กรุณากรอก Username";

    if (!newUser.password) newErrors.password = "กรุณากรอกรหัสผ่าน";

    if (!newUser.name) newErrors.name = "กรุณากรอกชื่อ-นามสกุล";

    if (!newUser.email) {
      newErrors.email = "กรุณากรอก Email";
    } else if (!/^\S+@\S+\.\S+$/.test(newUser.email)) {
      newErrors.email = "รูปแบบ Email ไม่ถูกต้อง";
    }

    if (!newUser.role) newErrors.role = "กรุณาเลือก Role";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ===== ADD USER =====
  const handleAddUser = async () => {
    if (!validate()) return;

    try {
      await api.post("/admin/users", newUser);
      alert("เพิ่มผู้ใช้สำเร็จ");

      setShowAdd(false);
      setNewUser({
        username: "",
        password: "",
        role: "trainer",
        name: "",
        email: "",
      });
      setErrors({});
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "เพิ่มผู้ใช้ไม่สำเร็จ");
    }
  };

  // ===== APPROVE USER =====
  const handleApprove = async (id) => {
    try {
      await api.put(`/admin/users/${id}/approve`);
      fetchUsers();
    } catch (err) {
      alert("อนุมัติไม่สำเร็จ");
    }
  };

  // ===== UPDATE ROLE =====
  const handleChangeRole = async (id, role) => {
    await api.put(`/admin/users/${id}`, { role });
    fetchUsers();
  };

  // ===== TOGGLE STATUS =====
  const handleToggleStatus = async (id, status) => {
    const newStatus = status === "active" ? "inactive" : "active";
    await api.put(`/admin/users/${id}/status`, { status: newStatus });
    fetchUsers();
  };

  // ===== DELETE USER =====
  const handleDelete = async (id) => {
    if (!confirm("ต้องการลบผู้ใช้นี้หรือไม่?")) return;
    await api.delete(`/admin/users/${id}`);
    fetchUsers();
  };

  // ===== FILTER =====
  const filteredUsers = users.filter((u) => {
    const matchStatus = u.status === activeTab;
    const matchRole = roleFilter === "all" ? true : u.role === roleFilter;
    const matchSearch =
      searchQuery === "" ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchRole && matchSearch;
  });

  const count = {
    pending: users.filter((u) => u.status === "pending").length,
    active: users.filter((u) => u.status === "active").length,
    inactive: users.filter((u) => u.status === "inactive").length,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* ===== HEADER ===== */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                จัดการผู้ใช้
              </h1>
              <p className="text-slate-600 text-sm">
                ทั้งหมด {users.length} ผู้ใช้
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAdd(true)}
            className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            เพิ่มผู้ใช้
          </button>
        </div>

        {/* ===== FILTERS & SEARCH ===== */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-white/20 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหาชื่อ, username, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
              >
                <option value="all">ทุก Role</option>
                <option value="trainer">เฉพาะ Trainer</option>
                <option value="instructor">เฉพาะ Instructor</option>
                <option value="admin">เฉพาะ Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* ===== TABS ===== */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <TabButton
            label="รออนุมัติ"
            count={count.pending}
            icon={<Clock className="w-4 h-4" />}
            active={activeTab === "pending"}
            onClick={() => setActiveTab("pending")}
            color="yellow"
          />
          <TabButton
            label="ใช้งาน"
            count={count.active}
            icon={<CheckCircle className="w-4 h-4" />}
            active={activeTab === "active"}
            onClick={() => setActiveTab("active")}
            color="green"
          />
          <TabButton
            label="ปิดใช้งาน"
            count={count.inactive}
            icon={<XCircle className="w-4 h-4" />}
            active={activeTab === "inactive"}
            onClick={() => setActiveTab("inactive")}
            color="red"
          />
        </div>

        {/* ADD USER MODAL */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold">เพิ่มผู้ใช้ใหม่</h2>
                </div>
                <button
                  onClick={() => setShowAdd(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                {/* Username */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Username / รหัส
                  </label>
                  <input
                    placeholder="กรอก username"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.username ? "border-red-500" : "border-slate-200"
                    }`}
                    value={newUser.username}
                    onChange={(e) =>
                      setNewUser({ ...newUser, username: e.target.value })
                    }
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <Lock className="w-4 h-4 inline mr-1" />
                    รหัสผ่าน
                  </label>
                  <input
                    placeholder="กรอกรหัสผ่าน"
                    type="password"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.password ? "border-red-500" : "border-slate-200"
                    }`}
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    ชื่อ-นามสกุล
                  </label>
                  <input
                    placeholder="กรอกชื่อ-นามสกุล"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.name ? "border-red-500" : "border-slate-200"
                    }`}
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email
                  </label>
                  <input
                    placeholder="example@email.com"
                    type="email"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.email ? "border-red-500" : "border-slate-200"
                    }`}
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <Shield className="w-4 h-4 inline mr-1" />
                    Role / บทบาท
                  </label>
                  <select
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.role ? "border-red-500" : "border-slate-200"
                    }`}
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                  >
                    <option value="">-- เลือก Role --</option>
                    <option value="trainer">Trainer</option>
                    <option value="instructor">Instructor</option>
                    <option value="admin">Admin</option>
                  </select>
                  {errors.role && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      {errors.role}
                    </p>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-slate-50 p-6 rounded-b-2xl flex gap-3 border-t">
                <button
                  onClick={handleAddUser}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  บันทึก
                </button>
                <button
                  onClick={() => setShowAdd(false)}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        )}

        {/* USERS TABLE */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                    Username
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                    ชื่อ-นามสกุล
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">
                    สถานะ
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                      <p className="text-lg font-medium">ไม่พบข้อมูลผู้ใช้</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr
                      key={u._id}
                      className="hover:bg-blue-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {u.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-800">
                            {u.username}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {u.name || "-"}
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm">
                        {u.email || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={u.role}
                          onChange={(e) =>
                            handleChangeRole(u._id, e.target.value)
                          }
                          className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm font-medium"
                        >
                          <option value="trainer">Trainer</option>
                          <option value="instructor">Instructor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                            u.status === "active"
                              ? "bg-green-100 text-green-700"
                              : u.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {u.status === "active" && (
                            <CheckCircle className="w-3 h-3" />
                          )}
                          {u.status === "pending" && (
                            <Clock className="w-3 h-3" />
                          )}
                          {u.status === "inactive" && (
                            <XCircle className="w-3 h-3" />
                          )}
                          {u.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          {u.status === "pending" && (
                            <button
                              onClick={() => handleApprove(u._id)}
                              className="group flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                              title="อนุมัติ"
                            >
                              <CheckCircle className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                              อนุมัติ
                            </button>
                          )}

                          <button
                            onClick={() => openEditModal(u)}
                            className="group flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                            title="แก้ไขข้อมูล"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleToggleStatus(u._id, u.status)}
                            className="group flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                            title="เปิด/ปิดใช้งาน"
                          >
                            <Power className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                          </button>

                          <button
                            onClick={() => handleDelete(u._id)}
                            className="group flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                            title="ลบ"
                          >
                            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showEdit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-xl font-bold">แก้ไขข้อมูลผู้ใช้</h2>
              <button onClick={() => setShowEdit(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block font-semibold mb-1">ชื่อ–นามสกุล</label>
                <input
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full border p-3 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="w-full border p-3 rounded-xl"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 flex gap-3 border-t">
              <button
                onClick={handleUpdateUser}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold"
              >
                บันทึก
              </button>
              <button
                onClick={() => setShowEdit(false)}
                className="flex-1 bg-gray-200 py-3 rounded-xl font-semibold"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* ===== TAB BUTTON COMPONENT ===== */
function TabButton({ label, count, icon, active, onClick, color }) {
  const colorStyles = {
    yellow: {
      active:
        "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg shadow-yellow-500/30",
      inactive:
        "bg-white text-slate-600 border-2 border-slate-200 hover:border-yellow-400",
    },
    green: {
      active:
        "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30",
      inactive:
        "bg-white text-slate-600 border-2 border-slate-200 hover:border-green-500",
    },
    red: {
      active:
        "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30",
      inactive:
        "bg-white text-slate-600 border-2 border-slate-200 hover:border-red-500",
    },
  };


  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm
        transition-all duration-200 whitespace-nowrap
        ${active ? colorStyles[color].active : colorStyles[color].inactive}
        ${active ? "scale-105" : "hover:scale-105"}
      `}
    >
      {icon}
      <span>{label}</span>
      <span
        className={`
        px-2 py-0.5 rounded-full text-xs font-bold
        ${active ? "bg-white/20" : "bg-slate-100"}
      `}
      >
        {count}
      </span>
    </button>
  );
}