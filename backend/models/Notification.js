const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient_id:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipient_role: { type: String, enum: ["admin", "instructor", "trainer"], required: true },
    type: {
      type: String,
      enum: [
        "program_submitted",   // เทรนเนอร์ส่งโปรแกรม → อาจารย์
        "training_log_new",    // เทรนเนอร์บันทึก log → อาจารย์
        "program_approved",    // อาจารย์อนุมัติ → เทรนเนอร์
        "program_rejected",    // อาจารย์ปฏิเสธ → เทรนเนอร์
        "account_activated",   // แอดมินเปิดสิทธิ์ → เทรนเนอร์/อาจารย์
        "user_pending",        // มี user ใหม่รออนุมัติ → แอดมิน
      ],
      required: true,
    },
    title:     { type: String, required: true },
    message:   { type: String, required: true },
    ref_id:    { type: mongoose.Schema.Types.ObjectId }, // id ของ program/log/user ที่เกี่ยวข้อง
    ref_model: { type: String },                          // "TrainingProgram" | "TrainingLog" | "User"
    is_read:   { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);