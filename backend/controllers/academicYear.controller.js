const AcademicYear = require("../models/academicYear.model");

// ===== GET =====
exports.getAcademicYears = async (req, res) => {
  try {
    const list = await AcademicYear.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===== CREATE =====
exports.createAcademicYear = async (req, res) => {
  try {
    const academicYear = await AcademicYear.create({
      academic_year: req.body.academic_year,
      semester: req.body.semester,
      status: req.body.status,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
    });

    res.json(academicYear);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ===== DELETE =====
exports.deleteAcademicYear = async (req, res) => {
  try {
    await AcademicYear.findByIdAndDelete(req.params.id);
    res.json({ message: "ลบเรียบร้อย" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ===== TOGGLE STATUS =====
exports.toggleStatus = async (req, res) => {
  try {
    const academicYear = await AcademicYear.findById(req.params.id);

    if (!academicYear) {
      return res.status(404).json({ message: "ไม่พบปีการศึกษา" });
    }

    const newStatus =
      academicYear.status === "active" ? "inactive" : "active";

    if (newStatus === "active") {
      await AcademicYear.updateMany(
        { _id: { $ne: academicYear._id } },
        { status: "inactive" }
      );
    }

    academicYear.status = newStatus;
    await academicYear.save();

    res.json(academicYear);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};