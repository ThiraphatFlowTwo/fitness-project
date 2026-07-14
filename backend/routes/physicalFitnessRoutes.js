const express         = require("express");
const router          = express.Router();
const PhysicalFitness = require("../models/PhysicalFitness");
const Trainee         = require("../models/Trainee");
const jwt             = require("jsonwebtoken");
const Notification    = require("../models/Notification"); // ➕ นำเข้าโมเดลแจ้งเตือน
const User            = require("../models/User");         // ➕ นำเข้าโมเดล User เพื่อใช้ดึงข้อมูลอาจารย์

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "ไม่มี token" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123"); // 💡 เพิ่ม fallback secret ป้องกัน error หากไม่ได้ตั้งค่า env
    req.userId = decoded.userId || decoded.id;
    next();
  } catch {
    res.status(401).json({ message: "token ไม่ถูกต้อง" });
  }
};

// ตรวจสอบว่าลูกเทรนนี้เป็นของเทรนเนอร์คนนี้จริงไหม
const verifyTraineeOwner = async (traineeId, userId) => {
  const trainee = await Trainee.findOne({ _id: traineeId, user_id: userId });
  return !!trainee;
};

// GET /api/fitness/:traineeId — ดึงข้อมูลสมรรถภาพของลูกเทรนคนนี้
router.get("/:traineeId", authMiddleware, async (req, res) => {
  try {
    const isOwner = await verifyTraineeOwner(req.params.traineeId, req.userId);
    if (!isOwner) return res.status(403).json({ message: "ไม่มีสิทธิ์เข้าถึงข้อมูลนี้" });

    const records = await PhysicalFitness.find({ trainee_id: req.params.traineeId })
                                         .sort({ test_date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/fitness — เพิ่มข้อมูลสมรรถภาพ
router.post("/", authMiddleware, async (req, res) => {
  try {
    const isOwner = await verifyTraineeOwner(req.body.trainee_id, req.userId);
    if (!isOwner) return res.status(403).json({ message: "ไม่มีสิทธิ์เพิ่มข้อมูลนี้" });

    const record = new PhysicalFitness(req.body);
    const saved  = await record.save();

    // 🔔 แจ้งเตือนเด้งหา "อาจารย์ทุกคน" เพื่อรายงานผลการทดสอบสมรรถภาพทางกายของลูกเทรน
    try {
      // ค้นหาข้อมูลลูกเทรนเพื่อดึงชื่อเล่น/ชื่อจริงมาแสดงผลในข้อความแจ้งเตือน
      const traineeInfo = await Trainee.findById(req.body.trainee_id);
      const traineeName = traineeInfo ? traineeInfo.name : "ลูกเทรน";

      // ดึงรายชื่ออาจารย์ทั้งหมดในระบบ
      const instructors = await User.find({ role: "instructor" });
      
      for (let instructor of instructors) {
        await Notification.create({
          userId: instructor._id, // ส่งหาอาจารย์แต่ละท่าน
          senderId: req.userId,   // ➕ แนบไอดีเทรนเนอร์ผู้บันทึกผลเข้าไป (ระบุตัวบุคคลว่า user ไหนทำรายการ)
          title: "อัปเดตผลสมรรถภาพทางกาย",
          message: `เทรนเนอร์ได้เพิ่มบันทึกผลการทดสอบสมรรถภาพทางกายรอบใหม่ของ [${traineeName}] เรียบร้อยแล้ว`,
          url: "/admin",          // ➕ แนบ URL ปลายทาง เพื่อให้อาจารย์คลิกแล้วระบบพาไปยังหน้าเว็บที่กำหนดทันที
          type: "info"
        });
      }
    } catch (notiErr) {
      console.error("สร้างการแจ้งเตือนข้อผิดพลาด (Create Physical Fitness Log):", notiErr);
    }

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/fitness/:id — แก้ไข
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const existing = await PhysicalFitness.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "ไม่พบข้อมูล" });

    const isOwner = await verifyTraineeOwner(existing.trainee_id, req.userId);
    if (!isOwner) return res.status(403).json({ message: "ไม่มีสิทธิ์แก้ไขข้อมูลนี้" });

    const updated = await PhysicalFitness.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/fitness/:id — ลบ
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const existing = await PhysicalFitness.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "ไม่พบข้อมูล" });

    const isOwner = await verifyTraineeOwner(existing.trainee_id, req.userId);
    if (!isOwner) return res.status(403).json({ message: "ไม่มีสิทธิ์ลบข้อมูลนี้" });

    await PhysicalFitness.findByIdAndDelete(req.params.id);
    res.json({ message: "ลบสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
