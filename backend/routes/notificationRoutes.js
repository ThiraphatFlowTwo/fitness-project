const express = require("express");
const router = express.Router();
const { getNotifications, markAsRead } = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

// ทุกคนที่จะใช้ระบบแจ้งเตือน ต้องล็อกอินและส่ง Token มา (protect)
router.get("/", protect, getNotifications);
router.put("/:id/read", protect, markAsRead);

module.exports = router;