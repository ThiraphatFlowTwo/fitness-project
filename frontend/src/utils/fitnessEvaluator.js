// src/utils/fitnessEvaluator.js

// Helper คืนค่ารูปแบบสไตล์ UI Badge
const createEval = (label, status, colorType) => {
  const styles = {
    green: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    yellow: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    red: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    gray: "text-slate-400 bg-slate-800 border-slate-700",
  };
  return { label, status, color: colorType, badgeClass: styles[colorType] || styles.gray };
};

// ==========================================
// 1. OBESITY ANALYSIS (การวิเคราะห์ภาวะอ้วน & ลงพุง)
// ==========================================

// 1.1 BMI (Body Mass Index - เกณฑ์เอเชีย)
export const evaluateBMI = (bmi) => {
  if (bmi === undefined || bmi === null || bmi === '') return createEval('ไม่มีข้อมูล', 'unknown', 'gray');
  const val = parseFloat(bmi);
  if (val < 18.5) return createEval('น้ำหนักน้อย / ผอม', 'underweight', 'yellow');
  if (val <= 22.9) return createEval('ปกติ (สมส่วน)', 'normal', 'green');
  if (val <= 24.9) return createEval('ท้วม / น้ำหนักเกิน', 'overweight', 'yellow');
  if (val <= 29.9) return createEval('อ้วนระดับ 1', 'obese1', 'orange');
  return createEval('อ้วนอันตราย (ระดับ 2)', 'obese2', 'red');
};

// 1.2 % ไขมันในร่างกาย (% Body Fat / PBF)
export const evaluateBodyFat = (bodyFat, gender = 'male') => {
  if (bodyFat === undefined || bodyFat === null || bodyFat === '') return createEval('ไม่มีข้อมูล', 'unknown', 'gray');
  const val = parseFloat(bodyFat);
  const isMale = gender?.toLowerCase() === 'male' || gender === 'ชาย';

  if (isMale) {
    if (val < 10) return createEval('ต่ำกว่าเกณฑ์', 'low', 'yellow');
    if (val <= 20) return createEval('มาตรฐาน (สมส่วน)', 'normal', 'green');
    if (val <= 25) return createEval('เริ่มสูง', 'high', 'yellow');
    return createEval('ไขมันเกินเกณฑ์', 'very_high', 'red');
  } else {
    if (val < 18) return createEval('ต่ำกว่าเกณฑ์', 'low', 'yellow');
    if (val <= 28) return createEval('มาตรฐาน (สมส่วน)', 'normal', 'green');
    if (val <= 33) return createEval('เริ่มสูง', 'high', 'yellow');
    return createEval('ไขมันเกินเกณฑ์', 'very_high', 'red');
  }
};

// 1.3 ระดับไขมันช่องท้อง (Visceral Fat Level)
export const evaluateVisceralFat = (level) => {
  if (level === undefined || level === null || level === '') return createEval('ไม่มีข้อมูล', 'unknown', 'gray');
  const val = parseFloat(level);
  if (val <= 9) return createEval('ปกติ (ปลอดภัย)', 'normal', 'green');
  if (val <= 14) return createEval('เริ่มสูง (ควรระวัง)', 'high', 'orange');
  return createEval('อันตรายสูงมาก', 'danger', 'red');
};

// 1.4 เส้นรอบเอว (Waist Circumference - ซม.)
export const evaluateWaist = (waistCm, gender = 'male') => {
  if (waistCm === undefined || waistCm === null || waistCm === '') return createEval('ไม่มีข้อมูล', 'unknown', 'gray');
  const val = parseFloat(waistCm);
  const isMale = gender?.toLowerCase() === 'male' || gender === 'ชาย';
  const threshold = isMale ? 90 : 80;

  if (val <= threshold) return createEval('ปกติ', 'normal', 'green');
  return createEval('ภาวะลงพุง', 'abdominal_obesity', 'red');
};

// 1.5 อัตราส่วนเอวต่อสะโพก (Waist-to-Hip Ratio - WHR)
export const evaluateWHR = (whr, gender = 'male') => {
  if (whr === undefined || whr === null || whr === '') return createEval('ไม่มีข้อมูล', 'unknown', 'gray');
  const val = parseFloat(whr);
  const isMale = gender?.toLowerCase() === 'male' || gender === 'ชาย';
  const threshold = isMale ? 0.90 : 0.85;

  if (val <= threshold) return createEval('สมส่วน', 'normal', 'green');
  return createEval('เสี่ยงอ้วนลงพุง', 'high_risk', 'red');
};

// ==========================================
// 2. BODY COMPOSITION (การวิเคราะห์องค์ประกอบร่างกาย)
// ==========================================

// 2.1 มวลกล้ามเนื้อ (Muscle Mass Rate / %)
export const evaluateMuscle = (muscle, gender = 'male') => {
  if (muscle === undefined || muscle === null || muscle === '') return createEval('ไม่มีข้อมูล', 'unknown', 'gray');
  const val = parseFloat(muscle);
  const isMale = gender?.toLowerCase() === 'male' || gender === 'ชาย';

  const lowThresh = isMale ? 49 : 38;
  const normalThresh = isMale ? 59 : 47;

  if (val < lowThresh) return createEval('ต่ำกว่าเกณฑ์', 'low', 'yellow');
  if (val <= normalThresh) return createEval('มาตรฐาน', 'normal', 'green');
  return createEval('สูง / ดีมาก', 'high', 'blue');
};

