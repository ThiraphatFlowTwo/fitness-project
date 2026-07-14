const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Trainer = require("../models/Trainer"); 
const AcademicYear = require("../models/academicYear.model"); 
const { protect } = require("../middleware/authMiddleware");
const { createNotification } = require("../utils/notificationHelper");

// ➕ นำเข้า Controller เข้ามาใช้งานร่วมกัน
const authController = require("../controllers/authController"); 

/* =========================================================================
   ➕ GET INSTRUCTORS — ดึงรายชื่ออาจารย์ทั้งหมดในระบบเพื่อกางลง Dropdown หน้าบ้าน
   ========================================================================= */
router.get("/instructors", async (req, res) => {
  try {
    const instructors = await User.find({ role: "instructor", status: "active" })
      .select("_id name email")
      .sort({ name: 1 });
    res.json({ success: true, data: instructors });
  } catch (err) {
    console.error("GET INSTRUCTORS ERROR:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

/* =========================================================================
   📝 REGISTER — เรียกใช้งานผ่าน authController โดยตรงเพื่อหลีกเลี่ยง Logic ซ้ำซ้อน
   ========================================================================= */
router.post("/register", authController.register); // 👈 เปลี่ยนมาเรียกใช้ Controller ตรงนี้เพื่อความถูกต้องในการแยก Role

/* =========================================================================
   📝 LOGIN — เรียกใช้งานผ่าน authController โดยตรง
   ========================================================================= */
router.post("/login", authController.login); // 👈 เปลี่ยนมาเรียกใช้ Controller ตรงนี้

/* =========================
   GET PROFILE
========================= */
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").populate("advisor_id", "name email");
    if (!user) return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================================================================
   📝 [แก้ไขใหม่] UPDATE PROFILE
   ========================================================================= */
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, email, advisor_id } = req.body;

    const exist = await User.findOne({ email, _id: { $ne: req.user.id } });
    if (exist) return res.status(400).json({ message: "Email นี้ถูกใช้งานแล้ว" });

    const updateData = { name, email };
    
    if (advisor_id !== undefined) {
      updateData.advisor_id = advisor_id || null;
    }

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select("-password");

    res.json({ message: "อัปเดตโปรไฟล์สำเร็จ", user: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

/* =========================
   CHANGE PASSWORD
========================= */
router.put("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "รหัสผ่านปัจจุบันไม่ถูกต้อง" });

    if (newPassword.length < 6)
      return res.status(400).json({ message: "รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "เปลี่ยนรหัสผ่านสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;