const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    exercise_name: { type: String, required: true },
    exercise_type: { type: String, required: true },
    equipment_type:{ type: String, required: true },
    description:   { type: String },
    image:         { type: String },
    ownerRole:     { type: String, enum: ["admin", "trainer"], default: "trainer" },

    // ✅ เพิ่มตรงนี้ — บอกว่าท่านี้วัดผลด้วยอะไร
    exercise_category: {
      type: String,
      enum: [
        "weight",    // ใช้น้ำหนัก kg (Squat, Bench Press, Deadlift)
        "cardio",    // ใช้ระยะทาง km + เวลา นาที (วิ่ง, ปั่น)
        "bodyweight",// ใช้เวลา วินาที + ครั้ง (Plank, Push-up, Pull-up)
        "duration",  // ใช้เวลาอย่างเดียว (Stretching, Yoga)
      ],
      default: "weight"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exercise", exerciseSchema);