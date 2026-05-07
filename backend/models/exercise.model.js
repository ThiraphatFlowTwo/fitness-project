const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    exercise_name: {
      type: String,
      required: true,
    },
    exercise_type: {
      type: String, // เช่น หน้าอก, ขา, คาร์ดิโอ
      required: true,
    },
    equipment_type: {
      type: String, // เช่น บาร์เบล, ดัมเบล, อื่นๆ
      required: true,
    },
    description: {
      type: String, // คำอธิบายท่าฝึก หรือชื่อภาษาอังกฤษ (nameEN)
    },
    // ✅ เพิ่มฟิลด์ image สำหรับเก็บชื่อไฟล์รูปภาพ (แทนที่ icon แบบเดิม)
    image: {
      type: String, 
      default: null // ค่าเริ่มต้นเป็น null ถ้าไม่ได้อัปโหลดรูปมา
    },
    // ✅ เก็บ color ไว้ใช้กับ Tag กลุ่มกล้ามเนื้อได้
    color: {
      type: String,
      default: "bg-teal-50 border-teal-200" 
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exercise", exerciseSchema);