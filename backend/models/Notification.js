const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true, // ช่วยให้ดึงข้อมูลแจ้งเตือนของ User คนนั้นได้เร็วขึ้น
  },
  senderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  url: { 
    type: String 
  },
  type: {
    type: String,
    enum: ["info", "warning", "success"],
    default: "info",
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
