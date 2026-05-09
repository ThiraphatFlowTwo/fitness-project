const Trainee = require("../models/Trainee");

exports.addTrainee = async (req, res) => {
  try {
    const trainee = await Trainee.create({
      ...req.body,
      trainer: req.user.userId, // ✅ เปลี่ยนจาก _id → userId
    });
    res.status(201).json({ success: true, data: trainee });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getMyTrainees = async (req, res) => {
  try {
    const trainees = await Trainee.find({ trainer: req.user.userId }) // ✅
      .sort({ createdAt: -1 });
    res.json({ success: true, data: trainees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateTrainee = async (req, res) => {
  try {
    const trainee = await Trainee.findOneAndUpdate(
      { _id: req.params.id, trainer: req.user.userId }, // ✅
      req.body,
      { new: true }
    );
    if (!trainee) return res.status(404).json({ message: "ไม่พบข้อมูล" });
    res.json({ success: true, data: trainee });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteTrainee = async (req, res) => {
  try {
    const trainee = await Trainee.findOneAndDelete({
      _id: req.params.id,
      trainer: req.user.userId, // ✅
    });
    if (!trainee) return res.status(404).json({ message: "ไม่พบข้อมูล" });
    res.json({ success: true, message: "ลบข้อมูลแล้ว" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};