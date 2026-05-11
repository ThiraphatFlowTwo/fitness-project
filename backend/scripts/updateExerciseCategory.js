const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);

const Exercise = require("../models/exercise.model");

const run = async () => {
  try {
    // weight — ท่าที่ใช้น้ำหนัก
    const weightTypes = ["หลัง", "หน้าอก", "หัวไหล่", "ขา", "แขน", "ทุกส่วนของร่างกาย", "ทั่วทั้งร่างกาย"];
    for (const t of weightTypes) {
      const r = await Exercise.updateMany(
        { exercise_type: t, exercise_category: { $exists: false } },
        { $set: { exercise_category: "weight" } }
      );
      console.log(`✅ weight   → ${t}: ${r.modifiedCount} รายการ`);
    }

    // cardio
    const r2 = await Exercise.updateMany(
      { exercise_type: "คาร์ดิโอ", exercise_category: { $exists: false } },
      { $set: { exercise_category: "cardio" } }
    );
    console.log(`✅ cardio   → คาร์ดิโอ: ${r2.modifiedCount} รายการ`);

    // bodyweight — อุปกรณ์ calisthenics หรือ other
    const r3 = await Exercise.updateMany(
      { 
        equipment_type: { $in: ["calisthenics", "other"] },
        exercise_category: { $exists: false }
      },
      { $set: { exercise_category: "bodyweight" } }
    );
    console.log(`✅ bodyweight → calisthenics/other: ${r3.modifiedCount} รายการ`);

    // แกนกลางลำตัว → bodyweight
    const r4 = await Exercise.updateMany(
      { exercise_type: "แกนกลางลำตัว", exercise_category: { $exists: false } },
      { $set: { exercise_category: "bodyweight" } }
    );
    console.log(`✅ bodyweight → แกนกลางลำตัว: ${r4.modifiedCount} รายการ`);

    // ที่เหลือยังไม่มี category → weight เป็น default
    const r5 = await Exercise.updateMany(
      { exercise_category: { $exists: false } },
      { $set: { exercise_category: "weight" } }
    );
    console.log(`✅ default weight → อื่นๆ: ${r5.modifiedCount} รายการ`);

    console.log("\n🎉 อัปเดตสำเร็จทั้งหมด!");
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    mongoose.disconnect();
    console.log("🔌 ปิดการเชื่อมต่อ MongoDB แล้ว");
  }
};

run();