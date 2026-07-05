const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Trainer = require("../models/Trainer"); // ➕ นำเข้า Model Trainer เพิ่ม
const AcademicYear = require("../models/academicYear.model"); // ➕ นำเข้า Model ปีการศึกษาเพิ่ม
const { protect } = require("../middleware/authMiddleware");
const { createNotification } = require("../utils/notificationHelper");

/* =========================
    REGISTER (ล็อกสิทธิ์ Trainer + ผูกเทอม Active อัตโนมัติ)
========================= */
router.post("/register", async (req, res) => {
  try {
    // 🔒 ถอดการรับค่า role ออกจาก req.body เพื่อบังคับให้เป็นเทรนเนอร์ (นักศึกษา) เสมอจากหลังบ้าน
    const { username, email, password, name, student_id } = req.body;

    // 🔴 Validate ข้อมูลที่จำเป็น
    if (!username || !email || !password || !name || !student_id) {
      return res.status(400).json({
        message: "กรุณากรอกข้อมูลให้ครบทุกช่องรวมถึงรหัสนักศึกษา",
      });
    }

    // 🔴 เช็คซ้ำ username
    const existUser = await User.findOne({ username });
    if (existUser) {
      return res.status(400).json({ message: "Username นี้ถูกใช้งานแล้ว" });
    }

    // 🔴 เช็คซ้ำ email
    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({ message: "Email นี้ถูกใช้งานแล้ว" });
    }

    // 🔍 2. ค้นหาปีการศึกษาปัจจุบันที่เปิดใช้งานอยู่ (status: "active") เพื่อให้ข้อมูลตรงสเปกความต้องการ
    const activeYear = await AcademicYear.findOne({ status: "active" });
    if (!activeYear) {
      return res.status(400).json({
        message: "ไม่สามารถลงทะเบียนได้ในขณะนี้ เนื่องจากระบบยังไม่ได้เปิดใช้งานปีการศึกษาปัจจุบัน (แอดมินต้องเปิดสถานะ active ก่อน)",
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ⭐ 3. สร้าง User บัญชีเข้าสู่ระบบ (ผูกไอดีปีการศึกษาจริงที่เจอ)
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: "trainer",                 // 🔒 ล็อกบทบาทเทรนเนอร์โดยตรง
      name,
      status: "pending",               // รอการอนุมัติใช้งาน
      academic_year_id: activeYear._id // 🔗 ผูกปีการศึกษาตามลอจิกที่ถูกต้อง
    });

    await user.save();

    // ⚡ 4. สร้าง Profile ลงในตาราง Trainer พ่วงคู่กันไปทันที
    await Trainer.create({
      user_id: user._id,
      student_id,
      name,
      email,
      academic_year_id: activeYear._id // 🔗 ผูกปีการศึกษาเข้าหน้าประวัตินักศึกษาด้วย
    });

    // ✅ 5. ส่งการแจ้งเตือนหาแอดมินโดยใช้ helper เดิมของไฟล์นี้
    const admins = await User.find({ role: "admin", status: "active" }).select("_id");
    const yearText = `ประจำปีการศึกษา ${activeYear.academic_year}/${activeYear.semester}`;
    
    await Promise.all(admins.map(admin =>
      createNotification({
        recipient_id:   admin._id,
        recipient_role: "admin",
        type:           "user_pending",
        title:          "มีคำขอสมัครสมาชิกใหม่",
        message:        `คุณ ${name} ขอสมัครเป็น "เทรนเนอร์" ${yearText} รอการตรวจสอบและอนุมัติสิทธิ์`,
        ref_id:         user._id,
        ref_model:      "User",
      })
    ));

    res.status(201).json({
      message: "สมัครสมาชิกสำเร็จ รอแอดมินอนุมัติ",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        name: user.name,
        status: user.status,
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "ข้อมูลไม่ครบหรือรูปแบบไม่ถูกต้องตาม Schema",
        error: err.message,
      });
    }

    res.status(500).json({ message: "Server error: " + err.message });
  }
});

/* =========================
    LOGIN (เพิ่มการเช็คปีการศึกษาเก่า)
========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. ค้นหาผู้ใช้ และทำการดึงข้อมูล (populate) ปีการศึกษามาตรวจสอบพร้อมกัน
    const user = await User.findOne({ email }).populate("academic_year_id");
    if (!user) {
      return res.status(400).json({ message: "ไม่พบบัญชีผู้ใช้" });
    }

    // 2. เช็คว่าแอดมินอนุมัติสิทธิ์หรือยัง
    if (user.status !== "active") {
      return res.status(403).json({
        message: "บัญชีนี้ยังไม่ได้รับการอนุมัติจากผู้ดูแลระบบ",
      });
    }

    // 🔒 3. เช็คเงื่อนไขปีการศึกษาเก่า (เฉพาะบทบาทที่เป็น "trainer")
    // ถ้าผู้ใช้เป็นเทรนเนอร์ และไม่มีข้อมูลปีการศึกษา หรือปีการศึกษานั้นไม่ได้เปิดใช้งานอยู่ (ไม่ใช่ active)
    if (user.role === "trainer") {
      if (!user.academic_year_id || user.academic_year_id.status !== "active") {
        return res.status(403).json({
          message: "ไม่สามารถเข้าสู่ระบบได้ เนื่องจากบัญชีนี้ผูกอยู่กับปีการศึกษาที่สิ้นสุดการใช้งานไปแล้ว",
        });
      }
    }

    // 4. ตรวจสอบรหัสผ่าน
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "รหัสผ่านไม่ถูกต้อง" });
    }

    // 5. สร้าง Token สำหรับ Sign-in
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

/* =========================
    GET PROFILE
========================= */
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
    UPDATE PROFILE
========================= */
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, email } = req.body;

    const exist = await User.findOne({ email, _id: { $ne: req.user.id } });
    if (exist) return res.status(400).json({ message: "Email นี้ถูกใช้งานแล้ว" });

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    ).select("-password");

    res.json({ message: "อัปเดตโปรไฟล์สำเร็จ", user: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
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

    const salt           = await bcrypt.genSalt(10);
    user.password        = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "เปลี่ยนรหัสผ่านสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;