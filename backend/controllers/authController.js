const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Trainer = require("../models/Trainer");
const Instructor = require("../models/Instructor");
const Notification = require("../models/Notification");
const AcademicYear = require("../models/academicYear.model");

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { password, name, email, student_id, role } = req.body;

    const userRole = (role && role !== "pending") ? role : "trainer";
    const isTrainer = userRole === "trainer";
    const isInstructor = userRole === "instructor";

    if (!email) {
      return res.status(400).json({ message: "กรุณากรอกอีเมลสำหรับสมัครเข้าใช้งาน" });
    }
    if (isTrainer && !student_id) {
      return res.status(400).json({ message: "กรุณากรอกรหัสนักศึกษาของคุณก่อนทำการลงทะเบียน" });
    }

    const finalEmail = email.trim().toLowerCase();

    // 🔍 ตรวจสอบจาก email ฟิลด์เดียวตรง ๆ
    const existUser = await User.findOne({ email: finalEmail });
    if (existUser) {
      return res.status(400).json({ message: "อีเมลนี้ถูกใช้งานลงทะเบียนในระบบแล้ว" });
    }

    if (isTrainer) {
      const existTrainer = await Trainer.findOne({ student_id: student_id.trim() });
      if (existTrainer) {
        return res.status(400).json({ message: "รหัสนักศึกษานี้ถูกใช้งานในระบบแล้ว" });
      }
    }

    const activeYear = await AcademicYear.findOne({ status: "active" });
    if (!activeYear) {
      return res.status(400).json({
        message: "ไม่สามารถลงทะเบียนได้ เนื่องจากระบบยังไม่ได้เปิดใช้งานปีการศึกษาปัจจุบัน",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 💡 แก้ไขตรงนี้: แม้จะยกเลิกใช้ username แล้ว แต่เราจะใส่ค่าสำรอง (Fallback) 
    // เป็นอีเมลหรือรหัสนักศึกษาลงไปในฟิลด์ username เพื่อไม่ให้ Database ติดขัดเรื่องดัชนีซ้ำ (duplicate key username: null)
    const backupUsername = isTrainer ? student_id.trim() : finalEmail;

    // 💾 บันทึกข้อมูล (ด้วยสถานะ "pending" เพื่อให้โผล่หน้าแอดมินรออนุมัติ)
    const user = await User.create({
      username: backupUsername, // 👈 ใส่เพื่อแก้ทางปัญหา Database Index error
      email: finalEmail,
      password: hashedPassword,
      name,
      role: userRole,
      status: "pending", // 👈 มีสถานะเป็น pending แน่นอน แอดมินจะมองเห็นเพื่อกดอนุมัติ
      academic_year_id: activeYear._id,
      advisor_id: null,
    });

    if (isTrainer) {
      await Trainer.create({
        user_id: user._id,
        student_id: student_id.trim(),
        name,
        email: finalEmail,
        academic_year_id: activeYear._id,
      });
    } else if (isInstructor) {
      await Instructor.create({
        user_id: user._id,
        name,
        email: finalEmail,
        academic_year_id: activeYear._id,
      });
    }

    // แจ้งเตือนไปยัง Admin
    try {
      const admins = await User.find({ role: "admin" });
      const roleText = isInstructor ? "อาจารย์ที่ปรึกษา" : "เทรนเนอร์";
      for (let admin of admins) {
        await Notification.create({
          userId: admin._id,
          title: "คำขอลงทะเบียนใหม่",
          message: `มีผู้ใช้ใหม่ชื่อคุณ ${name} สมัครในบทบาท [${roleText}] (รอการอนุมัติสิทธิ์)`,
          type: "warning",
        });
      }
    } catch (err) {
      console.error(err);
    }

    res.status(201).json({ message: "ลงทะเบียนสำเร็จ กรุณารอผู้ดูแลระบบตรวจสอบอนุมัติเข้าใช้งาน" });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด: " + error.message });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "กรุณากรอกอีเมลและรหัสผ่านเพื่อเข้าใช้งาน" });
    }

    // 🔍 ค้นหาผู้ใช้จาก email ฟิลด์เดียวเท่านั้น
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(400).json({ message: "ไม่พบบัญชีผู้ใช้งานที่ผูกกับอีเมลนี้ในระบบ" });
    }

    if (user.role !== "admin" && user.status !== "active") {
      return res.status(403).json({ 
        message: "บัญชีของท่านยังไม่ได้รับการอนุมัติการใช้งาน กรุณารอผู้ดูแลระบบอนุมัติสิทธิ์" 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "รหัสผ่านไม่ถูกต้อง" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, advisorId: user.advisor_id || null },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1d" },
    );

    res.json({
      token,
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        status: user.status,
        advisor_id: user.advisor_id || null 
      },
    });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดบนเซิร์ฟเวอร์ในการล็อกอิน" });
  }
};