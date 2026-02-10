const express = require("express");
const router = express.Router();

// ✅ import controller ให้ครบ
const {
  createAcademicYear,
  getAcademicYears,
  deleteAcademicYear,
  updateAcademicYear,
  toggleStatus,
} = require("../controllers/academicYear.controller");

// routes
router.get("/", getAcademicYears);
router.post("/", createAcademicYear);
router.delete("/:id", deleteAcademicYear);
router.put("/:id", updateAcademicYear);

// ✅ toggle status
router.patch("/:id/toggle-status", toggleStatus);

module.exports = router;