// 2.2 โปรตีน (% Protein)
export const evaluateProtein = (protein) => {
  if (protein === undefined || protein === null || protein === '') return createEval('ไม่มีข้อมูล', 'unknown', 'gray');
  const val = parseFloat(protein);
  if (val < 16) return createEval('ต่ำกว่าเกณฑ์', 'low', 'yellow');
  if (val <= 20) return createEval('มาตรฐาน', 'normal', 'green');
  return createEval('สูง / สมบูรณ์', 'high', 'blue');
};

// 2.3 กระดูก / แร่ธาตุ (Bone Mineral Mass - กก.)
export const evaluateBoneMass = (bone, weight = 60, gender = 'male') => {
  if (bone === undefined || bone === null || bone === '') return createEval('ไม่มีข้อมูล', 'unknown', 'gray');
  const bVal = parseFloat(bone);
  const wVal = parseFloat(weight);
  const isMale = gender?.toLowerCase() === 'male' || gender === 'ชาย';

  let min = 2.5;
  if (isMale) {
    if (wVal < 60) min = 2.5;
    else if (wVal <= 75) min = 2.9;
    else min = 3.2;
  } else {
    if (wVal < 45) min = 1.95;
    else if (wVal <= 60) min = 2.4;
    else min = 2.5;
  }

  if (bVal < min) return createEval('ต่ำกว่าเกณฑ์', 'low', 'yellow');
  return createEval('มาตรฐาน', 'normal', 'green');
};

// 2.4 น้ำในร่างกาย (% Total Body Water)
export const evaluateBodyWater = (water, gender = 'male') => {
  if (water === undefined || water === null || water === '') return createEval('ไม่มีข้อมูล', 'unknown', 'gray');
  const val = parseFloat(water);
  const isMale = gender?.toLowerCase() === 'male' || gender === 'ชาย';

  const min = isMale ? 55 : 45;
  const max = isMale ? 65 : 60;

  if (val < min) return createEval('ต่ำกว่าเกณฑ์', 'low', 'yellow');
  if (val <= max) return createEval('มาตรฐาน', 'normal', 'green');
  return createEval('สูง', 'high', 'blue');
};

// 2.5 พลังงานขั้นพื้นฐาน (BMR)
export const evaluateBMR = (bmr) => {
  if (bmr === undefined || bmr === null || bmr === '') return createEval('ไม่มีข้อมูล', 'unknown', 'gray');
  const val = parseFloat(bmr);
  if (val < 1200) return createEval('อัตราเผาผลาญต่ำ', 'low', 'yellow');
  return createEval('มาตรฐาน', 'normal', 'green');
};

// 2.6 อายุร่างกาย (Body Age / Metabolic Age)
export const evaluateBodyAge = (bodyAge, realAge = 25) => {
  if (bodyAge === undefined || bodyAge === null || bodyAge === '') return createEval('ไม่มีข้อมูล', 'unknown', 'gray');
  const bAge = parseFloat(bodyAge);
  const rAge = parseFloat(realAge);

  if (bAge < rAge) return createEval('อ่อนกว่าวัย (ดีเยี่ยม)', 'younger', 'green');
  if (bAge === rAge) return createEval('มาตรฐานเท่าอายุจริง', 'normal', 'green');
  return createEval('แก่กว่าอายุจริง', 'older', 'red');
};

// 2.7 VO2 Max (สมรรถภาพหัวใจและปอด)
export const evaluateVO2Max = (vo2max, age = 25, gender = 'male') => {
  if (vo2max === undefined || vo2max === null || vo2max === '') return createEval('ไม่มีข้อมูล', 'unknown', 'gray');
  const val = parseFloat(vo2max);
  const isMale = gender?.toLowerCase() === 'male' || gender === 'ชาย';

  if (isMale) {
    if (val >= 52) return createEval('ดีเยี่ยม (Excellent)', 'excellent', 'green');
    if (val >= 42) return createEval('ดี (Good)', 'good', 'green');
    if (val >= 35) return createEval('ปานกลาง (Fair)', 'fair', 'yellow');
    return createEval('ควรปรับปรุง (Poor)', 'poor', 'red');
  } else {
    if (val >= 45) return createEval('ดีเยี่ยม (Excellent)', 'excellent', 'green');
    if (val >= 35) return createEval('ดี (Good)', 'good', 'green');
    if (val >= 30) return createEval('ปานกลาง (Fair)', 'fair', 'yellow');
    return createEval('ควรปรับปรุง (Poor)', 'poor', 'red');
  }
};

