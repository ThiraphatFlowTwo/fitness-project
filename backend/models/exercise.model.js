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

    image: {
      type: String,
    },

    // ✅ เพิ่มตรงนี้
    ownerRole: {
      type: String,
      enum: ["admin", "trainer"],
      default: "trainer",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Exercise", exerciseSchema);
