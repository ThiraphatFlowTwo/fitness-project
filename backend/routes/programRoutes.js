const express         = require("express");
const router          = express.Router();
const TrainingProgram = require("../models/TrainingProgram");
const ProgramExercise = require("../models/ProgramExercise");
const AcademicYear    = require("../models/academicYear.model");
const User            = require("../models/User");
const jwt             = require("jsonwebtoken");
const { createNotification } = require("../utils/notificationHelper");

// ── Middleware ────────────────────────────────────────────────
const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "ไม่มี token" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
    req.userId = decoded.id;
    req.role   = decoded.role;
    next();
  } catch {
    res.status(401).json({ message: "token ไม่ถูกต้อง" });
  }
};

// ── GET /api/programs/active-year — ดึงปีการศึกษา active ────────
router.get("/active-year", auth, async (req, res) => {
  try {
    const activeYear = await AcademicYear.findOne({ status: "active" });
    if (!activeYear) return res.status(404).json({ message: "ไม่พบปีการศึกษาที่ใช้งานอยู่" });
    res.json(activeYear);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── [แก้ไขแล้ว] GET /api/programs/instructor/all — อาจารย์ดูและสามารถส่งไอดีปีการศึกษามากรองข้อมูลได้ ──
router.get("/instructor/all", auth, async (req, res) => {
  try {
    if (req.role !== "instructor" && req.role !== "admin")
      return res.status(403).json({ message: "ไม่มีสิทธิ์" });

    // 🔥 รับค่ากรองสถานะงาน และ ไอดีปีการศึกษาจาก Frontend (เช่น ?status=pending&academicYearId=660c...)
    const { status, academicYearId } = req.query;
    
    let filter = {};

    if (academicYearId) {
      // 1. ถ้าอาจารย์กดเลือกปีเก่าๆ จาก Dropdown หน้าระบบ ให้กรองเอาเฉพาะปีการศึกษานั้นมาโชว์
      filter.academic_year_id = academicYearId;
    } else {
      // 2. ถ้าอาจารย์เปิดหน้าเว็บมาครั้งแรก (ไม่ได้เลือกอะไรมา) บังคับแสดงเฉพาะเทอมปัจจุบัน (active) ก่อน
      const activeYear = await AcademicYear.findOne({ status: "active" });
      if (activeYear) {
        filter.academic_year_id = activeYear._id;
      }
    }

    if (status) {
      filter.status = status;
    }

    const programs = await TrainingProgram.find(filter)
      // populate ข้อมูลเทรนเนอร์เพิ่มเพื่อให้รู้ว่าเด็กคนนี้ผูกกับปีไหน
      .populate({
        path: "trainer_id",
        select: "name email academic_year_id",
        populate: { path: "academic_year_id", select: "academic_year semester" }
      })
      .populate("trainee_id",       "name goal")
      .populate("academic_year_id", "academic_year semester")
      .sort({ createdAt: -1 });

    const result = await Promise.all(programs.map(async (p) => {
      const exercises = await ProgramExercise.find({ program_id: p._id })
        .populate("exercise_id", "exercise_name exercise_type equipment_type exercise_category")
        .sort({ order: 1 });
      return { ...p.toObject(), exercises };
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/programs — ดึงโปรแกรมของเทรนเนอร์ตัวเอง (เฉพาะภาคเรียนปัจจุบัน) ──
router.get("/", auth, async (req, res) => {
  try {
    const activeYear = await AcademicYear.findOne({ status: "active" });
    if (!activeYear) return res.status(404).json({ message: "ไม่พบปีการศึกษาที่เปิดใช้งานในระบบ" });

    const programs = await TrainingProgram.find({ 
      trainer_id: req.userId,
      academic_year_id: activeYear._id 
    })
      .populate("trainee_id",       "name goal")
      .populate("academic_year_id", "academic_year semester")
      .sort({ createdAt: -1 });

    const result = await Promise.all(programs.map(async (p) => {
      const exercises = await ProgramExercise.find({ program_id: p._id })
        .populate("exercise_id", "exercise_name exercise_type equipment_type exercise_category")
        .sort({ order: 1 });
      return { ...p.toObject(), exercises };
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/programs — สร้างโปรแกรมใหม่ ─────────────────────
router.post("/", auth, async (req, res) => {
  try {
    const { program_name, trainee_id, exercises } = req.body;

    const activeYear = await AcademicYear.findOne({ status: "active" });
    if (!activeYear) return res.status(400).json({ message: "ไม่พบปีการศึกษาที่ใช้งานอยู่ กรุณาตั้งค่าปีการศึกษาก่อน" });

    const program = new TrainingProgram({
      trainer_id:       req.userId,
      trainee_id,
      academic_year_id: activeYear._id,
      program_name,
      status:           "draft"
    });
    const saved = await program.save();

    if (exercises && exercises.length > 0) {
      const exerciseDocs = exercises.map((ex, index) => ({
        program_id:  saved._id,
        exercise_id: ex.exercise_id,
        order:       ex.order ?? index + 1,
        sets:        ex.sets,
        reps:        ex.reps,
        rpe:         ex.rpe
      }));
      await ProgramExercise.insertMany(exerciseDocs);
    }

    const populated = await TrainingProgram.findById(saved._id)
      .populate("trainee_id",       "name goal")
      .populate("academic_year_id", "academic_year semester");
    const exList = await ProgramExercise.find({ program_id: saved._id })
      .populate("exercise_id", "exercise_name exercise_type equipment_type exercise_category")
      .sort({ order: 1 });

    res.status(201).json({ ...populated.toObject(), exercises: exList });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── PUT /api/programs/:id — แก้ไขโปรแกรม ─────────────────────
router.put("/:id", auth, async (req, res) => {
  try {
    const program = await TrainingProgram.findOne({ _id: req.params.id, trainer_id: req.userId });
    if (!program)                      return res.status(404).json({ message: "ไม่พบโปรแกรม" });
    if (program.status === "approved") return res.status(400).json({ message: "ไม่สามารถแก้ไขโปรแกรมที่อนุมัติแล้วได้" });
    if (program.status === "pending")  return res.status(400).json({ message: "ไม่สามารถแก้ไขโปรแกรมที่รออนุมัติอยู่ได้" });

    const { program_name, trainee_id, exercises } = req.body;

    await TrainingProgram.findByIdAndUpdate(req.params.id, { program_name, trainee_id });

    if (exercises && exercises.length > 0) {
      await ProgramExercise.deleteMany({ program_id: req.params.id });
      const exerciseDocs = exercises.map((ex, index) => ({
        program_id:  req.params.id,
        exercise_id: ex.exercise_id,
        order:       ex.order ?? index + 1,
        sets:        ex.sets,
        reps:        ex.reps,
        rpe:         ex.rpe
      }));
      await ProgramExercise.insertMany(exerciseDocs);
    }

    const updated = await TrainingProgram.findById(req.params.id)
      .populate("trainee_id",       "name goal")
      .populate("academic_year_id", "academic_year semester");
    const exList = await ProgramExercise.find({ program_id: req.params.id })
      .populate("exercise_id", "exercise_name exercise_type equipment_type exercise_category")
      .sort({ order: 1 });

    res.json({ ...updated.toObject(), exercises: exList });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── DELETE /api/programs/:id — ลบโปรแกรม ─────────────────────
router.delete("/:id", auth, async (req, res) => {
  try {
    const program = await TrainingProgram.findOne({ _id: req.params.id, trainer_id: req.userId });
    if (!program)                      return res.status(404).json({ message: "ไม่พบโปรแกรม" });
    if (program.status === "approved") return res.status(400).json({ message: "ไม่สามารถลบโปรแกรมที่อนุมัติแล้วได้" });
    if (program.status === "pending")  return res.status(400).json({ message: "ไม่สามารถลบโปรแกรมที่รออนุมัติอยู่ได้" });

    await TrainingProgram.findByIdAndDelete(req.params.id);
    await ProgramExercise.deleteMany({ program_id: req.params.id }); 
    res.json({ message: "ลบสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PATCH /api/programs/:id/submit — ส่งให้อาจารย์ ───────────
router.patch("/:id/submit", auth, async (req, res) => {
  try {
    const program = await TrainingProgram.findOne({ _id: req.params.id, trainer_id: req.userId });
    if (!program) return res.status(404).json({ message: "ไม่พบโปรแกรม" });
    if (program.status !== "draft" && program.status !== "rejected")
      return res.status(400).json({ message: "ส่งได้เฉพาะแบบร่างหรือที่ถูกปฏิเสธ" });

    program.status = "pending";
    program.instructor_comment = "";
    await program.save();

    const instructors = await User.find({ role: "instructor", status: "active" }).select("_id");
    const trainerUser = await User.findById(req.userId).select("name");
    await Promise.all(instructors.map(inst =>
      createNotification({
        recipient_id:   inst._id,
        recipient_role: "instructor",
        type:           "program_submitted",
        title:          "โปรแกรมใหม่รออนุมัติ",
        message:        `เทรนเนอร์ ${trainerUser?.name ?? ""} ได้ส่งโปรแกรม "${program.program_name}" ให้ตรวจสอบแล้ว`,
        ref_id:         program._id,
        ref_model:      "TrainingProgram",
      })
    ));

    res.json(program);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /api/programs/:id/cancel — ยกเลิกการส่ง
router.patch("/:id/cancel", auth, async (req, res) => {
  try {
    const program = await TrainingProgram.findOne({ _id: req.params.id, trainer_id: req.userId });
    if (!program) return res.status(404).json({ message: "ไม่พบโปรแกรม" });
    if (program.status !== "pending")
      return res.status(400).json({ message: "ยกเลิกได้เฉพาะโปรแกรมที่รออนุมัติอยู่เท่านั้น" });

    program.status = "draft";
    await program.save();

    const Notification = require("../models/Notification");
    await Notification.deleteMany({
      type:      "program_submitted",
      ref_id:    program._id,
      ref_model: "TrainingProgram",
    });

    res.json(program);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── PATCH /api/programs/:id/approve — อาจารย์อนุมัติ ─────────
router.patch("/:id/approve", auth, async (req, res) => {
  try {
    if (req.role !== "instructor" && req.role !== "admin")
      return res.status(403).json({ message: "ไม่มีสิทธิ์" });

    const updated = await TrainingProgram.findByIdAndUpdate(
      req.params.id,
      { status: "approved", instructor_comment: req.body.comment || "" },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "ไม่พบโปรแกรม" });

    const instructorUser = await User.findById(req.userId).select("name");
    await createNotification({
      recipient_id:   updated.trainer_id,
      recipient_role: "trainer",
      type:           "program_approved",
      title:          "โปรแกรมได้รับการอนุมัติ ✅",
      message:        `อาจารย์ ${instructorUser?.name ?? ""} ได้อนุมัติโปรแกรม "${updated.program_name}" ของคุณแล้ว`,
      ref_id:         updated._id,
      ref_model:      "TrainingProgram",
    });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── PATCH /api/programs/:id/reject — อาจารย์ปฏิเสธ ──────────
router.patch("/:id/reject", auth, async (req, res) => {
  try {
    if (req.role !== "instructor" && req.role !== "admin")
      return res.status(403).json({ message: "ไม่มีสิทธิ์" });

    const updated = await TrainingProgram.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", instructor_comment: req.body.comment || "" },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "ไม่พบโปรแกรม" });

    const instructorUser = await User.findById(req.userId).select("name");
    await createNotification({
      recipient_id:   updated.trainer_id,
      recipient_role: "trainer",
      type:           "program_rejected",
      title:          "โปรแกรมถูกส่งกลับให้แก้ไข",
      message:        `อาจารย์ ${instructorUser?.name ?? ""} ได้ส่งโปรแกรม "${updated.program_name}" กลับให้แก้ไข${req.body.comment ? `: ${req.body.comment}` : ""}`,
      ref_id:         updated._id,
      ref_model:      "TrainingProgram",
    });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// [คงไว้กันพัง] ── GET /api/programs/pending — อาจารย์ดูรออนุมัติ สามารถส่งปีการศึกษามากรองได้แบบเดียวกับด้านบน ──
router.get("/pending", auth, async (req, res) => {
  try {
    if (req.role !== "instructor" && req.role !== "admin")
      return res.status(403).json({ message: "ไม่มีสิทธิ์" });

    const { academicYearId } = req.query;
    let filter = { status: "pending" };

    if (academicYearId) {
      filter.academic_year_id = academicYearId;
    } else {
      const activeYear = await AcademicYear.findOne({ status: "active" });
      if (activeYear) filter.academic_year_id = activeYear._id;
    }

    const programs = await TrainingProgram.find(filter)
      .populate("trainer_id",       "name email")
      .populate("trainee_id",       "name goal")
      .populate("academic_year_id", "academic_year semester")
      .sort({ createdAt: -1 });

    const result = await Promise.all(programs.map(async (p) => {
      const exercises = await ProgramExercise.find({ program_id: p._id })
        .populate("exercise_id", "exercise_name exercise_type equipment_type exercise_category")
        .sort({ order: 1 });
      return { ...p.toObject(), exercises };
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;