export default function ManageTrainees() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">👥 เทรนเนอร์</h1>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ชื่อ</th>
              <th className="p-2 border">อีเมล</th>
              <th className="p-2 border">สถานะ</th>
              <th className="p-2 border">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50">
              <td className="p-2 border">สมชาย ใจดี</td>
              <td className="p-2 border">somchai@test.com</td>
              <td className="p-2 border">
                <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                  กำลังฝึก
                </span>
              </td>
              <td className="p-2 border text-center">
                <button className="px-3 py-1 text-xs bg-blue-500 text-white rounded">
                  ดูรายละเอียด
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}