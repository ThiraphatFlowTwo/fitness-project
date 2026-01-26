import { useEffect, useState } from "react";
import api from "../../services/api";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [roleFilter, setRoleFilter] = useState("all");
  const [errors, setErrors] = useState({});
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "trainer",
    name: "",
    email: "",
  });

  const fetchUsers = async () => {
    const res = await api.get("/admin/users");
    setUsers(res.data);
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

  // ===== ADD USER (ตัวเดียวเท่านั้น) =====
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
    return matchStatus && matchRole;
  });

  const count = {
    pending: users.filter((u) => u.status === "pending").length,
    active: users.filter((u) => u.status === "active").length,
    inactive: users.filter((u) => u.status === "inactive").length,
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">👥 จัดการผู้ใช้</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          ➕ เพิ่มผู้ใช้
        </button>
      </div>

      {/* ===== ROLE FILTER ===== */}
      <div className="mb-4">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="all">ทั้งหมด</option>
          <option value="trainer">เฉพาะ Trainer</option>
          <option value="instructor">เฉพาะ Instructor</option>
        </select>
      </div>

      {/* ===== TABS ===== */}
      <div className="flex gap-2 mb-4">
        <TabButton
          label={`รออนุมัติ (${count.pending})`}
          active={activeTab === "pending"}
          onClick={() => setActiveTab("pending")}
          color="yellow"
        />
        <TabButton
          label={`ใช้งาน (${count.active})`}
          active={activeTab === "active"}
          onClick={() => setActiveTab("active")}
          color="green"
        />
        <TabButton
          label={`ปิดใช้งาน (${count.inactive})`}
          active={activeTab === "inactive"}
          onClick={() => setActiveTab("inactive")}
          color="red"
        />
      </div>

      {/* ADD USER MODAL */}
      {showAdd && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="font-bold mb-3">เพิ่มผู้ใช้ใหม่</h2>

          <input
            placeholder="Username / รหัส"
            className={`border p-2 w-full mb-1 ${
              errors.username ? "border-red-500" : ""
            }`}
            value={newUser.username}
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value })
            }
          />
          {errors.username && (
            <p className="text-red-500 text-xs mb-2">{errors.username}</p>
          )}

          <input
            placeholder="รหัสผ่าน"
            type="password"
            className={`border p-2 w-full mb-1 ${
              errors.password ? "border-red-500" : ""
            }`}
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          />
          {errors.password && (
            <p className="text-red-500 text-xs mb-2">{errors.password}</p>
          )}

          <input
            placeholder="ชื่อ-นามสกุล"
            className={`border p-2 w-full mb-1 ${
              errors.name ? "border-red-500" : ""
            }`}
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mb-2">{errors.name}</p>
          )}

          <input
            placeholder="Email"
            type="email"
            className={`border p-2 w-full mb-1 ${
              errors.email ? "border-red-500" : ""
            }`}
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mb-2">{errors.email}</p>
          )}

          <select
            className={`border p-2 w-full mb-1 ${
              errors.role ? "border-red-500" : ""
            }`}
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="">-- เลือก Role --</option>
            <option value="trainer">Trainer</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>

          {errors.role && (
            <p className="text-red-500 text-xs mb-2">{errors.role}</p>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleAddUser}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              บันทึก
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      )}

      {/* USERS TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Username</th>
              <th className="p-2">ชื่อ</th>
              <th className="p-2">Role</th>
              <th className="p-2">สถานะ</th>
              <th className="p-2">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="p-2">{u.username}</td>
                <td className="p-2">{u.name || "-"}</td>

                <td className="p-2">
                  <select
                    value={u.role}
                    onChange={(e) => handleChangeRole(u._id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="trainer">Trainer</option>
                    <option value="instructor">Instructor</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>

                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      u.status === "active"
                        ? "bg-green-100 text-green-700"
                        : u.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>

                <td className="p-2 flex gap-2 flex-wrap">
                  {u.status === "pending" && (
                    <button
                      onClick={() => handleApprove(u._id)}
                      className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                    >
                      อนุมัติ
                    </button>
                  )}

                  <button
                    onClick={() => handleToggleStatus(u._id, u.status)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                  >
                    เปิด/ปิด
                  </button>

                  <button
                    onClick={() => handleDelete(u._id)}
                    className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ===== TAB BUTTON COMPONENT ===== */
function TabButton({ label, active, onClick, color }) {
  const base = "px-4 py-2 rounded font-semibold text-sm border";

  const activeStyle = {
    yellow: "bg-yellow-100 border-yellow-400 text-yellow-700",
    green: "bg-green-100 border-green-500 text-green-700",
    red: "bg-red-100 border-red-500 text-red-700",
  };

  const inactiveStyle = "bg-white border-gray-300 text-gray-500";

  return (
    <button
      onClick={onClick}
      className={`${base} ${active ? activeStyle[color] : inactiveStyle}`}
    >
      {label}
    </button>
  );
}
