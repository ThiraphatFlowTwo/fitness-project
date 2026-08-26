const mongoose = require("mongoose");

const physicalFitnessSchema = new mongoose.Schema(
  {
    // trainee_id = FK → Trainee
    trainee_id: { type: mongoose.Schema.Types.ObjectId, ref: "Trainee", required: true },
    test_date:  { type: Date, required: true },

    // 🏋️‍♂️ 1. การวิเคราะห์องค์ประกอบร่างกาย (Body Composition)
    weight:               { type: Number }, // น้ำหนัก (kg)
    skeletal_muscle_mass: { type: Number }, // มวลกล้ามเนื้อลาย SMM (kg)
    body_fat_mass:        { type: Number }, // มวลไขมัน FM (kg)
    protein:              { type: Number }, // โปรตีน (kg)
    minerals:             { type: Number }, // กระดูก/แร่ธาตุ (kg)
    total_body_water:     { type: Number }, // น้ำในร่างกาย TBW (kg)

    // 📏 2. การวิเคราะห์ภาวะอ้วน & พุง (Obesity Analysis)
    bmi:                 { type: Number }, // BMI
    body_fat_percent:    { type: Number }, // % ไขมันร่างกาย PBF
    visceral_fat_level:  { type: Number }, // ระดับไขมันช่องท้อง
    waist_circumference: { type: Number }, // เส้นรอบเอว (cm)
    waist_hip_ratio:     { type: Number }, // อัตราส่วนเอว/สะโพก WHR

    // 📊 3. การประเมินโดยรวม & พลังงาน (Overall Evaluation)
    body_age:      { type: Number }, // อายุกาย (ปี)
    estimated_bmr: { type: Number }, // BMR (kcal)
    tdee:          { type: Number }, // TDEE (kcal)
    body_score:    { type: Number }, // คะแนนร่างกาย (Score)

    // 🫀 4. สัญญาณชีพ & ความดันโลหิต (Vital Signs)
    sys_bp:             { type: Number }, // ความดันตัวบน (mmHg)
    dia_bp:             { type: Number }, // ความดันตัวล่าง (mmHg)
    resting_heart_rate: { type: Number }, // ชีพจร (bpm)

    // 📐 5. การวัดความหนาของผิวหนัง (Skinfold Thickness - มม.) [เพิ่มใหม่]
    skinfold_biceps_right: { type: Number },
    skinfold_biceps_left:  { type: Number },
    skinfold_triceps_right:{ type: Number },
    skinfold_triceps_left: { type: Number },
    skinfold_subscapular:  { type: Number },
    skinfold_suprailiac:   { type: Number },

    // 🧘 6. ความอ่อนตัว & การทดสอบเคลื่อนไหว (ซม.) [เพิ่มใหม่]
    sit_and_reach:       { type: Number },
    back_scratch_right:  { type: Number },
    back_scratch_left:   { type: Number },

    // ⚡ 7. แรงกล้ามเนื้อ (กก.) [เพิ่มใหม่]
    grip_strength_right: { type: Number },
    grip_strength_left:  { type: Number },
    leg_strength:        { type: Number },

    // 📌 อื่นๆ / หมายเหตุ
    muscle_strength: { type: String }, // ความแข็งแรงกล้ามเนื้อ
    flexibility:     { type: String }, // ความอ่อนตัว (แบบระบุข้อความ)
    vo2_max:         { type: Number }, // VO2 Max
    remark:          { type: String }  // คำแนะนำเพิ่มเติม
  },
  { timestamps: true }
);

module.exports = mongoose.model("PhysicalFitness", physicalFitnessSchema);