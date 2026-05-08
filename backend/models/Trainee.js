const mongoose = require("mongoose");

const traineeSchema = new mongoose.Schema(
  {
    name:            { type: String, required: true },
    gender:          { type: String, enum: ["ชาย", "หญิง"], default: "ชาย" },
    age:             { type: Number, required: true },
    weight:          { type: Number },
    height:          { type: Number },
    goal:            { type: String },
    bmi:             { type: Number },
    bodyFat:         { type: Number },
    healthCondition: { type: String },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trainee", traineeSchema);