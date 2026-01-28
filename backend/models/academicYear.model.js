const mongoose = require("mongoose");

const academicYearSchema = new mongoose.Schema(
  {
    academic_year: {
      type: String, // เช่น 2567
      required: true,
    },
    semester: {
      type: String, // เช่น 1, 2, Summer
      required: true,
    },
    status: {
      type: String, // active / inactive
      default: "inactive",
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AcademicYear", academicYearSchema);