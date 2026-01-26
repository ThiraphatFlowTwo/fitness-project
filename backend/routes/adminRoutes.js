const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/authMiddleware");

/* =========================
   GET ALL USERS
========================= */
router.get("/users", protect, adminOnly, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

/* =========================
   CREATE USER (Admin)
========================= */
router.post("/users", protect, adminOnly, async (req, res) => {
  try {
    const { username, password, role, name, email } = req.body;

    const exist = await User.findOne({ username });
    if (exist) {
      return res.status(400).json({ message: "มีผู้ใช้นี้แล้ว" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      role,
      name,
      email,
      status: "active",
    });

    res.json({ message: "สร้างผู้ใช้สำเร็จ", user });
  } catch (err) {
    console.error("ADMIN CREATE USER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   UPDATE USER
========================= */
router.put("/users/:id", protect, adminOnly, async (req, res) => {
  const { name, email, role } = req.body;

  await User.findByIdAndUpdate(req.params.id, {
    name,
    email,
    role,
  });

  res.json({ message: "แก้ไขผู้ใช้สำเร็จ" });
});

/* =========================
   TOGGLE STATUS
========================= */
router.put("/users/:id/status", protect, adminOnly, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    status: req.body.status,
  });

  res.json({ message: "เปลี่ยนสถานะสำเร็จ" });
});

/* =========================
   DELETE USER
========================= */
router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "ลบผู้ใช้สำเร็จ" });
});

/* =========================
   APPROVE USER
========================= */
router.put('/users/:id/approve', protect, adminOnly, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    status: 'active'
  })
  res.json({ message: 'อนุมัติผู้ใช้เรียบร้อย' })
})
// ===== GET PENDING COUNT =====
router.get('/users/pending-count', protect, adminOnly, async (req, res) => {
  try {
    const count = await User.countDocuments({ status: 'pending' })
    res.json({ count })
  } catch (err) {
    res.status(500).json({ message: 'Load pending count failed' })
  }
})

module.exports = router;
