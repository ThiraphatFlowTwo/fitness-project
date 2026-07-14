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

// ── 🔥 เพิ่ม Pre-save Hook สำหรับการ Validate ความสัมพันธ์ ──
programSchema.pre("save", async function(next) {
  try {
    // ดึงโมเดล User มาตรวจสอบข้อมูลของ Trainer ที่จะสร้างโปรแกรมนี้
    const User = mongoose.model("User");
    const currentTrainer = await User.findById(this.trainer);

    if (!currentTrainer) {
      return next(new Error("ไม่พบข้อมูลเทรนเนอร์ในระบบ"));
    }

    // เช็คเงื่อนไขบทบาทเทรนเนอร์ และตรวจสอบว่ามี advisor_id หรือไม่
    if (currentTrainer.role === "trainer" && !currentTrainer.advisor_id) {
      return next(new Error("นักศึกษาต้องลงทะเบียนอาจารย์ที่ปรึกษาก่อน จึงจะสามารถสร้างโปรแกรมฝึกได้"));
    }

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Program", programSchema);

module.exports = mongoose.model("Program", programSchema);