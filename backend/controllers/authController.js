const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Trainer = require("../models/Trainer");
const Instructor = require("../models/Instructor");
const Notification = require("../models/Notification");
const AcademicYear = require("../models/academicYear.model");

// ================= Register =================
exports.register = async (req, res) => {
  try {
    // 🔒 รับค่าจาก Frontend
    const { username, password, name, email, student_id, role } = req.body;

    // ตรวจสอบบทบาท (role) ให้ชัดเจน
    const userRole = (role && role !== "pending") ? role : "trainer";
    const isTrainer = userRole === "trainer";
    const isInstructor = userRole === "instructor";

    // 🛑 1. ตรวจสอบข้อมูลตามบทบาท (Role Validation)
    if (isTrainer) {
      // สำหรับ Trainer (นักศึกษา) ต้องมีรหัสนักศึกษา
      if (!student_id) {
        return res.status(400).json({ 
          message: "กรุณากรอกรหัสนักศึกษาของคุณก่อนทำการลงทะเบียน" 
        });
      }
    }

    // 🛑 2. สำหรับ Instructor (อาจารย์) จะไม่มีการเช็ค student_id ใดๆ ทั้งสิ้น
    // (ข้ามการตรวจสอบรหัสนักศึกษาไปเลย)

    // 3. เช็ค Username ซ้ำในระบบ
    // ป้องกันกรณีส่งค่าซ้ำ
    const finalUsername = isInstructor ? email : (student_id ? student_id.trim() : username);
    const existUser = await User.findOne({ username: finalUsername });
    if (existUser) {
      return res.status(400).json({ message: "Username หรือ Email นี้ถูกใช้งานในระบบแล้ว" });
    }

    // 4. ค้นหาปีการศึกษาปัจจุบันที่ Active
    const activeYear = await AcademicYear.findOne({ status: "active" });
    if (!activeYear) {
      return res.status(400).json({
        message: "ไม่สามารถลงทะเบียนได้ เนื่องจากระบบยังไม่ได้เปิดใช้งานปีการศึกษาปัจจุบัน (ผู้ดูแลระบบต้องเข้าไปเปิดใช้งานก่อน)",
      });
    }

    // 5. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 6. บันทึกข้อมูลลงตาราง User (ตั้งค่า advisor_id เป็น null เสมอตอนสมัครสมาชิก)
    const user = await User.create({
      username: finalUsername,
      name,
      email,
      password: hashedPassword,
      role: userRole,
      status: "pending",
      academic_year_id: activeYear._id,
      advisor_id: null, // ไม่มีให้เลือกอาจารย์ที่ปรึกษาตอนสมัครแล้ว
    });

    // 7. ⚡ แยกการบันทึก Profile ไปยังคอลเลกชันที่ถูกต้องตามบทบาทอย่างเด็ดขาด
    if (isTrainer) {
      // 📝 บันทึกข้อมูลลงตาราง Trainer (เฉพาะนักศึกษา)
      await Trainer.create({
        user_id: user._id,
        student_id: student_id.trim(),
        name,
        email,
        academic_year_id: activeYear._id,
      });
    } else if (isInstructor) {
      // 📝 บันทึกข้อมูลลงตาราง Instructor (เฉพาะอาจารย์ - จะไม่มีฟิลด์ student_id กวนใจ)
      await Instructor.create({
        user_id: user._id,
        name,
        email,
        academic_year_id: activeYear._id,
      });
    }

    // 🔔 8. ระบบแจ้งเตือนส่งหา Admin
    try {
      const admins = await User.find({ role: "admin" });
      const yearText = `ประจำปีการศึกษา ${activeYear.academic_year}/${activeYear.semester}`;
      const roleText = isInstructor ? "อาจารย์ที่ปรึกษา" : "เทรนเนอร์";

      for (let admin of admins) {
        await Notification.create({
          userId: admin._id,
          title: "คำขอลงทะเบียนใหม่",
          message: `มีผู้ใช้ใหม่ชื่อคุณ ${name} สมัครเข้าสู่ระบบในบทบาท [${roleText}] ${yearText} (รอการตรวจสอบและอนุมัติสิทธิ์)`,
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

    // 🔥 ใส่ advisor_id ลงไปใน JWT payload เพื่อความสะดวกสบายของ middleware ต่างๆ ในการดึงสิทธิ์ไปดักตรวจ
    const token = jwt.sign(
      { userId: user._id, role: user.role, advisorId: user.advisor_id || null },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // 🔥 ส่งกลับก้อนข้อมูลที่มีข้อมูล advisor_id ไปให้หน้าบ้านดักเช็คหรือล็อก UI ปุ่มต่างๆ
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        name: user.name,
        advisor_id: user.advisor_id || null // 🔗 ส่งไปให้ Frontend ตรวจเช็คสถานะการผูกที่ปรึกษา
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};