const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: 30,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "รูปแบบ Email ไม่ถูกต้อง"],
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
    enum: ["admin", "trainer", "instructor", "trainee", "pending"],
    required: true,
    default: "pending",
  },

  status: {
    type: String,
    enum: ["pending", "active", "inactive"],
    default: "pending",
  },

  // ผูกกลุ่มเทรนเนอร์ (นักศึกษา) เข้ากับปีการศึกษาที่เปิดใช้งานตอนสมัครเรียน
  academic_year_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AcademicYear",
    required: function () {
      return this.role === "trainer";
    }, // บังคับเฉพาะเมื่อมี Role เป็นเทรนเนอร์
  },

  // ไฟล์ models/User.js
  advisor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // 👈 ปรับเป็น false เพื่อให้อาจารย์สมัครได้โดยไม่ต้องระบุที่ปรึกษา
    default: null,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
