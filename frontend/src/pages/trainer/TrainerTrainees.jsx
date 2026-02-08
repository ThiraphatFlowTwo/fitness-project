import React, { useState } from 'react';
import { UserPlus, Eye, Edit, Trash2, X, Save } from 'lucide-react';

const TrainerTrainees = () => {
  const [trainees, setTrainees] = useState([
    {
      id: 1,
      name: 'สมหญิง ชัยชนะ',
      gender: 'หญิง',
      age: 25,
      goal: 'เพิ่มมวลกล้ามเนื้อ',
      goalColor: 'green',
      bmi: 22.5,
      bodyFat: 18.2,
      healthCondition: 'สุขภาพแข็งแรง ไม่มีโรคประจำตัว',
      initial: 'ส'
    },
    {
      id: 2,
      name: 'ประภาส สุขใจ',
      gender: 'ชาย',
      age: 22,
      goal: 'คาร์ดิโอ',
      goalColor: 'blue',
      bmi: 24.1,
      bodyFat: 20.5,
      healthCondition: 'ปกติ',
      initial: 'ป'
    },
    {
      id: 3,
      name: 'วิชัย กล้าหาญ',
      gender: 'ชาย',
      age: 28,
      goal: 'เพิ่มความแข็งแรง',
      goalColor: 'purple',
      bmi: 23.8,
      bodyFat: 19.0,
      healthCondition: 'ปกติ',
      initial: 'ว'
    },
    {
      id: 4,
      name: 'สุดา ใจดี',
      gender: 'หญิง',
      age: 30,
      goal: 'ลดไขมัน',
      goalColor: 'orange',
      bmi: 26.2,
      bodyFat: 28.5,
      healthCondition: 'เริ่มมีน้ำหนักเกิน',
      initial: 'ส'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [selectedTrainee, setSelectedTrainee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    gender: 'ชาย',
    age: '',
    goal: 'เพิ่มมวลกล้ามเนื้อ',
    bmi: '',
    bodyFat: '',
    healthCondition: ''
  });

  // เปิด Modal เพิ่มลูกเทรน
  const handleAdd = () => {
    setModalMode('add');
    setFormData({
      name: '',
      gender: 'ชาย',
      age: '',
      goal: 'เพิ่มมวลกล้ามเนื้อ',
      bmi: '',
      bodyFat: '',
      healthCondition: ''
    });
    setIsModalOpen(true);
  };

  // เปิด Modal ดูรายละเอียด
  const handleView = (trainee) => {
    setModalMode('view');
    setSelectedTrainee(trainee);
    setFormData(trainee);
    setIsModalOpen(true);
  };

  // เปิด Modal แก้ไข
  const handleEdit = (trainee) => {
    setModalMode('edit');
    setSelectedTrainee(trainee);
    setFormData(trainee);
    setIsModalOpen(true);
  };

  // ลบลูกเทรน
  const handleDelete = (id) => {
    if (window.confirm('คุณต้องการลบผู้รับการฝึกนี้ใช่หรือไม่?')) {
      setTrainees(trainees.filter(t => t.id !== id));
      alert('ลบข้อมูลสำเร็จ');
    }
  };

  // บันทึกข้อมูล
  const handleSave = () => {
    if (!formData.name || !formData.age) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (modalMode === 'add') {
      const newTrainee = {
        ...formData,
        id: trainees.length + 1,
        initial: formData.name.charAt(0),
        goalColor: getGoalColor(formData.goal)
      };
      setTrainees([...trainees, newTrainee]);
      alert('เพิ่มข้อมูลสำเร็จ');
    } else if (modalMode === 'edit') {
      setTrainees(trainees.map(t => 
        t.id === selectedTrainee.id 
          ? { ...formData, id: t.id, initial: formData.name.charAt(0), goalColor: getGoalColor(formData.goal) }
          : t
      ));
      alert('แก้ไขข้อมูลสำเร็จ');
    }
    
    setIsModalOpen(false);
  };

  // กำหนดสีตามเป้าหมาย
  const getGoalColor = (goal) => {
    const colorMap = {
      'เพิ่มมวลกล้ามเนื้อ': 'green',
      'คาร์ดิโอ': 'blue',
      'เพิ่มความแข็งแรง': 'purple',
      'ลดไขมัน': 'orange'
    };
    return colorMap[goal] || 'gray';
  };

  // เปลี่ยนค่าในฟอร์ม
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-md">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">จัดการข้อมูลผู้รับการฝึก</h3>
          <button 
            onClick={handleAdd}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            <span>เพิ่มผู้รับการฝึก</span>
          </button>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ชื่อ-นามสกุล
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    เพศ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    อายุ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    เป้าหมาย
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    BMI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    การจัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {trainees.map((trainee) => (
                  <tr key={trainee.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-semibold">{trainee.initial}</span>
                        </div>
                        <span className="font-medium text-gray-800">{trainee.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {trainee.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {trainee.age} ปี
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 bg-${trainee.goalColor}-100 text-${trainee.goalColor}-800 rounded-full text-sm`}>
                        {trainee.goal}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {trainee.bmi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleView(trainee)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="ดูรายละเอียด"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleEdit(trainee)}
                          className="text-green-600 hover:text-green-800 transition-colors"
                          title="แก้ไข"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(trainee.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="ลบ"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-800">
                {modalMode === 'add' && 'เพิ่มผู้รับการฝึกใหม่'}
                {modalMode === 'edit' && 'แก้ไขข้อมูลผู้รับการฝึก'}
                {modalMode === 'view' && 'รายละเอียดผู้รับการฝึก'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ชื่อ-นามสกุล <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="เช่น สมชาย ใจดี"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      เพศ
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="ชาย">ชาย</option>
                      <option value="หญิง">หญิง</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      อายุ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="เช่น 25"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      เป้าหมายการฝึก
                    </label>
                    <select
                      name="goal"
                      value={formData.goal}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="เพิ่มมวลกล้ามเนื้อ">เพิ่มมวลกล้ามเนื้อ</option>
                      <option value="ลดไขมัน">ลดไขมัน</option>
                      <option value="คาร์ดิโอ">คาร์ดิโอ</option>
                      <option value="เพิ่มความแข็งแรง">เพิ่มความแข็งแรง</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      BMI
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="bmi"
                      value={formData.bmi}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="เช่น 22.5"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      % ไขมัน
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="bodyFat"
                      value={formData.bodyFat}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="เช่น 18.2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ข้อมูลสุขภาพพื้นฐาน
                  </label>
                  <textarea
                    name="healthCondition"
                    value={formData.healthCondition}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 resize-none"
                    placeholder="เช่น โรคประจำตัว ประวัติการบาดเจ็บ ข้อจำกัดในการออกกำลังกาย..."
                  ></textarea>
                </div>
              </div>

              <div className="flex space-x-3 pt-6 mt-6 border-t">
                {modalMode !== 'view' && (
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Save className="w-5 h-5" />
                    <span>บันทึก</span>
                  </button>
                )}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-colors"
                >
                  {modalMode === 'view' ? 'ปิด' : 'ยกเลิก'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerTrainees;