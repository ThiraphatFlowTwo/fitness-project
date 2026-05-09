const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Trainer = require("../models/Trainer");
const Instructor = require("../models/Instructor");

// ================= Register =================
exports.register = async (req, res) => {
  try {
    const { username, password, role, name, email, student_id } = req.body;

    // 1. เช็ค Username ซ้ำ
    const existUser = await User.findOne({ username });
    if (existUser) {
      return res.status(400).json({ message: "Username นี้ถูกใช้งานแล้ว" });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create user (ส่งค่า name และ email เข้าไปด้วยตาม Model)
    const user = await User.create({
      username,
      name,      // ✅ ต้องส่ง เพราะ Model บอกว่า required
      email,     // ✅ ต้องส่ง เพราะ Model บอกว่า required
      password: hashedPassword,
      role: role || "pending", // ถ้าไม่ส่งมาให้เป็น pending
      status: "pending",       // รอแอดมินอนุมัติ
    });

    // 4. สร้าง Profile เฉพาะกรณีที่เลือก Role มาตอนสมัคร (ถ้ามี)
    if (role === "trainer") {
      await Trainer.create({
        user_id: user._id,
        student_id,
        name,
        email,
      });
    } else if (role === "instructor") {
      await Instructor.create({
        user_id: user._id,
        name,
        email,
      });
    }

    res.status(201).json({ message: "ลงทะเบียนสำเร็จ กรุณารอแอดมินอนุมัติ" });
  } catch (error) {
    console.error(error);
    // ส่ง Error Message ที่ละเอียดขึ้นกลับไปดู
    res.status(500).json({ message: "เกิดข้อผิดพลาด: " + error.message });
  }
};
// ================= Login =================
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
