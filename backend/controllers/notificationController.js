const Notification = require("../models/Notification");

// 1. ดึงรายการแจ้งเตือนทั้งหมดของผู้ใช้ที่ล็อกอินอยู่
exports.getNotifications = async (req, res) => {
  try {
    // req.user.id มาจาก authMiddleware
    const notifications = await Notification.find({ userId: req.user.id })
      .populate("senderId", "name role") // ดึงข้อมูลผู้ส่งมาแสดงในแจ้งเตือน (เช่น ชื่อและบทบาท)
      .sort({ created_at: -1 }); // นำรายการใหม่ล่าสุดขึ้นก่อน
    
    res.json(notifications);
  } catch (error) {
    console.error("GET NOTIFICATIONS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 2. อัปเดตสถานะเป็น "อ่านแล้ว" (กดทีละรายการ)
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const updated = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user.id }, // เช็คทั้ง id แจ้งเตือน และต้องเป็นของ user คนนั้นจริง
      { isRead: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "ไม่พบข้อมูลแจ้งเตือน" });
    }

    res.json({ message: "อ่านการแจ้งเตือนแล้ว", notification: updated });
  } catch (error) {
    console.error("MARK READ ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};