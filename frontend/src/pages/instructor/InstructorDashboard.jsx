export default function InstructorDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        📊 แดชบอร์ดอาจารย์
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500 text-sm">
            ผู้รับการฝึกทั้งหมด
          </h3>
          <p className="text-3xl font-bold mt-2">24</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500 text-sm">
            โปรแกรมฝึก
          </h3>
          <p className="text-3xl font-bold mt-2">6</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500 text-sm">
            รอประเมินผล
          </h3>
          <p className="text-3xl font-bold mt-2 text-orange-600">
            3
          </p>
        </div>
      </div>
    </div>
  );
}