const jwt = require("jsonwebtoken");
const User = require("../models/User"); // 🔥 นำเข้า Model User เพื่อดึงข้อมูลสถานะล่าสุดจาก DB
const AcademicYear = require("../models/academicYear.model"); // 🔥 นำเข้า Model ปีการศึกษาเพื่อตรวจสอบสถานะ active

// middleware เช็ค token และ ตรวจสอบสิทธิ์ของปีการศึกษานักศึกษา (เทรนเนอร์)
const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized (ไม่มี token)" });
    }

    // 1. แกะ Token เพื่อเอาไอดีผู้ใช้
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
    
    // 2. ดึงข้อมูลผู้ใช้จากฐานข้อมูลขึ้นมาดูสถานะจริง พร้อมดึงรายละเอียดปีการศึกษาที่นักศึกษาคนนี้สังกัดอยู่ (populate)
    const user = await User.findById(decoded.id).populate("academic_year_id");
    
    if (!user) {
      return res.status(401).json({ message: "ไม่พบผู้ใช้งานนี้ในระบบ" });
    }

    // ── 🔒 ด่านตรวจสิทธิ์เฉพาะกลุ่มนักศึกษา (Trainer) ──
    if (user.role === "trainer") {
      
      // ตรวจสอบว่าปีการศึกษาที่เด็กคนนี้ผูกอยู่ ถูกปิดสิทธิ์ไปแล้วหรือยัง (เมื่อแอดมินสลับเทอมใหม่ อันเก่าจะกลายเป็น inactive)
      if (!user.academic_year_id || user.academic_year_id.status !== "active") {
        return res.status(403).json({ 
          message: "สิทธิ์การเข้าใช้งานระบบของคุณหมดอายุแล้ว (เนื่องจากสิ้นสุดปีการศึกษา/ภาคเรียนของคุณ)" 
        });
      }

      // เช็คสถานะทั่วไปของ Account เผื่อกรณีโดนแบนหรือระงับการใช้งานรายบุคคล
      if (user.status === "inactive") {
        return res.status(403).json({ message: "บัญชีผู้ใช้งานของคุณถูกระงับ" });
      }
    }

    // 3. ส่งข้อมูลผู้ใช้ (ที่ดึงมาจาก DB แบบสมบูรณ์) ไปยัง Router ถัดไป
    req.user = user;
    req.userId = user._id; // เพิ่มไว้รองรับโค้ดเก่าในโปรแกรมบางตัวที่ใช้ req.userId
    req.role = user.role;  // เพิ่มไว้รองรับโค้ดเก่าในโปรแกรมบางตัวที่ใช้ req.role

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token (token ไม่ถูกต้องหรือหมดอายุ)" });
  }
};

// middleware เช็ค admin
const adminOnly = (req, res, next) => {
  // เนื่องจาก req.user ได้รับข้อมูลเต็มจาก DB แล้ว จึงเช็คผ่าน req.user.role ได้ตามปกติ
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only (เฉพาะผู้ดูแลระบบเท่านั้น)" });
  }
  next();
};

module.exports = {
  protect,
  adminOnly,
};