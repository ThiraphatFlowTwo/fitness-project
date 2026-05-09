const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  addTrainee,
  getMyTrainees,
  updateTrainee,
  deleteTrainee,
} = require("../controllers/trainee.controller");

// ทุก route ต้อง login ก่อน (เทรนเนอร์เท่านั้น)
router.use(protect);

router.get("/",        getMyTrainees);
router.post("/",       addTrainee);
router.put("/:id",     updateTrainee);
router.delete("/:id",  deleteTrainee);

module.exports = router;