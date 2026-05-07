const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const {
  createExercise,
  getExercises,
  updateExercise,
  deleteExercise,
} = require("../controllers/exercise.controller");

// ✅ IMPORT MIDDLEWARE
const { protect, adminOnly } = require("../middleware/authMiddleware");

// ==========================================
// MULTER
// ==========================================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
});

// ==========================================
// ROUTES
// ==========================================

// ✅ ดูได้ทุกคน
router.get("/", getExercises);

// ✅ ต้อง login ก่อน
router.post("/", protect, upload.single("image"), createExercise);

// ✅ ต้อง login ก่อน
router.put("/:id", protect, upload.single("image"), updateExercise);

// ✅ ต้อง login ก่อน
router.delete("/:id", protect, deleteExercise);

module.exports = router;
