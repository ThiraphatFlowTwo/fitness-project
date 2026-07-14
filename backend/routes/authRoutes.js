const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Trainer = require("../models/Trainer"); 
const AcademicYear = require("../models/academicYear.model"); 
const { protect } = require("../middleware/authMiddleware");
const { createNotification } = require("../utils/notificationHelper");

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
   📝 [แก้ไขใหม่] REGISTER (ไม่ต้องเลือกอาจารย์ตอนสมัคร ปล่อยให้สมัครปกติเหมือนเดิม)
   ========================================================================= */
router.post("/register", async (req, res) => {
  try {
    // 🔓 ถอด advisor_id ออกจากขั้นตอนนี้
    const { username, email, password, name, student_id } = req.body;

    // 🔴 Validate เฉพาะข้อมูลเบื้องต้น
    if (!username || !email || !password || !name || !student_id) {
      return res.status(400).json({
        message: "กรุณากรอกข้อมูลให้ครบทุกช่องรวมถึงรหัสนักศึกษา",
      });
    }

    const existUser = await User.findOne({ username });
    if (existUser) return res.status(400).json({ message: "Username นี้ถูกใช้งานแล้ว" });

    const existEmail = await User.findOne({ email });
    if (existEmail) return res.status(400).json({ message: "Email นี้ถูกใช้งานแล้ว" });

    const activeYear = await AcademicYear.findOne({ status: "active" });
    if (!activeYear) {
      return res.status(400).json({
        message: "ไม่สามารถลงทะเบียนได้เนื่องจากระบบยังไม่ได้เปิดใช้งานปีการศึกษาปัจจุบัน",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // สร้าง User โดยที่ advisor_id จะยังไม่มีค่า (เป็น undefined หรือไม่ส่งไป)
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: "trainer",
      name,
      status: "pending",
      academic_year_id: activeYear._id
    });

    await user.save();

    await Trainer.create({
      user_id: user._id,
      student_id,
      name,
      email,
      academic_year_id: activeYear._id 
    });

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
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

/* =========================================================================
   📝 LOGIN (ฝังข้อมูลอาจารย์เท่าที่มีลง Token)
   ========================================================================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("academic_year_id");
    if (!user) return res.status(400).json({ message: "ไม่พบบัญชีผู้ใช้" });

    if (user.status !== "active") {
      return res.status(403).json({ message: "บัญชีนี้ยังไม่ได้รับการอนุมัติจากผู้ดูแลระบบ" });
    }

    if (user.role === "trainer" && (!user.academic_year_id || user.academic_year_id.status !== "active")) {
      return res.status(403).json({ message: "บัญชีนี้ผูกอยู่กับปีการศึกษาที่สิ้นสุดการใช้งานไปแล้ว" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "รหัสผ่านไม่ถูกต้อง" });

    const token = jwt.sign(
      { id: user._id, role: user.role, advisorId: user.advisor_id || null },
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
        advisor_id: user.advisor_id || null
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

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
   📝 [แก้ไขใหม่] UPDATE PROFILE (เพิ่มให้สามารถบันทึกหรือเปลี่ยนอาจารย์ที่ปรึกษาได้ที่นี่)
   ========================================================================= */
router.put("/profile", protect, async (req, res) => {
  try {
    // ➕ รับค่า advisor_id มาจากฟอร์มหน้าโปรไฟล์ของ Frontend
    const { name, email, advisor_id } = req.body;

    const exist = await User.findOne({ email, _id: { $ne: req.user.id } });
    if (exist) return res.status(400).json({ message: "Email นี้ถูกใช้งานแล้ว" });

    // เตรียมโครงสร้างข้อมูลที่จะอัปเดต
    const updateData = { name, email };
    
    // ถ้าร่างค่า advisor_id ส่งมาจากหน้าบ้าน ให้จับบันทึกลงไปในสิทธิ์ User ด้วย
    if (advisor_id !== undefined) {
      updateData.advisor_id = advisor_id || null;
    }

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select("-password");

    // ส่งก้อน user ล่าสุดกลับไป เพื่อให้หน้าบ้านเอาไปทับ localStorage ทันที
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