const TrainingProgram = require("../models/TrainingProgram");
const AcademicYear = require("../models/academicYear.model");
const User = require("../models/User");

// ── 📝 [อัปเดตใหม่] สร้างโปรแกรมฝึกซ้อม (ตรงตาม Schema ล่าสุด) ──────────────────
exports.createProgram = async (req, res) => {
  try {
    const trainerId = req.user.id || req.user._id;

    // 1. ค้นหาข้อมูลบัญชีผู้ใช้ของเทรนเนอร์คนปัจจุบันเพื่อเช็คสิทธิ์อาจารย์ที่ปรึกษา
    const trainerUser = await User.findById(trainerId);

    // 2. 🔥 ล็อกสิทธิ์: หากมีบทบาทเป็นนักศึกษา (trainer) แต่ไม่มีอาจารย์ที่ปรึกษาในระบบ
    if (trainerUser && trainerUser.role === "trainer" && !trainerUser.advisor_id) {
      return res.status(403).json({
        success: false,
        message: "ไม่สามารถสร้างโปรแกรมได้ เนื่องจากคุณยังไม่มีอาจารย์ที่ปรึกษา กรุณาเลือกอาจารย์ที่ปรึกษาก่อนใช้งาน"
      });
    }

    // 3. 🔍 ค้นหาปีการศึกษาปัจจุบันที่ Active อยู่ในระบบ (เพื่อผูกลงคอลเลกชันอัตโนมัติ)
    const activeYear = await AcademicYear.findOne({ status: "active" });
    if (!activeYear) {
      return res.status(400).json({
        success: false,
        message: "ไม่สามารถสร้างโปรแกรมได้ เนื่องจากผู้ดูแลระบบยังไม่ได้เปิดใช้งานปีการศึกษาปัจจุบัน"
      });
    }

    // 4. บันทึกข้อมูลโปรแกรมลงฐานข้อมูล (แมตช์ชื่อฟิลด์ตาม Schema เป๊ะๆ)
    const program = await TrainingProgram.create({
      ...req.body,
      trainer_id: trainerId,         // ✅ ตรงตาม Schema
      academic_year_id: activeYear._id, // ✅ ผูกปีการศึกษา active อัตโนมัติป้องกันเด็กเลือกผิดเทอม
      status: "draft"                // 📌 บังคับเริ่มต้นที่ draft เผื่อเด็กอยากแก้ไขก่อนส่งให้อาจารย์ตรวจ
    });

    res.status(201).json({ success: true, data: program });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};