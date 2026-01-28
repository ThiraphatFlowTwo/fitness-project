const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    exercise_name: {
      type: String,
      required: true,
    },
    exercise_type: {
      type: String,
      required: true,
    },
    equipment_type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exercise", exerciseSchema);