// ==========================================
// ฟังก์ชันประมวลผลรวมสำหรับทั้ง Record
// ==========================================
export const evaluateFitnessRecord = (data, traineeInfo = {}) => {
  const { age = 25, gender = 'male' } = traineeInfo;

  return {
    // Body Composition Evaluation
    weight: createEval(data.weight ? 'บันทึกแล้ว' : 'ไม่มีข้อมูล', 'info', 'blue'),
    muscleMass: evaluateMuscle(data.muscle_mass || data.skeletal_muscle_mass || data.muscleMass, gender),
    fatMass: createEval(data.fat_mass || data.fatMass ? 'บันทึกแล้ว' : 'ไม่มีข้อมูล', 'info', 'blue'),
    protein: evaluateProtein(data.protein),
    boneMass: evaluateBoneMass(data.bone_mass || data.boneMass, data.weight, gender),
    bodyWater: evaluateBodyWater(data.body_water || data.total_body_water || data.bodyWater, gender),

    // Obesity Analysis Evaluation
    bmi: evaluateBMI(data.bmi),
    pbf: evaluateBodyFat(data.body_fat_percent || data.bodyFat || data.pbf, gender),
    visceralFat: evaluateVisceralFat(data.visceral_fat_level || data.visceralFat),
    waist: evaluateWaist(data.waist_cm || data.waist, gender),
    whr: evaluateWHR(data.waist_hip_ratio || data.whr, gender),

    // Additional Metrics
    bmr: evaluateBMR(data.bmr || data.estimated_bmr),
    bodyAge: evaluateBodyAge(data.body_age || data.bodyAge, age),
    vo2Max: evaluateVO2Max(data.vo2_max || data.vo2Max, age, gender),
    evaluatedAt: new Date(),
  };
};

// ==========================================
// AI SMART HEALTH INSIGHTS
// ==========================================
export const generateSmartAnalysis = ({
  bmiChange,
  bodyFatChange,
  muscleMassChange,
  vo2MaxChange,
  trainingCount,
}) => {
  const insights = [];

  const bmiDiff = parseFloat(bmiChange || 0);
  const fatDiff = parseFloat(bodyFatChange || 0);
  const muscleDiff = parseFloat(muscleMassChange || 0);
  const vo2Diff = parseFloat(vo2MaxChange || 0);

  if ((Math.abs(bmiDiff) <= 0.3 && fatDiff <= -0.5) || muscleDiff >= 0.5) {
    insights.push({
      type: "success",
      title: "🔥 เกิดภาวะ Body Recomposition / มวลกล้ามเนื้อเพิ่มขึ้น",
      detail: "มวลกล้ามเนื้อมีการพัฒนาเพิ่มขึ้น หรือ % ไขมันลดลง บ่งชี้ว่ามีการสร้างมวลกล้ามเนื้อเข้ามาแทนที่ไขมันอย่างมีประสิทธิภาพ",
    });
  } else if (bmiDiff > 0.3 && fatDiff <= -0.5) {
    insights.push({
      type: "success",
      title: "💪 มวลกล้ามเนื้อเพิ่มขึ้นอย่างมีคุณภาพ (Lean Bulk)",
      detail: "BMI เพิ่มขึ้นร่วมกับ % ไขมันที่ลดลง แสดงว่าน้ำหนักที่เพิ่มขึ้นมาจากมวลกล้ามเนื้อเป็นหลัก",
    });
  }

  if (bmiDiff < -0.3 && fatDiff <= -0.5) {
    insights.push({
      type: "info",
      title: "📉 สุขภาพและรูปร่างดีขึ้นต่อเนื่อง",
      detail: "ทั้ง BMI และ % ไขมันลดลง แสดงถึงการเผาผลาญไขมันสะสมได้ดี",
    });
  }

  if (trainingCount >= 4 && vo2Diff <= -1.5) {
    insights.push({
      type: "warning",
      title: "⚠️ สมรรถภาพหัวใจ-ปอดลดลง ทั้งที่เข้าฝึกสม่ำเสมอ",
      detail: "VO2 Max มีแนวโน้มลดลงแม้จะฝึกซ้อมต่อเนื่อง อาจเกิดจากภาวะล้าสะสม (Overtraining), พักผ่อนไม่พอ หรือโปรแกรมเข้มข้นเกินไป ควรพิจารณาปรับช่วง Rest Days",
    });
  }

  if ((bmiDiff < -0.3 && fatDiff > 0) || muscleDiff <= -0.5) {
    insights.push({
      type: "danger",
      title: "🚨 สัญญาณสูญเสียมวลกล้ามเนื้อ (Muscle Loss)",
      detail: "มวลกล้ามเนื้อมีแนวโน้มลดลง บ่งชี้ว่าน้ำหนักที่หายไปอาจเป็นมวลกล้ามเนื้อและน้ำ ควรเพิ่มโปรแกรมเวทเทรนนิ่งและเสริมโปรตีน",
    });
  }

  if (insights.length === 0) {
    insights.push({
      type: "neutral",
      title: "📊 รักษาระดับสมรรถภาพได้ดี",
      detail: "แนวโน้มร่างกายอยู่ในเกณฑ์เสถียร แนะนำให้ฝึกซ้อมตามโปรแกรมอย่างต่อเนื่อง",
    });
  }

  return insights;
};