const mongoose = require("mongoose");

const traineeSchema = new mongoose.Schema(
  {
    // user_id = FK → รู้ว่าเทรนเนอร์คนไหนเป็นคนเพิ่มลูกเทรนคนนี้
    user_id:         { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name:            { type: String, required: true, maxlength: 70 },
    gender:          { type: String, enum: ["ชาย", "หญิง"], required: true },
    age:             { type: Number, required: true },
    height:          { type: Number },
    weight:          { type: Number },
    goal:            { type: String, default: "เพิ่มมวลกล้ามเนื้อ" },
    healthCondition: { type: String }
  },
  { timestamps: true }
  // _id ที่ MongoDB สร้างให้อัตโนมัติ = trainee_id (PK)
);

module.exports = mongoose.model("Trainee", traineeSchema);