const express = require("express");
const router = express.Router();   // ⭐⭐ สำคัญมาก (ที่หายไป)
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* =========================
   REGISTER
========================= */
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role, name } = req.body;

    // 🔴 Validate ครบทุกช่อง
    if (!username || !email || !password || !role || !name) {
      return res.status(400).json({
        message: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
      });
    }

    // 🔴 เช็คซ้ำ username
    const existUser = await User.findOne({ username });
    if (existUser) {
      return res.status(400).json({ message: "มีผู้ใช้นี้แล้ว" });
    }

    // 🔴 เช็คซ้ำ email
    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({ message: "Email นี้ถูกใช้งานแล้ว" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ⭐ สร้าง user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role,
      name,
      status: "pending",
    });

    await user.save();

    res.status(201).json({
      message: "สมัครสมาชิกสำเร็จ รอแอดมินอนุมัติ",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        name: user.name,
        status: user.status,
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "ข้อมูลไม่ครบหรือรูปแบบไม่ถูกต้อง",
        error: err.message,
      });
    }

    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   LOGIN
========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "ไม่พบบัญชีผู้ใช้" });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        message: "บัญชีนี้ยังไม่ได้รับการอนุมัติจากผู้ดูแลระบบ",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "รหัสผ่านไม่ถูกต้อง" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;   // ⭐⭐ สำคัญมาก