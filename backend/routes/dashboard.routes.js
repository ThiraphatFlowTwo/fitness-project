const express = require("express");
const router = express.Router();
const { protect }     = require("../middleware/authMiddleware");
const Trainee         = require("../models/Trainee");
const TrainingProgram = require("../models/TrainingProgram");
const TrainingLog     = require("../models/TrainingLog");

const {
  getAdminSummary,
} = require("../controllers/dashboard.controller");

router.get("/admin-summary", protect, getAdminSummary);

// GET /api/dashboard/instructor
router.get("/instructor", protect, async (req, res) => {
  try {
    if (req.user.role !== "instructor" && req.user.role !== "admin")
      return res.status(403).json({ message: "ไม่มีสิทธิ์" });

    const User            = require("../models/User");
    const TrainingProgram = require("../models/TrainingProgram");
    const AcademicYear    = require("../models/academicYear.model");

    const [
      totalTrainers,
      totalPrograms,
      pendingPrograms,
      activeYear,
      recentPrograms,
    ] = await Promise.all([
      // เทรนเนอร์ทั้งหมด
      User.countDocuments({ role: "trainer", status: "active" }),

      // โปรแกรมทั้งหมด
      TrainingProgram.countDocuments(),

      // รออนุมัติ
      TrainingProgram.countDocuments({ status: "pending" }),

      // ปีการศึกษา active
      AcademicYear.findOne({ status: "active" }),

      // โปรแกรมล่าสุด 5 รายการ
      TrainingProgram.find({ status: "pending" })
        .populate("trainer_id", "name")
        .populate("trainee_id", "name")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    res.json({
      stats: { totalTrainers, totalPrograms, pendingPrograms, activeYear },
      recentPrograms,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/dashboard/trainer — ข้อมูล dashboard ของเทรนเนอร์
router.get("/trainer", protect, async (req, res) => {
  try {
    const trainerId = req.user.id;
    const today     = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow  = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalTrainees,
      totalPrograms,
      pendingApproval,
      todayLogs,
      recentLogs,
    ] = await Promise.all([
      // จำนวนลูกเทรนทั้งหมด
      Trainee.countDocuments({ user_id: trainerId }),

      // จำนวนโปรแกรมทั้งหมด
      TrainingProgram.countDocuments({ trainer_id: trainerId }),

      // โปรแกรมที่รออนุมัติ
      TrainingProgram.countDocuments({ trainer_id: trainerId, status: "pending" }),

      // บันทึกผลวันนี้
      TrainingLog.countDocuments({
        trainer_id:    trainerId,
        training_date: { $gte: today, $lt: tomorrow }
      }),

      // กิจกรรมล่าสุด 5 รายการ
      TrainingLog.find({ trainer_id: trainerId })
        .populate("trainee_id", "name")
        .populate("program_id", "program_name")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    res.json({
      stats: { totalTrainees, totalPrograms, pendingApproval, todayLogs },
      recentLogs,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;