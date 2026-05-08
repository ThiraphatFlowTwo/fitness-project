const Trainee = require("../models/Trainee");

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

// ดูลูกเทรนทั้งหมดของเทรนเนอร์ตัวเอง
exports.getMyTrainees = async (req, res) => {
  try {
    const trainerId = req.user.id || req.user._id;

    const trainees = await Trainee.find({ trainer: trainerId })
      .sort({ createdAt: -1 });

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