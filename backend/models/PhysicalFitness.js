const mongoose = require("mongoose");

const physicalFitnessSchema = new mongoose.Schema(
  {
    // trainee_id = FK → Trainee
    trainee_id:         { type: mongoose.Schema.Types.ObjectId, ref: "Trainee", required: true },
    test_date:          { type: Date, required: true },
    bmi:                { type: Number },
    body_fat_percent:   { type: Number },
    vo2_max:            { type: Number },
    muscle_strength:    { type: String, maxlength: 50 },
    flexibility:        { type: String, maxlength: 50 },
    resting_heart_rate: { type: Number },
    remark:             { type: String }
  },
  { timestamps: true }
  // _id = fitness_id (PK)
);

module.exports = mongoose.model("PhysicalFitness", physicalFitnessSchema);