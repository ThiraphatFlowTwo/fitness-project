const mongoose = require("mongoose");

const trainingLogSetSchema = new mongoose.Schema(
  {
    log_id:      { type: mongoose.Schema.Types.ObjectId, ref: "TrainingLog", required: true },
    exercise_id: { type: mongoose.Schema.Types.ObjectId, ref: "Exercise",    required: true },
    order:       { type: Number },        // ลำดับท่า
    set_number:  { type: Number, required: true },
    weight:      { type: Number },        // kg
    reps:        { type: Number },        // ครั้ง
    rpe:         { type: Number, min: 1, max: 10 }, // ค่าความเหนื่อยตอนฝึกจริง
    completed:   { type: Boolean, default: false },
    note:        { type: String, default: "" }  // หมายเหตุต่อแต่ละท่า
  },
  { timestamps: true }
);

module.exports = mongoose.model("TrainingLogSet", trainingLogSetSchema);