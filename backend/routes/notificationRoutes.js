const express      = require("express");
const router       = express.Router();
const Notification = require("../models/Notification");
const jwt          = require("jsonwebtoken");

// ── Auth middleware ──────────────────────────────────────────────
const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "ไม่มี token" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
    // Token ที่ออกจาก authController ใช้ `userId`; รองรับ token รุ่นเก่าที่ใช้ `id` ด้วย
    req.userId = decoded.userId || decoded.id;
    if (!req.userId) return res.status(401).json({ message: "token ไม่มีข้อมูลผู้ใช้งาน" });
    req.role   = decoded.role;
    next();
  } catch {
    res.status(401).json({ message: "token ไม่ถูกต้อง" });
  }
};

// GET /api/notifications — ดึง notification ของตัวเอง
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient_id: req.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/notifications/unread-count — จำนวนที่ยังไม่อ่าน
router.get("/unread-count", auth, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient_id: req.userId,
      is_read: false,
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/notifications/:id/read — mark อ่านแล้ว
router.patch("/:id/read", auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient_id: req.userId },
      { is_read: true }
    );
    if (!notification) return res.status(404).json({ message: "ไม่พบการแจ้งเตือน" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/notifications/read-all — mark ทั้งหมดว่าอ่านแล้ว
router.patch("/read-all", auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient_id: req.userId, is_read: false },
      { is_read: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
