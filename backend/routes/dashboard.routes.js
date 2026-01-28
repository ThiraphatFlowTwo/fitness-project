const express = require("express");
const router = express.Router();

const {
  getAdminSummary,
} = require("../controllers/dashboard.controller");

router.get("/admin-summary", getAdminSummary);

module.exports = router;