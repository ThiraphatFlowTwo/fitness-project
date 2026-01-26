const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    // = student_id / personnel_id
    type: String,
    required: true,
    unique: true,
    maxlength: 30,
  },
  email: {
    // ❌ ไม่ unique
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "trainer", "instructor", "trainee"],
    required: true,
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
