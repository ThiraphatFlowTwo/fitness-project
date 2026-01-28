import { useEffect, useState } from "react";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

export default function ManageAcademicYear() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    academic_year: "",
    semester: "",
    status: "inactive",
    start_date: "",
    end_date: "",
  });

  const fetchData = async () => {
    const res = await api.get("/academic-years");
    setList(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await api.post("/academic-years", {
        academic_year: form.academic_year,
        semester: form.semester,
        status: form.status,
        start_date: form.start_date,
        end_date: form.end_date,
      });

      setForm({
        academic_year: "",
        semester: "",
        status: "inactive",
        start_date: "",
        end_date: "",
      });

      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "เพิ่มข้อมูลไม่สำเร็จ");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("ยืนยันการลบ?")) return;
    await api.delete(`/academic-years/${id}`);
    fetchData();
  };

  const handleToggleStatus = async (id) => {
    try {
      await api.patch(`/academic-years/${id}/toggle-status`);
      fetchData();
    } catch (err) {
      alert("เปลี่ยนสถานะไม่สำเร็จ");
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">
          จัดการปีการศึกษา / ภาคการศึกษา
        </h1>

        {/* ===== FORM ===== */}
        <div className="bg-white p-6 rounded-xl shadow mb-8 grid grid-cols-2 gap-4">
          <input
            name="academic_year"
            placeholder="ปีการศึกษา (เช่น 2567)"
            value={form.academic_year}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="semester"
            placeholder="ภาคการศึกษา (เช่น 1, 2)"
            value={form.semester}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="date"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <button
            onClick={handleSubmit}
            className="col-span-2 bg-teal-500 text-white py-2 rounded"
          >
            เพิ่มปีการศึกษา
          </button>
        </div>

        {/* ===== TABLE ===== */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">ปีการศึกษา</th>
                <th className="border p-2">ภาค</th>
                <th className="border p-2">สถานะ</th>
                <th className="border p-2">เริ่ม</th>
                <th className="border p-2">สิ้นสุด</th>
                <th className="border p-2">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item._id}>
                  <td className="border p-2">{item.academic_year}</td>
                  <td className="border p-2">{item.semester}</td>
                  <td className="border p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        item.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="border p-2">
                    {item.start_date?.slice(0, 10)}
                  </td>
                  <td className="border p-2">{item.end_date?.slice(0, 10)}</td>
                  <td className="border p-2 text-center space-x-2">
                    <button
                      onClick={() => handleToggleStatus(item._id)}
                      className={`px-3 py-1 rounded text-white text-xs ${
                        item.status === "active" ? "bg-red-500" : "bg-green-500"
                      }`}
                    >
                      {item.status === "active" ? "ปิดใช้งาน" : "เปิดใช้งาน"}
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="px-3 py-1 rounded text-xs bg-gray-200 hover:bg-gray-300"
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
    </>
  );
}
