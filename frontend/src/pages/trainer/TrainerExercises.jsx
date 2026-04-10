import React, { useState } from 'react';
import { PlusCircle, Eye, Edit, Dumbbell, Target, X, Save } from 'lucide-react';

const TrainerExercises = () => {
  // =====================================================
  // STATE MANAGEMENT
  // =====================================================

  const [exercises] = useState([
    {
      id: 1,
      nameTH: 'Bench Press',
      nameEN: 'พัฒนากล้ามเนื้อหน้าอก ไหล่และไตรเซปส์',
      equipment: 'บาร์เบล',
      muscle: 'หน้าอก',
      muscleColor: 'blue',
      icon: '💪',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 2,
      nameTH: 'Squat',
      nameEN: 'ท่าหลักที่พัฒนากล้ามเนื้อขาและแกนกลางส่วนล่าตัว',
      equipment: 'บาร์เบล',
      muscle: 'ขา',
      muscleColor: 'green',
      icon: '🦵',
      color: 'bg-green-50 border-green-200'
    },
    {
      id: 3,
      nameTH: 'Running',
      nameEN: 'พัฒนาความทนทานและระบบหัวใจและหลอดเลือด',
      equipment: 'อื่นๆ',
      muscle: 'คาร์ดิโอ',
      muscleColor: 'purple',
      icon: '🏃',
      color: 'bg-purple-50 border-purple-200'
    },
    {
      id: 4,
      nameTH: 'Deadlift',
      nameEN: 'เน้นกล้ามเนื้อหลังล่าง สะโพก และแฮมสตริง',
      equipment: 'บาร์เบล',
      muscle: 'หลัง',
      muscleColor: 'green',
      icon: '🏋️',
      color: 'bg-green-50 border-green-200'
    },
    {
      id: 5,
      nameTH: 'Plank',
      nameEN: 'พัฒนากล้ามเนื้อแกนกลางและกระทรวงเชิง',
      equipment: 'อื่นๆ',
      muscle: 'แกนกลางล่าตัว',
      muscleColor: 'orange',
      icon: '🔥',
      color: 'bg-orange-50 border-orange-200'
    },
    {
      id: 6,
      nameTH: 'Pull-up',
      nameEN: 'พัฒนากล้ามเนื้อหลังส่วนบนและแขนขน',
      equipment: 'อื่นๆ',
      muscle: 'หลัง',
      muscleColor: 'blue',
      icon: '💪',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 7,
      nameTH: 'Dumbbell Curl',
      nameEN: 'พัฒนากล้ามเนื้อแขน',
      equipment: 'ดัมเบล',
      muscle: 'แขน',
      muscleColor: 'green',
      icon: '💪',
      color: 'bg-green-50 border-green-200'
    },
    {
      id: 8,
      nameTH: 'Shoulder Press',
      nameEN: 'พัฒนากล้ามเนื้อไหล่',
      equipment: 'ดัมเบล',
      muscle: 'หัวไหล่',
      muscleColor: 'orange',
      icon: '🏋️',
      color: 'bg-orange-50 border-orange-200'
    },
    {
      id: 9,
      nameTH: 'Russian Twist',
      nameEN: 'พัฒนากล้ามเนื้อท้องข้าง',
      equipment: 'ลูกบอลฟิตเนส',
      muscle: 'แกนกลางล่าตัว',
      muscleColor: 'yellow',
      icon: '🔥',
      color: 'bg-yellow-50 border-yellow-200'
    },
    {
      id: 10,
      nameTH: 'Cycling',
      nameEN: 'พัฒนาความทนทานและกล้ามเนื้อขา',
      equipment: 'เครื่อง',
      muscle: 'คาร์ดิโอ',
      muscleColor: 'purple',
      icon: '🚴',
      color: 'bg-purple-50 border-purple-200'
    }
  ]);

  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState('ทุกส่วนของร่างกาย');
  const [selectedEquipmentFilter, setSelectedEquipmentFilter] = useState('ทุกอุปกรณ์');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [formData, setFormData] = useState({
    nameTH: '',
    nameEN: '',
    equipment: '',
    muscle: 'ทุกส่วนของร่างกาย',
    icon: '💪'
  });

  const muscleOptions = [
    { value: 'ทุกส่วนของร่างกาย', color: 'gray', icon: '💪' },
    { value: 'ทั้งพังร่างกาย', color: 'red', icon: '🔥' },
    { value: 'หลัง', color: 'brown', icon: '🦵' },
    { value: 'หน้าอก', color: 'pink', icon: '💪' },
    { value: 'หัวไหล่', color: 'orange', icon: '🏋️' },
    { value: 'ขา', color: 'blue', icon: '🦵' },
    { value: 'แขน', color: 'green', icon: '💪' },
    { value: 'แกนกลางล่าตัว', color: 'yellow', icon: '🔥' },
    { value: 'คาร์ดิโอ', color: 'purple', icon: '🏃' }
  ];

  const equipmentOptions = [
    { value: 'ดัมเบล', icon: '💪' },
    { value: 'บาร์เบล', icon: '🏋️' },
    { value: 'แคทเทิลเบล', icon: '⚫' },
    { value: 'เครื่อง', icon: '🔧' },
    { value: 'เคเบิล', icon: '🔗' },
    { value: 'คาลิสเทนิกส์', icon: '🤸' },
    { value: 'ยางยืด', icon: '🎗️' },
    { value: 'ลูกบอลฟิตเนส', icon: '⚽' },
    { value: 'ลูกบอลยาง', icon: '🏀' },
    { value: 'อื่นๆ', icon: '📦' }
  ];

  const filterOptions = [
    { id: 'all', label: 'ทั้งหมด', value: 'ทั้งหมด' },
    { id: 'upper', label: 'ส่วนบน', value: 'ส่วนบน' },
    { id: 'lower', label: 'ส่วนล่าง', value: 'ส่วนล่าง' },
    { id: 'core', label: 'แกนกลาง', value: 'แกนกลาง' },
    { id: 'cardio', label: 'คาร์ดิโอ', value: 'คาร์ดิโอ' }
  ];

  // =====================================================
  // HANDLERS
  // =====================================================

  const handleAdd = () => {
    setModalMode('add');
    setFormData({
      nameTH: '',
      nameEN: '',
      equipment: '',
      muscle: 'ทุกส่วนของร่างกาย',
      icon: '💪'
    });
    setIsModalOpen(true);
  };

  const handleView = (exercise) => {
    setModalMode('view');
    setSelectedExercise(exercise);
    setFormData({
      nameTH: exercise.nameTH,
      nameEN: exercise.nameEN,
      equipment: exercise.equipment,
      muscle: exercise.muscle,
      icon: exercise.icon
    });
    setIsModalOpen(true);
  };

  const handleEdit = (exercise) => {
    setModalMode('edit');
    setSelectedExercise(exercise);
    setFormData({
      nameTH: exercise.nameTH,
      nameEN: exercise.nameEN,
      equipment: exercise.equipment,
      muscle: exercise.muscle,
      icon: exercise.icon
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.nameTH || !formData.nameEN || !formData.equipment) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (modalMode === 'add') {
      alert('เพิ่มท่าใหม่สำเร็จ!\n\nชื่อท่า: ' + formData.nameTH);
    } else if (modalMode === 'edit') {
      alert('แก้ไขท่าสำเร็จ!\n\nชื่อท่า: ' + formData.nameTH);
    }
    
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'muscle') {
      const muscleOption = muscleOptions.find(m => m.value === value);
      setFormData({ 
        ...formData, 
        [name]: value,
        icon: muscleOption ? muscleOption.icon : '💪'
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // กรองท่าการฝึก
  const filteredExercises = exercises.filter(ex => {
    // Filter by muscle dropdown
    const matchesMuscle = selectedMuscleFilter === 'ทุกส่วนของร่างกาย' || ex.muscle === selectedMuscleFilter;

    // Filter by equipment dropdown
    const matchesEquipment = selectedEquipmentFilter === 'ทุกอุปกรณ์' || ex.equipment.includes(selectedEquipmentFilter);

    return matchesMuscle && matchesEquipment;
  });

  // =====================================================
  // COMPONENTS
  // =====================================================

  const ExerciseCard = ({ exercise }) => (
    <div className={`${exercise.color} border-2 rounded-xl p-4 hover:shadow-lg transition-all duration-300`}>
      <div className="flex justify-between items-start mb-3">
        <span className="text-4xl">{exercise.icon}</span>
        <span className={`px-3 py-1 bg-${exercise.muscleColor}-100 text-${exercise.muscleColor}-700 rounded-full text-xs font-semibold`}>
          {exercise.muscle}
        </span>
      </div>

      <h4 className="font-bold text-gray-800 text-lg mb-2">
        {exercise.nameTH}
      </h4>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {exercise.nameEN}
      </p>

      <div className="flex items-center text-xs text-gray-500 mb-4">
        <Target className="w-4 h-4 mr-1" />
        <span>{exercise.equipment}</span>
      </div>

      <div className="flex space-x-2">
        <button 
          onClick={() => handleView(exercise)}
          className="flex-1 bg-white border border-gray-300 hover:bg-blue-50 hover:border-blue-400 text-gray-700 hover:text-blue-600 py-2 rounded-lg flex items-center justify-center space-x-1 text-sm transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>ดู</span>
        </button>
        <button 
          onClick={() => handleEdit(exercise)}
          className="flex-1 bg-white border border-gray-300 hover:bg-green-50 hover:border-green-400 text-gray-700 hover:text-green-600 py-2 rounded-lg flex items-center justify-center space-x-1 text-sm transition-colors"
        >
          <Edit className="w-4 h-4" />
          <span>แก้ไข</span>
        </button>
      </div>
    </div>
  );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="text-right">
            </div>
            <button 
              onClick={handleAdd}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors shadow-md"
            >
              <PlusCircle className="w-5 h-5" />
              <span className="font-semibold">เพิ่มท่าใหม่</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Section Title */}
        <h3 className="text-2xl font-bold text-gray-800 mb-6">ท่าในการฝึก</h3>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Muscle Filter */}
          <div>
            <select
              value={selectedMuscleFilter}
              onChange={(e) => setSelectedMuscleFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="ทุกส่วนของร่างกาย">ทุกส่วนของร่างกาย</option>
              {muscleOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.value}
                </option>
              ))}
            </select>
          </div>

          {/* Equipment Filter */}
          <div>
            <select
              value={selectedEquipmentFilter}
              onChange={(e) => setSelectedEquipmentFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="ทุกอุปกรณ์">ทุกอุปกรณ์</option>
              {equipmentOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.value}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map(exercise => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>

        {/* Empty State */}
        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <Dumbbell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">ไม่พบท่าในการฝึกในหมวดหมู่นี้</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="p-6 border-b flex justify-between items-center bg-teal-600 text-white rounded-t-xl">
              <h3 className="text-xl font-bold flex items-center space-x-2">
                <PlusCircle className="w-6 h-6" />
                <span>
                  {modalMode === 'add' && 'เพิ่มท่าออกกำลังกาย'}
                  {modalMode === 'edit' && 'แก้ไขท่าออกกำลังกาย'}
                  {modalMode === 'view' && 'รายละเอียดท่าออกกำลังกาย'}
                </span>
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Dumbbell className="w-4 h-4 inline mr-1" />
                      ชื่อท่า <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nameTH"
                      value={formData.nameTH}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100"
                      placeholder="กรอกชื่อท่าออกกำลังกาย"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      💪 ประเภทท่า <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="muscle"
                      value={formData.muscle}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100"
                    >
                      <option value="">-- เลือกประเภทท่า --</option>
                      {muscleOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.icon} {option.value}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🎯 อุปกรณ์ <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="equipment"
                    value={formData.equipment}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100"
                  >
                    <option value="">-- เลือกอุปกรณ์ --</option>
                    {equipmentOptions.map(equip => (
                      <option key={equip.value} value={equip.value}>
                        {equip.icon} {equip.value}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📝 คำอธิบาย <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="nameEN"
                    value={formData.nameEN}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100 resize-none"
                    placeholder="กรุณากรอกคำอธิบายเกี่ยวกับท่าการฝึก"
                  ></textarea>
                </div>

                {formData.icon && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-6xl">{formData.icon}</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-3 pt-6 mt-6 border-t">
                {modalMode !== 'view' && (
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
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

export default TrainerExercises;