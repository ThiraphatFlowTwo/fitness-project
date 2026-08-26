const express         = require("express");
const router          = express.Router();
const PhysicalFitness = require("../models/PhysicalFitness");
const Trainee         = require("../models/Trainee");
const jwt             = require("jsonwebtoken");
const Notification    = require("../models/Notification");
const User            = require("../models/User");

// 📷 1. เพิ่มการ Import สำหรับสแกนรูปภาพ AI OCR
const multer = require("multer");
const { GoogleGenAI, Type } = require("@google/genai");

// 📷 2. ตั้งค่า Multer (เก็บรูปใน Memory) และ Gemini AI
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // จำกัดขนาดรูปสูงสุด 10MB
});
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "ไม่มี token" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
    req.userId = decoded.userId || decoded.id;
    next();
  } catch {
    res.status(401).json({ message: "token ไม่ถูกต้อง" });
  }
};

// ตรวจสอบว่าลูกเทรนนี้เป็นของเทรนเนอร์คนนี้จริงไหม
const verifyTraineeOwner = async (traineeId, userId) => {
  const trainee = await Trainee.findOne({ _id: traineeId, user_id: userId });
  return !!trainee;
};

// GET /api/fitness/:traineeId — ดึงข้อมูลสมรรถภาพของลูกเทรนคนนี้
router.get("/:traineeId", authMiddleware, async (req, res) => {
  try {
    const isOwner = await verifyTraineeOwner(req.params.traineeId, req.userId);
    if (!isOwner) return res.status(403).json({ message: "ไม่มีสิทธิ์เข้าถึงข้อมูลนี้" });

    const records = await PhysicalFitness.find({ trainee_id: req.params.traineeId })
                                         .sort({ test_date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ⚡ POST /api/fitness/scan-report — สแกนใบตรวจ (ACCUNIQ/InBody) ด้วย AI
router.post("/scan-report", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "กรุณาอัปโหลดรูปภาพ" });
    }

    // แปลงไฟล์ภาพเป็น Base64
    const imagePart = {
      inlineData: {
        data: req.file.buffer.toString("base64"),
        mimeType: req.file.mimetype,
      },
    };

    const prompt = `คุณคือผู้เชี่ยวชาญด้าน OCR วิเคราะห์ใบตรวจสมรรถภาพและองค์ประกอบร่างกาย (เช่น ACCUNIQ, InBody, Tanita) 
    โปรดอ่านข้อมูลจากรูปภาพที่แนบมา และดึงข้อมูลตัวเลขเฉพาะหัวข้อที่กำหนด ออกมาในรูปแบบ JSON ตาม Schema ที่ระบุไว้เท่านั้น`;

    // เรียกใช้ Gemini 2.5 Flash พร้อมกำหนด Structured Outputs Schema
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [prompt, imagePart],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            // วันที่
            test_date: { type: Type.STRING, description: "วันที่ตรวจ รูปแบบ YYYY-MM-DD" },
            
            // 1. องค์ประกอบร่างกาย (รองรับทั้ง muscle_mass และ skeletal_muscle_mass)
            weight: { type: Type.NUMBER, description: "น้ำหนัก (kg)" },
            muscle_mass: { type: Type.NUMBER, description: "มวลกล้ามเนื้อ Muscle Mass / SMM (kg)" },
            skeletal_muscle_mass: { type: Type.NUMBER, description: "มวลกล้ามเนื้อลาย SMM (kg)" },
            body_fat_mass: { type: Type.NUMBER, description: "มวลไขมัน FM (kg)" },
            protein: { type: Type.NUMBER, description: "โปรตีน (kg)" },
            minerals: { type: Type.NUMBER, description: "กระดูก/แร่ธาตุ (kg)" },
            total_body_water: { type: Type.NUMBER, description: "น้ำในร่างกาย TBW (kg)" },

            // 2. ภาวะอ้วน & ลงพุง
            bmi: { type: Type.NUMBER, description: "BMI" },
            body_fat_percent: { type: Type.NUMBER, description: "% ไขมันร่างกาย PBF" },
            visceral_fat_level: { type: Type.NUMBER, description: "ระดับไขมันช่องท้อง" },
            waist_circumference: { type: Type.NUMBER, description: "เส้นรอบเอว (cm)" },
            waist_hip_ratio: { type: Type.NUMBER, description: "อัตราส่วนเอว/สะโพก WHR" },

            // 6. ประเมินโดยรวม & พลังงาน
            body_age: { type: Type.NUMBER, description: "อายุกาย" },
            body_score: { type: Type.NUMBER, description: "คะแนนร่างกาย" },
            estimated_bmr: { type: Type.NUMBER, description: "BMR พลังงานพื้นฐาน" },
            tdee: { type: Type.NUMBER, description: "TDEE พลังงาน/วัน" },

            // ข้อแนะนำ
            remark: { type: Type.STRING, description: "แนวทาง/ข้อแนะนำ หรือหมายเหตุจากใบตรวจ" },
          },
        },
      },
    });

    const scannedData = JSON.parse(response.text);

    return res.status(200).json({
      success: true,
      message: "วิเคราะห์รูปภาพสำเร็จ",
      scannedData,
    });
  } catch (error) {
    console.error("Error scanning report:", error);
    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการวิเคราะห์รูปภาพ",
      error: error.message,
    });
  }
});

// POST /api/fitness — เพิ่มข้อมูลสมรรถภาพ
router.post("/", authMiddleware, async (req, res) => {
  try {
    const isOwner = await verifyTraineeOwner(req.body.trainee_id, req.userId);
    if (!isOwner) return res.status(403).json({ message: "ไม่มีสิทธิ์เพิ่มข้อมูลนี้" });

    // บันทึกข้อมูล
    const record = new PhysicalFitness(req.body);
    const saved  = await record.save();

    // 🔔 แจ้งเตือนเด้งหาอาจารย์ทุกคน (ทำงานแบบ background / ไม่บล็อก response)
    (async () => {
      try {
        const traineeInfo = await Trainee.findById(req.body.trainee_id);
        const traineeName = traineeInfo ? traineeInfo.name : "ลูกเทรน";
        const instructors = await User.find({ role: "instructor" });
        
        const notifications = instructors.map((instructor) => ({
          userId: instructor._id,
          senderId: req.userId,
          title: "อัปเดตผลสมรรถภาพทางกาย",
          message: `เทรนเนอร์ได้เพิ่มบันทึกผลการทดสอบสมรรถภาพทางกาย (ACCUNIQ) ของ [${traineeName}] เรียบร้อยแล้ว`,
          url: "/admin",
          type: "info"
        }));

        if (notifications.length > 0) {
          await Notification.insertMany(notifications);
        }
      } catch (notiErr) {
        console.error("Noti error:", notiErr.message);
      }
    })();

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/fitness/:id — แก้ไข
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const existing = await PhysicalFitness.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "ไม่พบข้อมูล" });

    const isOwner = await verifyTraineeOwner(existing.trainee_id, req.userId);
    if (!isOwner) return res.status(403).json({ message: "ไม่มีสิทธิ์แก้ไขข้อมูลนี้" });

    const updated = await PhysicalFitness.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/fitness/:id — ลบ
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const existing = await PhysicalFitness.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "ไม่พบข้อมูล" });

    const isOwner = await verifyTraineeOwner(existing.trainee_id, req.userId);
    if (!isOwner) return res.status(403).json({ message: "ไม่มีสิทธิ์ลบข้อมูลนี้" });

    await PhysicalFitness.findByIdAndDelete(req.params.id);
    res.json({ message: "ลบสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;