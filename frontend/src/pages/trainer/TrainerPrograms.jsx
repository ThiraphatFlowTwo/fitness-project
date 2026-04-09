import React, { useState } from 'react';
import { 
  PlusCircle, Eye, Edit, Calendar, Target, Dumbbell, Users, 
  X, Save, Trash2, Send, CheckCircle, XCircle, Clock 
} from 'lucide-react';

const TrainerPrograms = () => {
  // =====================================================
  // STATE MANAGEMENT
  // =====================================================
  
  // โปรแกรมการฝึกทั้งหมด
  const [programs, setPrograms] = useState([
    {
      id: 1,
      name: 'โปรแกรมเพิ่มมวลกล้ามเนื้อ',
      trainee: 'สมหญิง ชัยชนะ',
      traineeId: 1,
      goal: 'เพิ่มมวลกล้ามเนื้อ',
      createdDate: '15 ม.ค. 2568',
      selectedExercises: [1, 2, 3, 4, 5, 6],
      duration: '3 สัปดาห์',
      status: 'approved',        // อนุมัติแล้ว - เทรนได้ตลอด
      statusText: 'อนุมัติแล้ว',
      color: 'green',
      details: 'ฝึก 3 วัน/สัปดาห์ เน้นกล้ามเนื้อขาและหลัง',
      instructorComment: ''
    },
    {
      id: 2,
      name: 'โปรแกรมคาร์ดิโอ',
      trainee: 'ประภาส สุขใจ',
      traineeId: 2,
      goal: 'คาร์ดิโอ',
      createdDate: '18 ม.ค. 2568',
      selectedExercises: [7, 8, 9, 10, 11],
      duration: '4 สัปดาห์',
      status: 'approved',
      statusText: 'อนุมัติแล้ว',
      color: 'blue',
      details: 'วิ่ง 30 นาที/วัน, HIIT 2 วัน/สัปดาห์',
      instructorComment: ''
    },
    {
      id: 3,
      name: 'โปรแกรมความแข็งแรง',
      trainee: 'วิชัย กล้าหาญ',
      traineeId: 3,
      goal: 'เพิ่มความแข็งแรง',
      createdDate: '20 ม.ค. 2568',
      selectedExercises: [1, 2, 5, 6, 12, 13, 14, 15],
      duration: '6 สัปดาห์',
      status: 'pending',         // รออนุมัติ - เทรนไม่ได้
      statusText: 'รออนุมัติ',
      color: 'yellow',
      details: 'เน้น Compound Movement และ Progressive Overload',
      instructorComment: ''
    }
  ]);

  // ข้อมูลลูกเทรน (พร้อมเป้าหมายที่ตั้งไว้แล้ว)
  const [trainees] = useState([
    { id: 1, name: 'สมหญิง ชัยชนะ', goal: 'เพิ่มมวลกล้ามเนื้อ' },
    { id: 2, name: 'ประภาส สุขใจ', goal: 'คาร์ดิโอ' },
    { id: 3, name: 'วิชัย กล้าหาญ', goal: 'เพิ่มความแข็งแรง' },
    { id: 4, name: 'สุดา ใจดี', goal: 'ลดไขมัน' }
  ]);

  // ท่าการฝึกทั้งหมด
  const [availableExercises] = useState([
    { id: 1, name: 'Bench Press', type: 'ส่วนบน', equipment: 'Barbell' },
    { id: 2, name: 'Squat', type: 'ส่วนล่าง', equipment: 'Barbell' },
    { id: 3, name: 'Deadlift', type: 'ส่วนล่าง', equipment: 'Barbell' },
    { id: 4, name: 'Pull-up', type: 'ส่วนบน', equipment: 'Pull-up Bar' },
    { id: 5, name: 'Shoulder Press', type: 'ส่วนบน', equipment: 'Dumbbell' },
    { id: 6, name: 'Lat Pulldown', type: 'ส่วนบน', equipment: 'Cable' },
    { id: 7, name: 'Running', type: 'คาร์ดิโอ', equipment: 'Treadmill' },
    { id: 8, name: 'Cycling', type: 'คาร์ดิโอ', equipment: 'Bike' },
    { id: 9, name: 'Burpees', type: 'คาร์ดิโอ', equipment: 'Body Weight' },
    { id: 10, name: 'Jump Rope', type: 'คาร์ดิโอ', equipment: 'Rope' },
    { id: 11, name: 'HIIT Sprint', type: 'คาร์ดิโอ', equipment: 'None' },
    { id: 12, name: 'Plank', type: 'แกนกลาง', equipment: 'Body Weight' },
    { id: 13, name: 'Russian Twist', type: 'แกนกลาง', equipment: 'Medicine Ball' },
    { id: 14, name: 'Leg Raise', type: 'แกนกลาง', equipment: 'Body Weight' },
    { id: 15, name: 'Lunges', type: 'ส่วนล่าง', equipment: 'Body Weight' }
  ]);

  // State สำหรับ Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    traineeId: '',
    goal: '',              // เป้าหมายจะถูกเติมอัตโนมัติจากลูกเทรน
    selectedExercises: [],
    duration: '',
    details: ''
  });

  // =====================================================
  // HANDLERS - Modal Actions
  // =====================================================

  // เปิด Modal สร้างโปรแกรมใหม่
  const handleAdd = () => {
    setModalMode('add');
    setFormData({
      name: '',
      traineeId: '',
      goal: '',
      selectedExercises: [],
      duration: '',
      details: ''
    });
    setIsModalOpen(true);
  };

  // เปิด Modal ดูรายละเอียด
  const handleView = (program) => {
    setModalMode('view');
    setSelectedProgram(program);
    setFormData({
      name: program.name,
      traineeId: program.traineeId,
      goal: program.goal,
      selectedExercises: program.selectedExercises,
      duration: program.duration,
      details: program.details
    });
    setIsModalOpen(true);
  };

  // เปิด Modal แก้ไข (แก้ไขได้เฉพาะที่ยังไม่อนุมัติ)
  const handleEdit = (program) => {
    if (program.status === 'approved') {
      alert('ไม่สามารถแก้ไขโปรแกรมที่อนุมัติแล้วได้');
      return;
    }
    setModalMode('edit');
    setSelectedProgram(program);
    setFormData({
      name: program.name,
      traineeId: program.traineeId,
      goal: program.goal,
      selectedExercises: program.selectedExercises,
      duration: program.duration,
      details: program.details
    });
    setIsModalOpen(true);
  };

  // ลบโปรแกรม (ลบได้เฉพาะที่ไม่ใช่ approved)
  const handleDelete = (program) => {
    if (program.status === 'approved') {
      alert('ไม่สามารถลบโปรแกรมที่อนุมัติแล้วได้');
      return;
    }
    if (window.confirm('คุณต้องการลบโปรแกรมนี้ใช่หรือไม่?')) {
      setPrograms(programs.filter(p => p.id !== program.id));
      alert('ลบโปรแกรมสำเร็จ');
    }
  };

  // ส่งโปรแกรมให้อาจารย์ตรวจ (ครั้งเดียว)
  const handleSubmitForApproval = (programId) => {
    if (window.confirm('คุณต้องการส่งโปรแกรมนี้ให้อาจารย์ตรวจสอบใช่หรือไม่?')) {
      setPrograms(programs.map(p => 
        p.id === programId 
          ? { ...p, status: 'pending', statusText: 'รออนุมัติ', color: 'yellow' }
          : p
      ));
      alert('ส่งโปรแกรมให้อาจารย์ตรวจสอบแล้ว');
    }
  };

  // บันทึกข้อมูล
  const handleSave = () => {
    // Validation
    if (!formData.name || !formData.traineeId) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (formData.selectedExercises.length === 0) {
      alert('กรุณาเลือกท่าในการฝึกอย่างน้อย 1 ท่า');
      return;
    }

    const selectedTrainee = trainees.find(t => t.id === parseInt(formData.traineeId));
    const today = new Date().toLocaleDateString('th-TH', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });

    if (modalMode === 'add') {
      // สร้างโปรแกรมใหม่ (สถานะ: แบบร่าง)
      const newProgram = {
        ...formData,
        id: programs.length + 1,
        trainee: selectedTrainee.name,
        createdDate: today,
        status: 'draft',
        statusText: 'แบบร่าง',
        color: 'gray',
        instructorComment: ''
      };
      setPrograms([...programs, newProgram]);
      alert('สร้างโปรแกรมสำเร็จ กรุณาส่งให้อาจารย์ตรวจสอบ');
    } else if (modalMode === 'edit') {
      // แก้ไขโปรแกรม
      setPrograms(programs.map(p => 
        p.id === selectedProgram.id 
          ? { 
              ...p, 
              ...formData,
              trainee: selectedTrainee.name
            }
          : p
      ));
      alert('แก้ไขโปรแกรมสำเร็จ');
    }
    
    setIsModalOpen(false);
  };

  // เปลี่ยนค่าในฟอร์ม
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // ถ้าเลือกลูกเทรน ให้เติมเป้าหมายอัตโนมัติ
    if (name === 'traineeId' && value) {
      const selectedTrainee = trainees.find(t => t.id === parseInt(value));
      if (selectedTrainee) {
        setFormData({ 
          ...formData, 
          [name]: value,
          goal: selectedTrainee.goal  // เติมเป้าหมายอัตโนมัติ
        });
        return;
      }
    }
    
    setFormData({ ...formData, [name]: value });
  };

  // Toggle การเลือกท่า
  const toggleExercise = (exerciseId) => {
    if (modalMode === 'view') return;
    
    if (formData.selectedExercises.includes(exerciseId)) {
      setFormData({
        ...formData,
        selectedExercises: formData.selectedExercises.filter(id => id !== exerciseId)
      });
    } else {
      setFormData({
        ...formData,
        selectedExercises: [...formData.selectedExercises, exerciseId]
      });
    }
  };

  // =====================================================
  // COMPONENTS
  // =====================================================

  // Component Card แสดงโปรแกรม
  const ProgramCard = ({ program }) => {
    const canTrain = program.status === 'approved'; // เทรนได้เฉพาะที่อนุมัติแล้ว
    
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {/* Header Card */}
        <div className={`bg-gradient-to-r from-${program.color}-500 to-${program.color}-600 p-4`}>
          <div className="flex justify-between items-start">
            <h4 className="text-white font-bold text-lg">{program.name}</h4>
            <span className={`bg-white text-${program.color}-600 px-3 py-1 rounded-full text-xs font-semibold`}>
              {program.statusText}
            </span>
          </div>
        </div>

        {/* Body Card */}
        <div className="p-4">
          {/* ข้อมูลโปรแกรม */}
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>{program.trainee}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Target className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>{program.goal}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>สร้างเมื่อ: {program.createdDate}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Dumbbell className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>{program.selectedExercises.length} ท่า, {program.duration}</span>
            </div>
          </div>

          {/* แสดงสถานะการเทรน */}
          {canTrain ? (
            <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs text-green-700 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span className="font-semibold">✅ อนุมัติแล้ว - ไปหน้าบันทึกผลการฝึกเพื่อเทรนได้เลย</span>
              </p>
            </div>
          ) : program.status === 'pending' ? (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-700 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>⏳ รออาจารย์อนุมัติ...</span>
              </p>
            </div>
          ) : program.status === 'rejected' ? (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-700 flex items-center">
                <XCircle className="w-4 h-4 mr-1" />
                <span>❌ ไม่อนุมัติ - กรุณาแก้ไข</span>
              </p>
            </div>
          ) : (
            <div className="mt-3 p-2 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-700 flex items-center">
                <Send className="w-4 h-4 mr-1" />
                <span>📤 ส่งให้อาจารย์ตรวจสอบ</span>
              </p>
            </div>
          )}

          {/* ปุ่มจัดการ */}
          <div className="mt-4 pt-4 border-t space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => handleView(program)}
                className="flex-1 bg-blue-100 text-blue-600 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center space-x-1 text-sm"
              >
                <Eye className="w-4 h-4" />
                <span>ดู</span>
              </button>
              <button 
                onClick={() => handleEdit(program)}
                disabled={program.status === 'approved'}
                className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center space-x-1 text-sm ${
                  program.status === 'approved'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-100 text-green-600 hover:bg-green-200'
                }`}
              >
                <Edit className="w-4 h-4" />
                <span>แก้ไข</span>
              </button>
              <button 
                onClick={() => handleDelete(program)}
                disabled={program.status === 'approved'}
                className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center space-x-1 text-sm ${
                  program.status === 'approved'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                <span>ลบ</span>
              </button>
            </div>

            {/* ปุ่มส่งให้อาจารย์ (เฉพาะแบบร่าง) */}
            {program.status === 'draft' && (
              <button
                onClick={() => handleSubmitForApproval(program.id)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm font-semibold"
              >
                <Send className="w-4 h-4" />
                <span>ส่งให้อาจารย์ตรวจสอบ</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">โปรแกรมการฝึก</h3>
        <button 
          onClick={handleAdd}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          <span>สร้างโปรแกรมใหม่</span>
        </button>
      </div>

      {/* คำอธิบายสถานะ */}
      <div className="mb-6 bg-white rounded-lg p-4 shadow-sm">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">📋 คำอธิบายสถานะ:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded font-semibold">แบบร่าง</span>
            <span className="text-gray-600">ยังไม่ส่งอนุมัติ</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded font-semibold">รออนุมัติ</span>
            <span className="text-gray-600">รออาจารย์ตรวจ</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-green-100 text-green-600 rounded font-semibold">อนุมัติแล้ว</span>
            <span className="text-gray-600">เทรนได้ตลอด ✅</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-red-100 text-red-600 rounded font-semibold">ไม่อนุมัติ</span>
            <span className="text-gray-600">ต้องแก้ไข</span>
          </div>
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map(program => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-800">
                {modalMode === 'add' && '📝 สร้างโปรแกรมการฝึกใหม่'}
                {modalMode === 'edit' && '✏️ แก้ไขโปรแกรมการฝึก'}
                {modalMode === 'view' && '👁️ รายละเอียดโปรแกรมการฝึก'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-4">
                {/* ข้อมูลพื้นฐาน */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ชื่อโปรแกรม <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="เช่น โปรแกรมเพิ่มมวลกล้ามเนื้อ"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      เลือกผู้รับการฝึก <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="traineeId"
                      value={formData.traineeId}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="">เลือกผู้รับการฝึก...</option>
                      {trainees.map(trainee => (
                        <option key={trainee.id} value={trainee.id}>
                          {trainee.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🎯 เป้าหมาย (ดึงจากข้อมูลลูกเทรน)
                      {!formData.traineeId && (
                        <span className="text-xs text-gray-500 ml-2">(เลือกผู้รับการฝึกก่อน)</span>
                      )}
                    </label>
                    <input
                      type="text"
                      name="goal"
                      value={formData.goal}
                      disabled={true}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed"
                      placeholder={formData.traineeId ? formData.goal : "จะแสดงเมื่อเลือกผู้รับการฝึก"}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      💡 ต้องการเปลี่ยนเป้าหมาย → ไปแก้ที่หน้าจัดการผู้รับการฝึก
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ระยะเวลา
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="เช่น 3 สัปดาห์"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    รายละเอียดโปรแกรม
                  </label>
                  <textarea
                    name="details"
                    value={formData.details}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 resize-none"
                    placeholder="เช่น ฝึก 3 วัน/สัปดาห์ เน้นกล้ามเนื้อขาและหลัง..."
                  ></textarea>
                </div>

                {/* เลือกท่าการฝึก */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    💪 เลือกท่าในการฝึก <span className="text-red-500">*</span>
                    <span className="text-purple-600 text-xs ml-2 font-semibold">
                      (เลือกแล้ว {formData.selectedExercises.length} ท่า)
                    </span>
                  </label>
                  <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {availableExercises.map(exercise => (
                        <label
                          key={exercise.id}
                          className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            formData.selectedExercises.includes(exercise.id)
                              ? 'bg-purple-100 border-2 border-purple-500'
                              : 'bg-white hover:bg-gray-100 border-2 border-transparent'
                          } ${modalMode === 'view' ? 'cursor-not-allowed' : ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.selectedExercises.includes(exercise.id)}
                            onChange={() => toggleExercise(exercise.id)}
                            disabled={modalMode === 'view'}
                            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 text-sm">{exercise.name}</p>
                            <p className="text-xs text-gray-500">{exercise.type} • {exercise.equipment}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* แสดงสถานะ (เฉพาะ View Mode) */}
                {modalMode === 'view' && selectedProgram && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">สถานะ:</span>
                      <span className={`px-3 py-1 bg-${selectedProgram.color}-100 text-${selectedProgram.color}-600 rounded-full text-xs font-semibold`}>
                        {selectedProgram.statusText}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">วันที่สร้าง:</span> {selectedProgram.createdDate}
                    </p>
                    {selectedProgram.instructorComment && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-semibold text-blue-800 mb-1">💬 ความเห็นจากอาจารย์:</p>
                        <p className="text-sm text-blue-700">{selectedProgram.instructorComment}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
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

export default TrainerPrograms;