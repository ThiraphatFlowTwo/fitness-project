const Trainee = require("../models/Trainee");
const AcademicYear = require("../models/academicYear.model"); // 🔥 นำเข้า Model ปีการศึกษา
const TrainingProgram = require("../models/TrainingProgram"); // 🔥 นำเข้า Model โปรแกรมการฝึก

// เพิ่มลูกเทรน
exports.addTrainee = async (req, res) => {
  try {
    // ดึง trainerId จาก req.user (รองรับทั้ง id และ _id จาก JWT)
    const trainerId = req.user.id || req.user._id;

    const trainee = await Trainee.create({
      ...req.body,
      trainer: trainerId, 
    });

    res.status(201).json({ success: true, data: trainee });
  } catch (err) {
    // พ่น Error ลง Terminal เผื่อต้องดูรายละเอียดเพิ่มเติม
    console.error("Add Trainee Error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

// ── ดูลูกเทรนทั้งหมดของเทรนเนอร์ตัวเอง (เฉพาะที่มีการเคลื่อนไหวในภาคเรียนปัจจุบัน) ──
exports.getMyTrainees = async (req, res) => {
  try {
    const trainerId = req.user.id || req.user._id;

    // 1. หาภาคเรียนปัจจุบันที่แอดมินกำหนดสถานะเปิดใช้งาน (status: "active")
    const activeYear = await AcademicYear.findOne({ status: "active" });
    if (!activeYear) {
      return res.status(404).json({ success: false, message: "ไม่พบปีการศึกษาที่เปิดใช้งานในระบบ" });
    }

    // 2. ค้นหาโปรแกรมทั้งหมดของเทรนเนอร์คนนี้ที่เกิดขึ้นในเทอมปัจจุบัน เพื่อเอา id ของลูกเทรน
    const activePrograms = await TrainingProgram.find({
      trainer_id: trainerId,
      academic_year_id: activeYear._id
    }).select("trainee_id");

    // แปลงผลลัพธ์เป็น Array ของ ID
    const activeTraineeIds = activePrograms.map(p => p.trainee_id);

    // 3. ดึงข้อมูลลูกเทรนเฉพาะคนที่มีโปรแกรมผูกอยู่ในภาคเรียนนี้เท่านั้นมาแสดงบนหน้าเว็บ
    const trainees = await Trainee.find({ 
      _id: { $in: activeTraineeIds }, // 🔥 กรองเอาเฉพาะลูกเทรนที่แอคทีฟในเทอมปัจจุบัน
      trainer: trainerId 
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: trainees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// แก้ไขข้อมูลลูกเทรน
exports.updateTrainee = async (req, res) => {
  try {
    const trainerId = req.user.id || req.user._id;

    const trainee = await Trainee.findOneAndUpdate(
      { _id: req.params.id, trainer: trainerId },
      req.body,
      { new: true, runValidators: true } // เพิ่ม runValidators เพื่อเช็คความถูกต้องของข้อมูลใหม่
    );

    if (!trainee) return res.status(404).json({ message: "ไม่พบข้อมูลลูกเทรนคนนี้ในระบบของคุณ" });
    
    res.json({ success: true, data: trainee });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ลบลูกเทรน
exports.deleteTrainee = async (req, res) => {
  try {
    const trainerId = req.user.id || req.user._id;

    const trainee = await Trainee.findOneAndDelete({
      _id: req.params.id,
      trainer: trainerId,
    });

    if (!trainee) return res.status(404).json({ message: "ไม่พบข้อมูลลูกเทรนคนนี้ในระบบของคุณ" });

    res.json({ success: true, message: "ลบข้อมูลเรียบร้อยแล้ว" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};