const Exercise = require("../models/exercise.model");

// CREATE
exports.createExercise = async (req, res) => {
  try {
    const data = {
      ...req.body,

      // ✅ ใช้ role จาก token/login
      ownerRole: req.user.role,
    };

    // ✅ ถ้ามีรูป
    if (req.file) {
      data.image = req.file.filename;
    }

    const exercise = await Exercise.create(data);

    res.json(exercise);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// GET ALL
exports.getExercises = async (req, res) => {
  try {
    const list = await Exercise.find();

    res.json(list);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// UPDATE
exports.updateExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        message: "ไม่พบท่าออกกำลังกาย",
      });
    }

    // ✅ trainer ห้ามแก้ของ admin
    if (req.user.role === "trainer" && exercise.ownerRole === "admin") {
      return res.status(403).json({
        message: "ไม่สามารถแก้ไขท่าของแอดมินได้",
      });
    }

    const data = {
      ...req.body,
    };

    // ✅ ถ้ามีรูปใหม่
    if (req.file) {
      data.image = req.file.filename;
    }

    const updated = await Exercise.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// DELETE
exports.deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        message: "ไม่พบท่าออกกำลังกาย",
      });
    }

    // ✅ trainer ห้ามลบของ admin
    if (req.user.role === "trainer" && exercise.ownerRole === "admin") {
      return res.status(403).json({
        message: "ไม่สามารถลบท่าของแอดมินได้",
      });
    }

    await Exercise.findByIdAndDelete(req.params.id);

    res.json({
      message: "ลบเรียบร้อย",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
