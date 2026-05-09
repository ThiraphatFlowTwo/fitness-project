const express = require("express");
const router  = express.Router();
const Trainee = require("../models/Trainee");
const jwt     = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "ไม่มี token" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: "token ไม่ถูกต้อง" });
  }
};

// GET — ดึงลูกเทรนของเทรนเนอร์คนนี้
router.get("/", authMiddleware, async (req, res) => {
  try {
    const trainees = await Trainee.find({ user_id: req.userId })
                                  .sort({ createdAt: -1 });
    res.json(trainees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST — บันทึก user_id ของเทรนเนอร์ลงไปด้วยอัตโนมัติ
router.post("/", authMiddleware, async (req, res) => {
  try {
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

// PUT — แก้ไขเฉพาะลูกเทรนของตัวเอง
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

// DELETE — ลบเฉพาะลูกเทรนของตัวเอง
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