const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    // = student_id / personnel_id
    type: String,
    required: true,
    unique: true,
    maxlength: 30,
    trim: true,
  },

  email: {
    type: String,
    required: true,      // ✅ บังคับ
    unique: true,        // ✅ กันซ้ำระดับ DB
    lowercase: true,
    trim: true,
    match: [
      /^\S+@\S+\.\S+$/,
      "รูปแบบ Email ไม่ถูกต้อง",
    ],                    // ✅ validate format
  },

  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
  },

  role: {
    type: String,
    // เพิ่ม "pending" เข้าไปเพื่อให้สมัครสมาชิกแบบยังไม่มีสิทธิ์ได้
    enum: ["admin", "trainer", "instructor", "trainee", "pending"], 
    required: true,
    default: "pending" // ตั้งให้เป็น pending อัตโนมัติ
  },

  status: {
    type: String,
    enum: ["pending", "active", "inactive"],
    default: "pending",
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);