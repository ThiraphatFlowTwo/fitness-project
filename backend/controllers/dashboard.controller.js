const User = require("../models/User");
const AcademicYear = require("../models/academicYear.model");

exports.getAdminSummary = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalAcademicYears = await AcademicYear.countDocuments();

    const activeAcademicYear = await AcademicYear.findOne({
      status: "active",
    });

    res.json({
      totalUsers,
      totalAcademicYears,
      activeAcademicYear, // object หรือ null
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};