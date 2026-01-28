const Exercise = require("../models/exercise.model");

// CREATE
exports.createExercise = async (req, res) => {
  try {
    const exercise = await Exercise.create(req.body);
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
    const updated = await Exercise.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
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