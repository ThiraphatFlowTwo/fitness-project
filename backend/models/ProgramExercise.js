const mongoose = require("mongoose");

const programExerciseSchema = new mongoose.Schema(
  {
    program_id:  { type: mongoose.Schema.Types.ObjectId, ref: "TrainingProgram", required: true },
    exercise_id: { type: mongoose.Schema.Types.ObjectId, ref: "Exercise",        required: true },
    order:       { type: Number, required: true },   // ลำดับท่า
    sets:        { type: Number },
    reps:        { type: Number },
    rpe:         { type: Number, min: 1, max: 10 }   // ค่าความเหนื่อย RPE 1-10
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProgramExercise", programExerciseSchema);