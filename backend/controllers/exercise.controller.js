const Exercise = require("../models/exercise.model");

// CREATE
exports.createExercise = async (req, res) => {
  try {
    // คัดลอกข้อมูล text จาก req.body
    const data = { ...req.body };
    
    // ✅ ถ้ามีการอัปโหลดรูปภาพมาด้วย (Multer จะเอาข้อมูลไฟล์ไปใส่ใน req.file)
    if (req.file) {
      data.image = req.file.filename; // นำชื่อไฟล์ที่ได้ไปเก็บในฟิลด์ image
    }

    const exercise = await Exercise.create(data);
    res.json(exercise);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET ALL
exports.getExercises = async (req, res) => {
  try {
    const list = await Exercise.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updateExercise = async (req, res) => {
  try {
    const data = { ...req.body };

    // ✅ ถ้ามีการอัปโหลดไฟล์รูปภาพ "ใหม่" มาด้วย
    if (req.file) {
      data.image = req.file.filename;
    }

    const updated = await Exercise.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true } // ให้ส่งคืนข้อมูลที่อัปเดตแล้วกลับมา
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.deleteExercise = async (req, res) => {
  try {
    await Exercise.findByIdAndDelete(req.params.id);
    res.json({ message: "ลบเรียบร้อย" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};