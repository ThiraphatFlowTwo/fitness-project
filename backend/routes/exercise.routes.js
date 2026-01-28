const express = require("express");
const router = express.Router();

const {
  createExercise,
  getExercises,
  updateExercise,
  deleteExercise,
} = require("../controllers/exercise.controller");

// ❌ ตัด authMiddleware ออกก่อนกันพัง
router.get("/", getExercises);
router.post("/", createExercise);
router.put("/:id", updateExercise);
router.delete("/:id", deleteExercise);

module.exports = router;