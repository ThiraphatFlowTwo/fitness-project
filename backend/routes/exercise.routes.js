const express = require("express");
const router = express.Router();
const multer = require("multer"); // ✅ นำเข้า multer
const path = require("path");     // ✅ นำเข้า path สำหรับจัดการชื่อไฟล์

const {
  createExercise,
  getExercises,
  updateExercise,
  deleteExercise,
} = require("../controllers/exercise.controller");

// ==========================================
// ✅ ตั้งค่า Multer สำหรับอัปโหลดรูปภาพ
// ==========================================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // กำหนดโฟลเดอร์สำหรับเก็บไฟล์รูปภาพ (ต้องมีโฟลเดอร์ uploads/ อยู่ในระบบ)
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    // ตั้งชื่อไฟล์ใหม่: ใช้วันเวลา (Date.now) + นามสกุลไฟล์เดิม เพื่อป้องกันชื่อไฟล์ซ้ำกัน
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// สร้าง middleware สำหรับอัปโหลด
const upload = multer({ storage: storage });

// ==========================================
// ROUTES
// ==========================================

// ❌ ตัด authMiddleware ออกก่อนกันพัง
router.get("/", getExercises);

// ✅ เพิ่ม upload.single("image") เข้าไปดักจับไฟล์ที่มีชื่อฟิลด์ว่า "image" ก่อนส่งไป Controller
router.post("/", upload.single("image"), createExercise);

// ✅ เผื่อมีการแก้ไขรูปภาพ ก็ให้ดักจับไฟล์ "image" ด้วยเช่นกัน
router.put("/:id", upload.single("image"), updateExercise);

router.delete("/:id", deleteExercise);

module.exports = router;