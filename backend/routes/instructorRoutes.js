const express         = require("express");
const router          = express.Router();
const mongoose        = require("mongoose");
const { protect }     = require("../middleware/authMiddleware");
const User            = require("../models/User");
const Trainee         = require("../models/Trainee");
const TrainingProgram = require("../models/TrainingProgram");
const TrainingLog     = require("../models/TrainingLog");
const TrainingLogSet  = require("../models/TrainingLogSet");
const PhysicalFitness = require("../models/PhysicalFitness");
const Exercise        = require("../models/exercise.model"); // ✅ เพิ่ม

const instructorOnly = (req, res, next) => {
  if (!req.user || (req.user.role !== "instructor" && req.user.role !== "admin"))
    return res.status(403).json({ message: "ไม่มีสิทธิ์" });
  next();
};

const validId = (id) => mongoose.Types.ObjectId.isValid(id);

/* =========================
   GET TRAINERS
========================= */
router.get("/trainers", protect, instructorOnly, async (req, res) => {
  try {
    const trainers   = await User.find({ role: "trainer" })
      .select("-password")
      .sort({ created_at: -1 });

    const trainerIds = trainers.map(t => t._id);

    const [traineeCounts, programCounts] = await Promise.all([
      Trainee.aggregate([
        { $match: { user_id: { $in: trainerIds } } },
        { $group: { _id: "$user_id", count: { $sum: 1 } } },
      ]),
      TrainingProgram.aggregate([
        { $match: { trainer_id: { $in: trainerIds } } },
        { $group: { _id: "$trainer_id", count: { $sum: 1 } } },
      ]),
    ]);

    const traineeMap = Object.fromEntries(traineeCounts.map(x => [x._id.toString(), x.count]));
    const programMap = Object.fromEntries(programCounts.map(x => [x._id.toString(), x.count]));

    const result = trainers.map(trainer => ({
      ...trainer.toObject(),
      traineeCount: traineeMap[trainer._id.toString()] ?? 0,
      programCount: programMap[trainer._id.toString()] ?? 0,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   GET TRAINEES ของเทรนเนอร์
========================= */
router.get("/trainer/:trainerId/trainees", protect, instructorOnly, async (req, res) => {
  try {
    if (!validId(req.params.trainerId))
      return res.status(400).json({ message: "trainerId ไม่ถูกต้อง" });

    const trainees = await Trainee.find({ user_id: req.params.trainerId })
      .sort({ createdAt: -1 });
    res.json(trainees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   GET LOGS ของเทรนเนอร์
========================= */
router.get("/trainer/:trainerId/logs", protect, instructorOnly, async (req, res) => {
  try {
    if (!validId(req.params.trainerId))
      return res.status(400).json({ message: "trainerId ไม่ถูกต้อง" });

    const logs = await TrainingLog.find({ trainer_id: req.params.trainerId })
      .populate("program_id", "program_name status instructor_comment")
      .populate("trainee_id", "name")
      .sort({ training_date: -1 });

    const logIds  = logs.map(l => l._id);
    const allSets = await TrainingLogSet.find({ log_id: { $in: logIds } });

    const setsByLog = allSets.reduce((acc, s) => {
      const key = s.log_id.toString();
      (acc[key] ??= []).push(s);
      return acc;
    }, {});

    const result = logs.map(log => {
      const sets            = setsByLog[log._id.toString()] ?? [];
      const uniqueExercises = [...new Set(sets.map(s => s.exercise_id.toString()))];
      return {
        ...log.toObject(),
        exercise_count: uniqueExercises.length,
        set_count:      sets.length,
        completed_sets: sets.filter(s => s.completed).length,
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   GET LOG DETAIL ✅ เพิ่มใหม่
========================= */
router.get("/log/:logId", protect, instructorOnly, async (req, res) => {
  try {
    if (!validId(req.params.logId))
      return res.status(400).json({ message: "logId ไม่ถูกต้อง" });

    const log = await TrainingLog.findById(req.params.logId)
      .populate("program_id", "program_name status instructor_comment")
      .populate("trainee_id", "name")
      .populate("trainer_id", "name");

    if (!log)
      return res.status(404).json({ message: "ไม่พบข้อมูล log" });

    const sets = await TrainingLogSet.find({ log_id: log._id })
      .populate("exercise_id", "exercise_name exercise_type exercise_category")
      .sort({ order: 1, set_number: 1 });

    res.json({ ...log.toObject(), sets });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   GET FITNESS ของเทรนเนอร์
========================= */
router.get("/trainer/:trainerId/fitness", protect, instructorOnly, async (req, res) => {
  try {
    if (!validId(req.params.trainerId))
      return res.status(400).json({ message: "trainerId ไม่ถูกต้อง" });

    const trainees   = await Trainee.find({ user_id: req.params.trainerId }).select("_id");
    const traineeIds = trainees.map(t => t._id);

    const fitness = await PhysicalFitness.find({ trainee_id: { $in: traineeIds } })
      .populate("trainee_id", "name")
      .sort({ test_date: -1 });

    res.json(fitness);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;