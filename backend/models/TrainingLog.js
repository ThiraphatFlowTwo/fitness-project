const mongoose = require("mongoose");

const trainingLogSchema = new mongoose.Schema(
  {
    program_id:    { type: mongoose.Schema.Types.ObjectId, ref: "TrainingProgram", required: true },
    trainee_id:    { type: mongoose.Schema.Types.ObjectId, ref: "Trainee",         required: true },
    trainer_id:    { type: mongoose.Schema.Types.ObjectId, ref: "User",            required: true },
    training_date: { type: Date, required: true },
    duration:      { type: Number, default: 0 }, // วินาที
    note:          { type: String, default: "" }  // หมายเหตุรวมทั้ง log
  },
  { timestamps: true }
);

module.exports = mongoose.model("TrainingLog", trainingLogSchema);