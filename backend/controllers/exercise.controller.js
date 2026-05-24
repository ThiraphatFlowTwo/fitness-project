const Exercise = require("../models/exercise.model");

// ── CREATE ────────────────────────────────────────────────────
exports.createExercise = async (req, res) => {
  try {
    const data = {
      ...req.body,
      ownerRole:  req.user.role,
      created_by: req.user.id, // ← บันทึกคนสร้างอัตโนมัติ
    };
    if (req.file) data.image = req.file.filename;
    const exercise = await Exercise.create(data);
    res.json(exercise);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ── GET ALL ───────────────────────────────────────────────────
exports.getExercises = async (req, res) => {
  try {
    const list = await Exercise.find()
      .populate("created_by", "name role"); // ← populate ชื่อคนสร้าง
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── helper เช็คสิทธิ์ ─────────────────────────────────────────
const checkEditPermission = (exercise, user) => {
  if (user.role === "admin") return true; // admin แก้ได้ทุกท่า

  if (user.role === "trainer") {
    if (exercise.ownerRole === "admin") return false; // ห้ามแก้ของ admin
    if (!exercise.created_by) return true; // ท่าเก่าที่ยังไม่มี created_by
    return exercise.created_by.toString() === user.id; // เฉพาะเจ้าของ
  }

  return false;
};

// ── UPDATE ────────────────────────────────────────────────────
exports.updateExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) return res.status(404).json({ message: "ไม่พบท่าออกกำลังกาย" });

    if (!checkEditPermission(exercise, req.user)) {
      return res.status(403).json({
        message: exercise.ownerRole === "admin"
          ? "ไม่สามารถแก้ไขท่าของแอดมินได้"
          : "ไม่สามารถแก้ไขท่าของเทรนเนอร์คนอื่นได้"
      });
    }

    const data = { ...req.body };
    if (req.file) data.image = req.file.filename;

    const updated = await Exercise.findByIdAndUpdate(
      req.params.id, data, { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ── DELETE ────────────────────────────────────────────────────
exports.deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) return res.status(404).json({ message: "ไม่พบท่าออกกำลังกาย" });

    if (!checkEditPermission(exercise, req.user)) {
      return res.status(403).json({
        message: exercise.ownerRole === "admin"
          ? "ไม่สามารถลบท่าของแอดมินได้"
          : "ไม่สามารถลบท่าของเทรนเนอร์คนอื่นได้"
      });
    }

    await Exercise.findByIdAndDelete(req.params.id);
    res.json({ message: "ลบเรียบร้อย" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};