const express = require("express");
const router  = express.Router();
const Trainee = require("../models/Trainee");
const User    = require("../models/User"); // 🔥 ดึง Model User เข้ามาเช็คสิทธิ์อาจารย์ที่ปรึกษา
const jwt     = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "ไม่มี token" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
    req.userId = decoded.userId || decoded.id;
    next();
  } catch {
    res.status(401).json({ message: "token ไม่ถูกต้อง" });
  }
};

// ── GET — ดึงลูกเทรนของเทรนเนอร์คนนี้ ───────────────────────
router.get("/", authMiddleware, async (req, res) => {
  try {
    const trainees = await Trainee.find({ user_id: req.userId })
                                  .sort({ createdAt: -1 });
    res.json(trainees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── 📝 [แก้ไขแล้ว] POST — บันทึกลูกเทรน (เพิ่มตรวจสอบอาจารย์ที่ปรึกษา) ──
router.post("/", authMiddleware, async (req, res) => {
  try {
    // 1. ค้นหาข้อมูลบัญชีผู้ใช้ของเทรนเนอร์คนปัจจุบัน
    const trainerUser = await User.findById(req.userId);

    // 2. 🔥 ล็อกสิทธิ์: หากมีบทบาทเป็นนักศึกษา (trainer) แต่ไม่มีอาจารย์ที่ปรึกษา (advisor_id เป็น null หรือไม่มีค่า)
    if (trainerUser && trainerUser.role === "trainer" && !trainerUser.advisor_id) {
      return res.status(403).json({ 
        message: "ไม่สามารถเพิ่มลูกเทรนได้ เนื่องจากคุณยังไม่มีอาจารย์ที่ปรึกษา กรุณาเลือกอาจารย์ที่ปรึกษาก่อนใช้งาน" 
      });
    }

    // 3. ปล่อยให้บันทึกข้อมูลหากมีอาจารย์ที่ปรึกษาเรียบร้อยแล้ว
    const trainee = new Trainee({
      ...req.body,
      user_id: req.userId  // ← FK เชื่อมกับ User
    });
    const saved = await trainee.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── PUT — แก้ไขเฉพาะลูกเทรนของตัวเอง ────────────────────────
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await Trainee.findOneAndUpdate(
      { _id: req.params.id, user_id: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "ไม่พบข้อมูล หรือไม่มีสิทธิ์แก้ไข" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── DELETE — ลบเฉพาะลูกเทรนของตัวเอง ─────────────────────
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Trainee.findOneAndDelete({
      _id: req.params.id,
      user_id: req.userId
    });
    if (!deleted) return res.status(404).json({ message: "ไม่พบข้อมูล หรือไม่มีสิทธิ์ลบ" });
    res.json({ message: "ลบสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
