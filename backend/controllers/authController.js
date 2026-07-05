const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Trainer = require("../models/Trainer");
const Instructor = require("../models/Instructor");
const Notification = require("../models/Notification");
const AcademicYear = require("../models/academicYear.model"); // ➕ นำเข้า Model ปีการศึกษาเพิ่มตรงนี้

// ================= Register =================
exports.register = async (req, res) => {
  try {
    // 🔒 ล็อกรับค่า บังคับเป็นสิทธิ์ trainer เสมอเพื่อความปลอดภัย
    const { username, password, name, email, student_id } = req.body;

    // 1. เช็ค Username ซ้ำในระบบ
    const existUser = await User.findOne({ username });
    if (existUser) {
      return res.status(400).json({ message: "Username นี้ถูกใช้งานแล้ว" });
    }

    // 2. 🔍 ค้นหาปีการศึกษาปัจจุบันที่ Active (ห้ามหลุด null เด็ดขาด)
    const activeYear = await AcademicYear.findOne({ status: "active" });

    // 🛑 ดักตรวจสอบแบบเข้มงวด: ถ้าในฐานข้อมูลไม่มีปีการศึกษาที่ active อยู่จริง
    // ให้หยุดทำงานตรงนี้ทันที และส่ง Error กลับหน้าบ้านเพื่อความถูกต้องของระบบ
    if (!activeYear) {
      return res.status(400).json({
        message:
          "ไม่สามารถลงทะเบียนได้ เนื่องจากระบบยังไม่ได้เปิดใช้งานปีการศึกษาปัจจุบัน (ผู้ดูแลระบบต้องเข้าไปกดเปิดใช้งานสถานะ active ก่อน)",
      });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. บันทึกข้อมูลลงตาราง User (ใช้ไอดีจริงเท่านั้น)
    const user = await User.create({
      username,
      name,
      email,
      password: hashedPassword,
      role: "trainer",
      status: "pending",
      academic_year_id: activeYear._id, // 🔗 ผูกไอดีจริงตามกติกา
    });

    // 5. ⚡ สร้าง Profile ในตาราง Trainer (ใช้ไอดีจริงเท่านั้น)
    await Trainer.create({
      user_id: user._id,
      student_id,
      name,
      email,
      academic_year_id: activeYear._id, // 🔗 ผูกไอดีจริงตามกติกา
    });

    // 🔔 6. ระบบแจ้งเตือนส่งหา Admin ทุกคน
    try {
      const admins = await User.find({ role: "admin" });
      const yearText = `ประจำปีการศึกษา ${activeYear.academic_year}/${activeYear.semester}`;

      for (let admin of admins) {
        await Notification.create({
          userId: admin._id,
          title: "คำขอลงทะเบียนใหม่",
          message: `มีผู้ใช้ใหม่ชื่อคุณ ${name} สมัครเข้าสู่ระบบในบทบาท [เทรนเนอร์] ${yearText} (รอการตรวจสอบและอนุมัติสิทธิ์)`,
          type: "warning",
        });
      }
    } catch (notiError) {
      console.error("Notification Error:", notiError);
    }

    res.status(201).json({ message: "ลงทะเบียนสำเร็จ กรุณารอแอดมินอนุมัติ" });
  } catch (error) {
    console.error("REGISTER CRITICAL ERROR:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาด: " + error.message });
  }
};

// ================= Login =================
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
