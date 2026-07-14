const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { createNotification } = require("../utils/notificationHelper");
const Notification = require("../models/Notification"); // ย้ายมาประกาศด้านบนสุดให้เรียกใช้ง่ายๆ ครับ

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
    const { password, role, name, email } = req.body;

    const normalizedEmail = email?.trim().toLowerCase();
    const exist = await User.findOne({ email: normalizedEmail });
    if (exist) {
      return res.status(400).json({ message: "อีเมลนี้ถูกใช้งานแล้ว" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      password: hashedPassword,
      role,
      name,
      email: normalizedEmail,
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
  const normalizedEmail = email?.trim().toLowerCase();

  if (normalizedEmail) {
    const exist = await User.findOne({ email: normalizedEmail, _id: { $ne: req.params.id } });
    if (exist) return res.status(400).json({ message: "อีเมลนี้ถูกใช้งานแล้ว" });
  }

  await User.findByIdAndUpdate(req.params.id, {
    ...(name     && { name }),
    ...(normalizedEmail && { email: normalizedEmail }),
    ...(role     && { role }),
  });

  res.json({ message: "แก้ไขผู้ใช้สำเร็จ" });
});

/* =========================
   TOGGLE STATUS (เปลี่ยนสถานะ บล็อก / เปิดใช้งาน บัญชี)
========================= */
router.put("/users/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body; // ดึงค่า status ออกมาจาก req.body ให้ถูกต้อง

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });
    }

    // ✅ กรณีที่ 1: แจ้งเตือนเมื่อแอดมินอนุมัติ/เปิดสิทธิ์การใช้งาน (โค้ดของเพื่อน)
    if (status === "active") {
      const roleLabel = { trainer: "เทรนเนอร์", instructor: "อาจารย์" };

      // ลบ notification user_pending ออกจากแอดมินทุกคน
      await Notification.deleteMany({ ref_id: user._id, type: "user_pending" });

      // แจ้งเทรนเนอร์/อาจารย์ว่าบัญชีได้รับการอนุมัติแล้ว
      await createNotification({
        recipient_id:   user._id,
        recipient_role: user.role,
        type:           "account_activated",
        title:          "บัญชีของคุณได้รับการอนุมัติแล้ว 🎉",
        message:        `บัญชีของคุณได้รับการอนุมัติสิทธิ์เป็น "${roleLabel[user.role] ?? user.role}" เรียบร้อยแล้ว ยินดีต้อนรับเข้าสู่ระบบ`,
        ref_id:         user._id,
        ref_model:      "User",
      });
    }

    // 🔔 กรณีที่ 2: ฝังแจ้งเตือนเมื่อแอดมินเปลี่ยนสถานะผู้ใช้งานทั่วไป (โค้ดของคุณ)
    try {
      const isActionActive = status === "active";
      await Notification.create({
        userId: user._id, // ส่งหาผู้ใช้คนนั้น
        title: isActionActive ? "บัญชีของคุณเปิดใช้งานแล้ว" : "บัญชีของคุณถูกระงับสิทธิ์",
        message: isActionActive
          ? `ผู้ดูแลระบบได้เปิดใช้งานบัญชีของคุณเรียบร้อยแล้ว`
          : `บัญชีของคุณได้รับการปรับเปลี่ยนสถานะเป็นระงับการใช้งานชั่วคราว`,
        type: isActionActive ? "success" : "warning",
      });
    } catch (notiError) {
      console.error("Notification Error (Toggle Status):", notiError);
    }

    res.json({ message: "เปลี่ยนสถานะสำเร็จ" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   DELETE USER
========================= */
router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);

  // ✅ ลบ notification user_pending ของ user นี้ออกด้วย
  await Notification.deleteMany({ ref_id: req.params.id, type: "user_pending" });

  res.json({ message: "ลบผู้ใช้สำเร็จ" });
});

/* =========================
   APPROVE USER (อนุมัติสิทธิ์เทรนเนอร์ / อาจารย์ ใหม่ที่เพิ่งสมัครมา)
========================= */
router.put("/users/:id/approve", protect, adminOnly, async (req, res) => {
  try {
    // อัปเดตสถานะเป็น active และเอาข้อมูล User คนนี้ออกมาดู
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { status: "active" },
      { new: true },
    );

    // 🔔 3. ฝังแจ้งเตือนเมื่อแอดมินกด อนุมัติสิทธิ์ผู้ใช้งานสำเร็จ
    if (updatedUser) {
      try {
        // แปลงชื่อบทบาทเป็นภาษาไทย
        const roleTH =
          updatedUser.role === "trainer"
            ? "เทรนเนอร์"
            : updatedUser.role === "instructor"
              ? "อาจารย์"
              : updatedUser.role;

        await Notification.create({
          userId: updatedUser._id, // ส่งหาคนที่เพิ่งถูกแอดมินอนุมัติสิทธิ์ให้
          title: "อนุมัติสิทธิ์การใช้งานสำเร็จ",
          message: `บัญชีของคุณได้รับการอนุมัติสิทธิ์ในบทบาท '${roleTH}' เรียบร้อยแล้ว ยินดีต้อนรับเข้าสู่ระบบ`,
          type: "success",
        });
      } catch (notiError) {
        console.error("Notification Error (Approve User):", notiError);
      }
    }

    res.json({ message: "อนุมัติผู้ใช้เรียบร้อย" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== GET PENDING COUNT =====
router.get("/users/pending-count", protect, adminOnly, async (req, res) => {
  try {
    const count = await User.countDocuments({ status: "pending" });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Load pending count failed" });
  }
});

module.exports = router;
