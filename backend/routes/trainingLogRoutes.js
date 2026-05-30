const express = require("express");
const router = express.Router();
const TrainingLog = require("../models/TrainingLog");
const TrainingLogSet = require("../models/TrainingLogSet");
const TrainingProgram = require("../models/TrainingProgram");
const ProgramExercise = require("../models/ProgramExercise");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { createNotification } = require("../utils/notificationHelper");

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "ไม่มี token" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
    req.userId = decoded.id;
    req.role = decoded.role;
    next();
  } catch {
    res.status(401).json({ message: "token ไม่ถูกต้อง" });
  }
};

// GET /api/logs/approved-programs — ดึงโปรแกรมที่อนุมัติแล้วของเทรนเนอร์
router.get("/approved-programs", auth, async (req, res) => {
  try {
    const programs = await TrainingProgram.find({
      trainer_id: req.userId,
      status: "approved",
    })
      .populate("trainee_id", "name goal")
      .populate("academic_year_id", "academic_year semester")
      .sort({ createdAt: -1 });

    // ดึง exercises ของแต่ละโปรแกรม
    const result = await Promise.all(
      programs.map(async (p) => {
        const exercises = await ProgramExercise.find({ program_id: p._id })
          .populate(
            "exercise_id",
            "exercise_name exercise_type equipment_type exercise_category",
          )
          .sort({ order: 1 });
        return { ...p.toObject(), exercises };
      }),
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/logs — ดึงประวัติการฝึกทั้งหมดของเทรนเนอร์
router.get("/", auth, async (req, res) => {
  try {
    const logs = await TrainingLog.find({ trainer_id: req.userId })
      .populate("program_id", "program_name")
      .populate("trainee_id", "name")
      .sort({ training_date: -1 });

    const result = await Promise.all(
      logs.map(async (log) => {
        const sets = await TrainingLogSet.find({ log_id: log._id })
          .populate(
            "exercise_id",
            "exercise_name exercise_type equipment_type exercise_category",
          )
          .sort({ order: 1, set_number: 1 });
        return { ...log.toObject(), sets };
      }),
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/logs/:id — ดึง log เดียว
router.get("/:id", auth, async (req, res) => {
  try {
    const log = await TrainingLog.findOne({
      _id: req.params.id,
      trainer_id: req.userId,
    })
      .populate("program_id", "program_name")
      .populate("trainee_id", "name goal");
    if (!log) return res.status(404).json({ message: "ไม่พบข้อมูล" });

    const sets = await TrainingLogSet.find({ log_id: log._id })
      .populate(
        "exercise_id",
        "exercise_name exercise_type equipment_type exercise_category",
      )
      .sort({ order: 1, set_number: 1 });

    res.json({ ...log.toObject(), sets });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/logs/by-trainee/:traineeId — ดึง log ของลูกเทรนคนนี้
router.get("/by-trainee/:traineeId", auth, async (req, res) => {
  try {
    const logs = await TrainingLog.find({
      trainer_id: req.userId,
      trainee_id: req.params.traineeId,
    })
      .populate("program_id", "program_name")
      .sort({ training_date: -1 });

    const result = await Promise.all(
      logs.map(async (log) => {
        const sets = await TrainingLogSet.find({ log_id: log._id });
        // นับจำนวนท่า (unique exercise)
        const uniqueExercises = [
          ...new Set(sets.map((s) => s.exercise_id.toString())),
        ];
        return {
          ...log.toObject(),
          exercise_count: uniqueExercises.length,
          set_count: sets.length,
          completed_sets: sets.filter((s) => s.completed).length,
        };
      }),
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/logs — บันทึกผลการฝึก
router.post("/", auth, async (req, res) => {
  try {
    const { program_id, trainee_id, training_date, duration, note, sets } =
      req.body;

    // สร้าง log หลัก
    const log = new TrainingLog({
      program_id,
      trainee_id,
      trainer_id: req.userId,
      training_date,
      duration,
      note,
    });
    const savedLog = await log.save();

    // บันทึก sets ทั้งหมด
    if (sets && sets.length > 0) {
      const setDocs = sets.map((s) => ({
        log_id: savedLog._id,
        exercise_id: s.exercise_id,
        order: s.order,
        set_number: s.set_number,
        weight: s.weight || null,
        reps: s.reps || null,
        rpe: s.rpe || null,
        completed: s.completed || false,
        note: s.note || "",
      }));
      await TrainingLogSet.insertMany(setDocs);
    }

    // ✅ แจ้งเตือนอาจารย์ทุกคนว่ามี log ใหม่
    const trainerUser = await User.findById(req.userId).select("name");
    const instructors = await User.find({ role: "instructor", status: "active" }).select("_id");
    await Promise.all(instructors.map(inst =>
      createNotification({
        recipient_id:   inst._id,
        recipient_role: "instructor",
        type:           "training_log_new",
        title:          "มีการบันทึกผลการฝึกใหม่",
        message:        `เทรนเนอร์ ${trainerUser?.name ?? ""} ได้บันทึกผลการฝึกประจำวันแล้ว`,
        ref_id:         savedLog._id,
        ref_model:      "TrainingLog",
      })
    ));

    res.status(201).json({ message: "บันทึกสำเร็จ", log_id: savedLog._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/logs/:id — ลบ log
router.delete("/:id", auth, async (req, res) => {
  try {
    const log = await TrainingLog.findOne({
      _id: req.params.id,
      trainer_id: req.userId,
    });
    if (!log) return res.status(404).json({ message: "ไม่พบข้อมูล" });

    await TrainingLog.findByIdAndDelete(req.params.id);
    await TrainingLogSet.deleteMany({ log_id: req.params.id });
    res.json({ message: "ลบสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;