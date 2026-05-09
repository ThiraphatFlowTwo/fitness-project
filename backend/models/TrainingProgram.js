const mongoose = require("mongoose");

const trainingProgramSchema = new mongoose.Schema(
  {
    trainer_id:       { type: mongoose.Schema.Types.ObjectId, ref: "User",        required: true },
    trainee_id:       { type: mongoose.Schema.Types.ObjectId, ref: "Trainee",     required: true },
    academic_year_id: { type: mongoose.Schema.Types.ObjectId, ref: "AcademicYear",required: true },
    program_name:     { type: String, required: true, maxlength: 100 },
    status:           { type: String, enum: ["draft","pending","approved","rejected"], default: "draft" },
    instructor_comment: { type: String, default: "" },
    created_date:     { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TrainingProgram", trainingProgramSchema);