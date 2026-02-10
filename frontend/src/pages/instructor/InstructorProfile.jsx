export default function InstructorProfile() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        ⚙️ โปรไฟล์อาจารย์
      </h1>

      <div className="bg-white rounded-xl shadow p-6 max-w-xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">
              ชื่อ
            </label>
            <input
              className="w-full border p-2 rounded"
              value="อาจารย์ทดสอบ"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">
              อีเมล
            </label>
            <input
              className="w-full border p-2 rounded"
              value="instructor@test.com"
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
}