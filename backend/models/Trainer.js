const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema({
  // 🔗 เชื่อมโยงหลักไปยังบัญชีผู้ใช้ (User Model) ซึ่งเก็บ Role, Status และ Advisor_id (อาจารย์ที่ปรึกษา) เอาไว้
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
// รหัสนักศึกษา (สำหรับบันทึกข้อมูลเพิ่มเติมของนักศึกษาฝั่งกีฬา)
  student_id: {
    type: String,
    default: null, // กำหนดค่าเริ่มต้นให้เป็น null หากไม่มีการส่งมา
    validate: {
      validator: function(v) {
        // ถ้าไม่มีการส่งค่ามา หรือค่าเป็นค่าว่าง ปล่อยผ่านได้เลย (สำหรับอาจารย์/ผู้ดูแลระบบ)
        if (!v || v.trim() === "") return true; 
        // ถ้ามีการส่งรหัสนักศึกษามาจริงๆ ต้องยาวไม่เกิน 10 หลัก
        return v.length <= 10;
      },
      message: "รหัสนักศึกษาต้องยาวไม่เกิน 10 หลัก"
    }
  },
  
  name: {
    type: String,
    required: true,
    maxlength: 70,
  },
  
  email: {
    type: String,
    required: true,
    maxlength: 70,
  },
});

module.exports = mongoose.model("Trainer", trainerSchema);