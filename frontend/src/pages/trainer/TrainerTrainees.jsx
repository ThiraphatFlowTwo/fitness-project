import React, { useState, useEffect } from 'react';
import { UserPlus, Eye, Edit, Trash2, X, Save, Loader2, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const TrainerTrainees = () => {
  const [trainees, setTrainees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedTrainee, setSelectedTrainee] = useState(null);

  const emptyForm = {
    name: '', gender: 'ชาย', age: '',
    weight: '', height: '',
    goal: 'เพิ่มมวลกล้ามเนื้อ',
    bmi: '', bodyFat: '', healthCondition: ''
  };
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => { fetchTrainees(); }, []);

  const fetchTrainees = async () => {
    try {
      setLoading(true); setError('');
      const res = await api.get('/trainees');
      setTrainees(res.data.data || []);
    } catch (err) {
      setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
    } finally { setLoading(false); }
  };

  const getGoalColor = (goal) => ({ 'เพิ่มมวลกล้ามเนื้อ': 'green', 'คาร์ดิโอ': 'blue', 'เพิ่มความแข็งแรง': 'purple', 'ลดไขมัน': 'orange' }[goal] || 'gray');

  const handleAdd = () => { setModalMode('add'); setFormData(emptyForm); setIsModalOpen(true); };
  const handleView = (t) => { setModalMode('view'); setSelectedTrainee(t); setFormData(t); setIsModalOpen(true); };
  const handleEdit = (t) => { setModalMode('edit'); setSelectedTrainee(t); setFormData(t); setIsModalOpen(true); };

  const handleDelete = async (id) => {
    if (!window.confirm('คุณต้องการลบผู้รับการฝึกนี้ใช่หรือไม่?')) return;
    try { await api.delete(`/trainees/${id}`); setTrainees(trainees.filter(t => t._id !== id)); }
    catch { alert('ลบข้อมูลไม่สำเร็จ'); }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.age) { alert('กรุณากรอกชื่อ และ อายุ'); return; }
    setSaving(true);
    try {
      if (modalMode === 'add') {
        const res = await api.post('/trainees', formData);
        setTrainees([...trainees, res.data.data]);
      } else {
        const res = await api.put(`/trainees/${selectedTrainee._id}`, formData);
        setTrainees(trainees.map(t => t._id === selectedTrainee._id ? res.data.data : t));
      }
      setIsModalOpen(false);
    } catch (err) {
      const msg = err.response?.data?.message || (modalMode === 'add' ? 'เพิ่มข้อมูลไม่สำเร็จ' : 'แก้ไขข้อมูลไม่สำเร็จ');
      alert(msg);
    } finally { setSaving(false); }
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const inputClass = (disabled) => `w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${disabled ? 'bg-gray-100' : ''}`;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-md">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">จัดการข้อมูลผู้รับการฝึก</h3>
          <button onClick={handleAdd} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <UserPlus className="w-5 h-5" /><span>เพิ่มผู้รับการฝึก</span>
          </button>
        </div>
        <div className="p-6">
          {error && (
            <div className="mb-4 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="text-sm">{error}</span>
              <button onClick={fetchTrainees} className="ml-auto text-sm underline">ลองใหม่</button>
            </div>
          )}
          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /><span>กำลังโหลดข้อมูล...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['ชื่อ-นามสกุล','เพศ','อายุ','น้ำหนัก/ส่วนสูง','เป้าหมาย','BMI','การจัดการ'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {trainees.length === 0 ? (
                    <tr><td colSpan={7} className="px-6 py-16 text-center text-gray-400">ยังไม่มีผู้รับการฝึก กดปุ่ม "เพิ่มผู้รับการฝึก" เพื่อเริ่มต้น</td></tr>
                  ) : trainees.map((trainee) => (
                    <tr key={trainee._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-semibold">{trainee.name?.charAt(0)}</span>
                          </div>
                          <span className="font-medium text-gray-800">{trainee.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{trainee.gender}</td>
                      <td className="px-6 py-4 text-gray-600">{trainee.age} ปี</td>
                      <td className="px-6 py-4 text-gray-600">{trainee.weight ? `${trainee.weight} kg` : '-'} / {trainee.height ? `${trainee.height} cm` : '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 bg-${getGoalColor(trainee.goal)}-100 text-${getGoalColor(trainee.goal)}-800 rounded-full text-sm`}>{trainee.goal}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{trainee.bmi || '-'}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button onClick={() => handleView(trainee)} className="text-blue-600 hover:text-blue-800" title="ดูรายละเอียด"><Eye className="w-5 h-5" /></button>
                          <button onClick={() => handleEdit(trainee)} className="text-green-600 hover:text-green-800" title="แก้ไข"><Edit className="w-5 h-5" /></button>
                          <button onClick={() => handleDelete(trainee._id)} className="text-red-600 hover:text-red-800" title="ลบ"><Trash2 className="w-5 h-5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-800">
                {modalMode === 'add' && 'เพิ่มผู้รับการฝึกใหม่'}
                {modalMode === 'edit' && 'แก้ไขข้อมูลผู้รับการฝึก'}
                {modalMode === 'view' && 'รายละเอียดผู้รับการฝึก'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* ชื่อ + เพศ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อ-นามสกุล <span className="text-red-500">*</span></label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} disabled={modalMode === 'view'} className={inputClass(modalMode === 'view')} placeholder="เช่น สมชาย ใจดี" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">เพศ</label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange} disabled={modalMode === 'view'} className={inputClass(modalMode === 'view')}>
                    <option value="ชาย">ชาย</option>
                    <option value="หญิง">หญิง</option>
                  </select>
                </div>
              </div>
              {/* อายุ + เป้าหมาย */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">อายุ <span className="text-red-500">*</span></label>
                  <input type="number" name="age" value={formData.age} onChange={handleInputChange} disabled={modalMode === 'view'} className={inputClass(modalMode === 'view')} placeholder="เช่น 25" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">เป้าหมายการฝึก</label>
                  <select name="goal" value={formData.goal} onChange={handleInputChange} disabled={modalMode === 'view'} className={inputClass(modalMode === 'view')}>
                    <option value="เพิ่มมวลกล้ามเนื้อ">เพิ่มมวลกล้ามเนื้อ</option>
                    <option value="ลดไขมัน">ลดไขมัน</option>
                    <option value="คาร์ดิโอ">คาร์ดิโอ</option>
                    <option value="เพิ่มความแข็งแรง">เพิ่มความแข็งแรง</option>
                  </select>
                </div>
              </div>
              {/* น้ำหนัก + ส่วนสูง */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">น้ำหนัก (kg)</label>
                  <input type="number" step="0.1" name="weight" value={formData.weight} onChange={handleInputChange} disabled={modalMode === 'view'} className={inputClass(modalMode === 'view')} placeholder="เช่น 65" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ส่วนสูง (cm)</label>
                  <input type="number" step="0.1" name="height" value={formData.height} onChange={handleInputChange} disabled={modalMode === 'view'} className={inputClass(modalMode === 'view')} placeholder="เช่น 170" />
                </div>
              </div>
              {/* BMI + ไขมัน */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">BMI</label>
                  <input type="number" step="0.1" name="bmi" value={formData.bmi} onChange={handleInputChange} disabled={modalMode === 'view'} className={inputClass(modalMode === 'view')} placeholder="เช่น 22.5" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">% ไขมัน</label>
                  <input type="number" step="0.1" name="bodyFat" value={formData.bodyFat} onChange={handleInputChange} disabled={modalMode === 'view'} className={inputClass(modalMode === 'view')} placeholder="เช่น 18.2" />
                </div>
              </div>
              {/* สุขภาพ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ข้อมูลสุขภาพพื้นฐาน</label>
                <textarea name="healthCondition" value={formData.healthCondition} onChange={handleInputChange} disabled={modalMode === 'view'} rows="3"
                  className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${modalMode === 'view' ? 'bg-gray-100' : ''}`}
                  placeholder="เช่น โรคประจำตัว ประวัติการบาดเจ็บ ข้อจำกัดในการออกกำลังกาย..." />
              </div>
              <div className="flex space-x-3 pt-4 border-t">
                {modalMode !== 'view' && (
                  <button onClick={handleSave} disabled={saving}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors">
                    {saving ? <><Loader2 className="w-5 h-5 animate-spin" /><span>กำลังบันทึก...</span></> : <><Save className="w-5 h-5" /><span>บันทึก</span></>}
                  </button>
                )}
                <button onClick={() => setIsModalOpen(false)} className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-colors">
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