const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    exercise_name:     { type: String, required: true },
    exercise_type:     { type: String, required: true },
    equipment_type:    { type: String, required: true },
    description:       { type: String },
    image:             { type: String },
    ownerRole: {
      type: String,
      enum: ["admin", "trainer"],
      default: "trainer",
    },
    exercise_category: {
      type: String,
      enum: ["weight", "cardio", "bodyweight", "duration"],
      default: "weight"
    },
    created_by: { // ← เพิ่ม: เก็บ id ของคนสร้าง
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exercise", exerciseSchema);