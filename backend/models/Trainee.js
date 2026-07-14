const mongoose = require("mongoose");

const traineeSchema = new mongoose.Schema(
  {
    // 🔗 user_id ทำหน้าที่เป็น Foreign Key (FK) ชี้กลับไปหา User ที่เพิ่มลูกเทรนคนนี้
    user_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    name: { 
      type: String, 
      required: true, 
      maxlength: 70 
    },
    gender: { 
      type: String, 
      enum: ["ชาย", "หญิง"], 
      required: true 
    },
    age: { 
      type: Number, 
      required: true 
    },
    height: { 
      type: Number 
    },
    weight: { 
      type: Number 
    },
    goal: { 
      type: String, 
      default: "เพิ่มมวลกล้ามเนื้อ" 
    },
    healthCondition: { 
      type: String 
    }
  },
  { timestamps: true } // ระบบจะสร้าง createdAt และ updatedAt ให้โดยอัตโนมัติ
);

module.exports = mongoose.model("Trainee", traineeSchema);