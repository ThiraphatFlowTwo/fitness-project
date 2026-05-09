const mongoose = require("mongoose");

const programSchema = new mongoose.Schema({
  name: { type: String, required: true },
  trainee: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Trainee", 
    required: true 
  },
  trainer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  goal: { type: String }, // ดึงจากข้อมูลลูกเทรนมาเก็บไว้ หรือกรอกใหม่
  duration: { type: String, required: true }, // เช่น "3 สัปดาห์"
  description: { type: String },
  exercises: [{
    name: String,
    bodyPart: String,
    tool: String
  }],
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Program", programSchema);