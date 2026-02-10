export default function ManagePrograms() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📝 โปรแกรมฝึก</h1>

        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold">
          + สร้างโปรแกรม
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-gray-500">
          ยังไม่มีโปรแกรมฝึก (ตัวอย่าง)
        </p>
      </div>
    </div>
  );
}