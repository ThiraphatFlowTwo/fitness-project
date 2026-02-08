import React, { useState } from 'react';
import { Save, Calendar, User, Target, Dumbbell, Plus, X, Search, Clock, Check } from 'lucide-react';

const TrainerResults = () => {
  // =====================================================
  // STATE MANAGEMENT
  // =====================================================

  // โปรแกรมที่อนุมัติแล้ว
  const [approvedPrograms] = useState([
    {
      id: 1,
      name: 'โปรแกรมเพิ่มมวลกล้ามเนื้อ',
      trainee: 'สมหญิง ชัยชนะ',
      traineeId: 1,
      goal: 'เพิ่มมวลกล้ามเนื้อ',
      exerciseIds: [1, 2, 3, 4, 5, 6]
    },
    {
      id: 2,
      name: 'โปรแกรมคาร์ดิโอ',
      trainee: 'ประภาส สุขใจ',
      traineeId: 2,
      goal: 'คาร์ดิโอ',
      exerciseIds: [7, 8, 9, 10, 11]
    }
  ]);

  // ท่าออกกำลังกายทั้งหมด (แบบ FitFit)
  const [allExercises] = useState([
    { id: 1, nameTH: 'อาร์โนลด์เพรส (ดัมเบล)', nameEN: 'Arnold Press (Dumbbell)', muscle: 'หัวไหล่', equipment: 'ดัมเบล', icon: '🏋️' },
    { id: 2, nameTH: 'เชสต์เพรส (ดัมเบล)', nameEN: 'Chest Press (Dumbbell)', muscle: 'หน้าอก', equipment: 'ดัมเบล', icon: '💪' },
    { id: 3, nameTH: 'กลิ้งหน้าท้อง', nameEN: 'Ab Wheel', muscle: 'แกนกลางล่าตัว', equipment: 'อื่นๆ', icon: '🔄' },
    { id: 4, nameTH: 'แอโรบิก', nameEN: 'Aerobics', muscle: 'คาร์ดิโอ', equipment: 'อื่นๆ', icon: '🔥' },
    { id: 5, nameTH: 'อะราวด์เดอะเวิลด์ (ดัมเบล)', nameEN: 'Around the World (Dumbbell)', muscle: 'หน้าอก', equipment: 'ดัมเบล', icon: '💪' },
    { id: 6, nameTH: 'แม็ดเอ็กซ์เทนชั่น (น้ำหนักตัว)', nameEN: 'Back Extension (Bodyweight)', muscle: 'หลัง', equipment: 'อื่นๆ', icon: '🦵' },
    { id: 7, nameTH: 'แม็ดเอ็กซ์เทนชั่น (เครื่อง)', nameEN: 'Back Extension (Machine)', muscle: 'หลัง', equipment: 'เครื่อง', icon: '🦵' },
    { id: 8, nameTH: 'แบทเทิลโรป', nameEN: 'Battle Ropes', muscle: 'คาร์ดิโอ', equipment: 'ยางยืด', icon: '🔥' },
    { id: 9, nameTH: 'เบนช์ดิพ', nameEN: 'Bench Dip', muscle: 'หน้าอก', equipment: 'อื่นๆ', icon: '💪' },
    { id: 10, nameTH: 'สแควอต (บาร์เบล)', nameEN: 'Squat (Barbell)', muscle: 'ขา', equipment: 'บาร์เบล', icon: '🦵' },
    { id: 11, nameTH: 'เดดลิฟท์ (บาร์เบล)', nameEN: 'Deadlift (Barbell)', muscle: 'หลัง', equipment: 'บาร์เบล', icon: '🦵' },
    { id: 12, nameTH: 'พลังค์', nameEN: 'Plank', muscle: 'แกนกลางล่าตัว', equipment: 'อื่นๆ', icon: '🔄' },
    { id: 13, nameTH: 'รัสเชียนทวิสต์', nameEN: 'Russian Twist', muscle: 'แกนกลางล่าตัว', equipment: 'ลูกบอลฟิตเนส', icon: '🔄' },
    { id: 14, nameTH: 'วิ่ง', nameEN: 'Running', muscle: 'คาร์ดิโอ', equipment: 'อื่นๆ', icon: '🏃' },
    { id: 15, nameTH: 'ปั่นจักรยาน', nameEN: 'Cycling', muscle: 'คาร์ดิโอ', equipment: 'เครื่อง', icon: '🚴' }
  ]);

  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [trainingDate, setTrainingDate] = useState(new Date().toISOString().split('T')[0]);

  // Modal เลือกท่า
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExerciseIds, setSelectedExerciseIds] = useState([]);
  const [muscleFilter, setMuscleFilter] = useState('ทั้งหมด');
  const [equipmentFilter, setEquipmentFilter] = useState('ทั้งหมด');

  // ผลการฝึกแต่ละท่า
  const [workoutSessions, setWorkoutSessions] = useState([]);

  // Timer
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Filter options
  const muscleFilterOptions = [
    'ทั้งหมด',
    'ทุกส่วนของร่างกาย',
    'หลัง',
    'หน้าอก',
    'หัวไหล่',
    'ขา',
    'แขน',
    'แกนกลางล่าตัว',
    'คาร์ดิโอ'
  ];

  const equipmentFilterOptions = [
    'ทั้งหมด',
    'ดัมเบล',
    'บาร์เบล',
    'แคทเทิลเบล',
    'เครื่อง',
    'เคเบิล',
    'คาลิสเทนิกส์',
    'ยางยืด',
    'ลูกบอลฟิตเนส',
    'ลูกบอลยาง',
    'อื่นๆ'
  ];

  // =====================================================
  // HANDLERS
  // =====================================================

  // เลือกโปรแกรม
  const handleProgramSelect = (e) => {
    const programId = e.target.value;
    setSelectedProgramId(programId);

    if (programId) {
      const program = approvedPrograms.find(p => p.id === parseInt(programId));
      setSelectedProgram(program);
      setSelectedExerciseIds(program.exerciseIds);
      setWorkoutSessions([]);
    } else {
      setSelectedProgram(null);
      setSelectedExerciseIds([]);
      setWorkoutSessions([]);
    }
  };

  // เปิด Modal เลือกท่า
  const handleOpenExerciseModal = () => {
    if (!selectedProgramId) {
      alert('กรุณาเลือกโปรแกรมก่อน');
      return;
    }
    setIsExerciseModalOpen(true);
  };

  // Toggle เลือกท่า
  const toggleExerciseSelection = (exerciseId) => {
    if (selectedExerciseIds.includes(exerciseId)) {
      setSelectedExerciseIds(selectedExerciseIds.filter(id => id !== exerciseId));
    } else {
      setSelectedExerciseIds([...selectedExerciseIds, exerciseId]);
    }
  };

  // ยืนยันเลือกท่า
  const handleConfirmExercises = () => {
    // สร้าง workout sessions จากท่าที่เลือก
    const sessions = selectedExerciseIds.map(exerciseId => {
      const exercise = allExercises.find(e => e.id === exerciseId);
      return {
        exerciseId: exercise.id,
        exerciseName: exercise.nameTH,
        exerciseNameEN: exercise.nameEN,
        muscle: exercise.muscle,
        icon: exercise.icon,
        sets: [{ setNumber: 1, weight: '', reps: '', completed: false }]
      };
    });
    setWorkoutSessions(sessions);
    setIsExerciseModalOpen(false);
    setIsTimerRunning(true);
  };

  // เพิ่มเซต
  const handleAddSet = (exerciseId) => {
    setWorkoutSessions(workoutSessions.map(session =>
      session.exerciseId === exerciseId
        ? {
            ...session,
            sets: [...session.sets, { 
              setNumber: session.sets.length + 1, 
              weight: '', 
              reps: '', 
              completed: false 
            }]
          }
        : session
    ));
  };

  // อัปเดตเซต
  const handleSetChange = (exerciseId, setNumber, field, value) => {
    setWorkoutSessions(workoutSessions.map(session =>
      session.exerciseId === exerciseId
        ? {
            ...session,
            sets: session.sets.map(set =>
              set.setNumber === setNumber
                ? { ...set, [field]: value }
                : set
            )
          }
        : session
    ));
  };

  // ลบท่า
  const handleRemoveExercise = (exerciseId) => {
    setWorkoutSessions(workoutSessions.filter(s => s.exerciseId !== exerciseId));
    setSelectedExerciseIds(selectedExerciseIds.filter(id => id !== exerciseId));
  };

  // Timer
  React.useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // บันทึกผล
  const handleSave = () => {
    if (workoutSessions.length === 0) {
      alert('กรุณาเลือกท่าและบันทึกการฝึก');
      return;
    }

    const totalSets = workoutSessions.reduce((sum, s) => sum + s.sets.length, 0);
    const completedSets = workoutSessions.reduce(
      (sum, s) => sum + s.sets.filter(set => set.completed).length, 
      0
    );

    alert(`✅ บันทึกผลการฝึกสำเร็จ!\n\nโปรแกรม: ${selectedProgram.name}\nวันที่: ${trainingDate}\nท่าที่ฝึก: ${workoutSessions.length} ท่า\nเซตที่ทำ: ${completedSets}/${totalSets}\nเวลา: ${formatTime(timerSeconds)}`);

    // Reset
    setSelectedProgramId('');
    setSelectedProgram(null);
    setWorkoutSessions([]);
    setSelectedExerciseIds([]);
    setTimerSeconds(0);
    setIsTimerRunning(false);
  };

  // Filter exercises
  const filteredExercises = allExercises.filter(exercise => {
    // Search filter
    const matchesSearch = exercise.nameTH.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.nameEN.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.muscle.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Muscle filter
    const matchesMuscle = muscleFilter === 'ทั้งหมด' || exercise.muscle === muscleFilter;
    
    // Equipment filter (assuming exercises have equipment field)
    const matchesEquipment = equipmentFilter === 'ทั้งหมด' || 
      (exercise.equipment && exercise.equipment.includes(equipmentFilter));
    
    return matchesSearch && matchesMuscle && matchesEquipment;
  });

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          📝 บันทึกผลการฝึก
        </h3>

        {/* เลือกโปรแกรม */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            เลือกโปรแกรมการฝึก <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedProgramId}
            onChange={handleProgramSelect}
            className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
          >
            <option value="">-- เลือกโปรแกรม (แสดงเฉพาะที่อนุมัติแล้ว) --</option>
            {approvedPrograms.map(program => (
              <option key={program.id} value={program.id}>
                {program.name} - {program.trainee}
              </option>
            ))}
          </select>
        </div>

        {/* แสดงเมื่อเลือกโปรแกรมแล้ว */}
        {selectedProgram && (
          <>
            {/* ข้อมูลโปรแกรม + Timer */}
            <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold">{selectedProgram.trainee}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    <span>{selectedProgram.goal}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span className="text-2xl font-bold font-mono text-purple-700">
                    {formatTime(timerSeconds)}
                  </span>
                </div>
              </div>
            </div>

            {/* วันที่ + ปุ่มเพิ่มท่า */}
            <div className="mb-6 flex justify-between items-end">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  วันที่ฝึก
                </label>
                <input
                  type="date"
                  value={trainingDate}
                  onChange={(e) => setTrainingDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                onClick={handleOpenExerciseModal}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>เพิ่มท่าออกกำลังกาย</span>
              </button>
            </div>

            {/* รายการท่าที่เลือก */}
            {workoutSessions.length > 0 ? (
              <div className="space-y-4 mb-6">
                {workoutSessions.map(session => (
                  <div key={session.exerciseId} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    {/* หัวท่า */}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-gray-800 flex items-center space-x-2">
                          <span className="text-2xl">{session.icon}</span>
                          <span>{session.exerciseName}</span>
                        </h4>
                        <p className="text-sm text-gray-500">{session.exerciseNameEN}</p>
                        <p className="text-xs text-purple-600 mt-1">{session.muscle}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveExercise(session.exerciseId)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* ตารางเซต */}
                    <div className="space-y-2">
                      <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-gray-600 px-2">
                        <span>เซต</span>
                        <span className="text-center">kg</span>
                        <span className="text-center">ครั้ง</span>
                        <span className="text-center">✓</span>
                      </div>
                      {session.sets.map((set, idx) => (
                        <div key={idx} className="grid grid-cols-4 gap-2 items-center">
                          <span className="text-gray-700 font-semibold px-2">{set.setNumber}</span>
                          <input
                            type="number"
                            value={set.weight}
                            onChange={(e) => handleSetChange(session.exerciseId, set.setNumber, 'weight', e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-center"
                            placeholder="0"
                          />
                          <input
                            type="number"
                            value={set.reps}
                            onChange={(e) => handleSetChange(session.exerciseId, set.setNumber, 'reps', e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-center"
                            placeholder="0"
                          />
                          <div className="flex justify-center">
                            <button
                              onClick={() => handleSetChange(session.exerciseId, set.setNumber, 'completed', !set.completed)}
                              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                                set.completed
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-200 hover:bg-gray-300'
                              }`}
                            >
                              {set.completed && <Check className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* ปุ่มเพิ่มเซต */}
                    <button
                      onClick={() => handleAddSet(session.exerciseId)}
                      className="mt-3 w-full bg-white border-2 border-dashed border-gray-300 hover:border-purple-500 text-gray-600 hover:text-purple-600 py-2 rounded-lg flex items-center justify-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>เพิ่มเซต</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg mb-6">
                <Dumbbell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">กดปุ่ม "เพิ่มท่าออกกำลังกาย" เพื่อเริ่มบันทึก</p>
              </div>
            )}

            {/* ปุ่มบันทึก */}
            {workoutSessions.length > 0 && (
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setSelectedProgramId('');
                    setSelectedProgram(null);
                    setWorkoutSessions([]);
                    setTimerSeconds(0);
                    setIsTimerRunning(false);
                  }}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold flex items-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>ยกเลิก</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal เลือกท่า (แบบ FitFit) */}
      {isExerciseModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 text-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold">เพิ่มท่าออกกำลังกาย</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleConfirmExercises}
                  className="text-purple-400 hover:text-purple-300 font-semibold"
                >
                  เพิ่ม ({selectedExerciseIds.length})
                </button>
                <button
                  onClick={() => setIsExerciseModalOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-700">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ค้นหาท่าออกกำลังกาย"
                  className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              {/* Filter Dropdowns */}
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={muscleFilter}
                  onChange={(e) => setMuscleFilter(e.target.value)}
                  className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                >
                  {muscleFilterOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                
                <select
                  value={equipmentFilter}
                  onChange={(e) => setEquipmentFilter(e.target.value)}
                  className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                >
                  {equipmentFilterOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* รายการท่า */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {filteredExercises.map(exercise => {
                  const isSelected = selectedExerciseIds.includes(exercise.id);
                  return (
                    <button
                      key={exercise.id}
                      onClick={() => toggleExerciseSelection(exercise.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-purple-600'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">{exercise.icon}</span>
                        <div className="text-left">
                          <p className="font-semibold">{exercise.nameTH}</p>
                          <p className="text-sm text-gray-400">{exercise.nameEN}</p>
                          <p className="text-xs text-purple-400 mt-1">{exercise.muscle}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-black" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerResults;