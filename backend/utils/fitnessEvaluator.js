// src/utils/fitnessEvaluator.js

// ==========================================
// 1. แปลผล BMI (Body Mass Index)
// ==========================================
export const evaluateBMI = (bmi) => {
  if (!bmi && bmi !== 0) return { label: 'ไม่มีข้อมูล', status: 'unknown', color: 'gray' };
  
  const val = parseFloat(bmi);
  if (val < 18.5) {
    return { label: 'ผอม / น้ำหนักน้อย', status: 'underweight', color: 'yellow', score: 2 };
  } else if (val <= 22.9) {
    return { label: 'สมส่วน / ปกติ', status: 'normal', color: 'green', score: 5 };
  } else if (val <= 24.9) {
    return { label: 'น้ำหนักเกิน (ท่วม)', status: 'overweight', color: 'yellow', score: 3 };
  } else if (val <= 29.9) {
    return { label: 'อ้วนระดับ 1', status: 'obese1', color: 'orange', score: 2 };
  } else {
    return { label: 'อ้วนระดับ 2 (อ้วนมาก)', status: 'obese2', color: 'red', score: 1 };
  }
};

// ==========================================
// 2. แปลผลเปอร์เซ็นต์ไขมัน (% Body Fat) อ้างอิงตามเพศ
// ==========================================
export const evaluateBodyFat = (bodyFat, gender = 'male') => {
  if (!bodyFat && bodyFat !== 0) return { label: 'ไม่มีข้อมูล', status: 'unknown', color: 'gray' };

  const val = parseFloat(bodyFat);
  const isMale =
    gender?.toLowerCase() === 'male' ||
    gender === 'ชาย' ||
    gender === 'ชาย/Male';

  if (isMale) {
    if (val < 6) return { label: 'ไขมันต่ำเกินไป', status: 'low', color: 'yellow' };
    if (val <= 13) return { label: 'นักกีฬา (Athlete)', status: 'excellent', color: 'green' };
    if (val <= 17) return { label: 'ฟิต / สุขภาพดีมาก', status: 'good', color: 'green' };
    if (val <= 24) return { label: 'มาตรฐานทั่วไป', status: 'normal', color: 'blue' };
    return { label: 'ไขมันสูงเกินเกณฑ์', status: 'high', color: 'red' };
  } else {
    // Female
    if (val < 14) return { label: 'ไขมันต่ำเกินไป', status: 'low', color: 'yellow' };
    if (val <= 20) return { label: 'นักกีฬา (Athlete)', status: 'excellent', color: 'green' };
    if (val <= 24) return { label: 'ฟิต / สุขภาพดีมาก', status: 'good', color: 'green' };
    if (val <= 31) return { label: 'มาตรฐานทั่วไป', status: 'normal', color: 'blue' };
    return { label: 'ไขมันสูงเกินเกณฑ์', status: 'high', color: 'red' };
  }
};

// ==========================================
// 3. แปลผล VO2 Max (ความฟิตของระบบหัวใจและปอด)
// ==========================================
export const evaluateVO2Max = (vo2max, age = 25, gender = 'male') => {
  if (!vo2max && vo2max !== 0) return { label: 'ไม่มีข้อมูล', status: 'unknown', color: 'gray' };

  const val = parseFloat(vo2max);
  const isMale =
    gender?.toLowerCase() === 'male' ||
    gender === 'ชาย' ||
    gender === 'ชาย/Male';

  if (isMale) {
    if (val >= 52) return { label: 'ดีเยี่ยม (Excellent)', status: 'excellent', color: 'green' };
    if (val >= 42) return { label: 'ดี (Good)', status: 'good', color: 'green' };
    if (val >= 35) return { label: 'ปานกลาง (Fair)', status: 'fair', color: 'yellow' };
    return { label: 'ควรปรับปรุง (Poor)', status: 'poor', color: 'red' };
  } else {
    if (val >= 45) return { label: 'ดีเยี่ยม (Excellent)', status: 'excellent', color: 'green' };
    if (val >= 35) return { label: 'ดี (Good)', status: 'good', color: 'green' };
    if (val >= 30) return { label: 'ปานกลาง (Fair)', status: 'fair', color: 'yellow' };
    return { label: 'ควรปรับปรุง (Poor)', status: 'poor', color: 'red' };
  }
};

// ==========================================
// 4. ฟังก์ชันประมวลผลภาพรวมรายครั้ง (Overall Evaluator)
// ==========================================
export const evaluateFitnessRecord = (data, traineeInfo = {}) => {
  const { age = 25, gender = 'male' } = traineeInfo;

  const bmiEval = evaluateBMI(data.bmi);
  const fatEval = evaluateBodyFat(data.bodyFat || data.body_fat_percent, gender);
  const vo2Eval = evaluateVO2Max(data.vo2Max || data.vo2_max, age, gender);

  return {
    bmi: bmiEval,
    bodyFat: fatEval,
    vo2Max: vo2Eval,
    evaluatedAt: new Date(),
  };
};

// ==========================================
// 5. AI SMART HEALTH INSIGHTS (วิเคราะห์ความสัมพันธ์เชิงซ้อน)
// ==========================================
export const generateSmartAnalysis = ({
  bmiChange,
  bodyFatChange,
  vo2MaxChange,
  trainingCount,
}) => {
  const insights = [];

  const bmiDiff = parseFloat(bmiChange || 0);
  const fatDiff = parseFloat(bodyFatChange || 0);
  const vo2Diff = parseFloat(vo2MaxChange || 0);

  // -------------------------------------------------------------
  // เคส 1: Body Recomposition (BMI คงที่/ขึ้นเล็กน้อย แต่ % ไขมันลด)
  // -------------------------------------------------------------
  if (Math.abs(bmiDiff) <= 0.3 && fatDiff <= -0.5) {
    insights.push({
      type: "success",
      title: "🔥 เกิดภาวะ Body Recomposition (หุ่นเปลี่ยนชัดเจน)",
      detail:
        "น้ำหนัก/BMI ค่อนข้างคงที่ แต่เปอร์เซ็นต์ไขมันลดลง บ่งชี้ว่ามีการสร้างมวลกล้ามเนื้อเข้ามาแทนที่ไขมันอย่างมีประสิทธิภาพ",
    });
  } else if (bmiDiff > 0.3 && fatDiff <= -0.5) {
    insights.push({
      type: "success",
      title: "💪 มวลกล้ามเนื้อเพิ่มขึ้นอย่างมีคุณภาพ (Lean Bulk)",
      detail:
        "BMI เพิ่มขึ้นร่วมกับ % ไขมันที่ลดลง แสดงว่าน้ำหนักที่เพิ่มขึ้นมาจากมวลกล้ามเนื้อเป็นหลัก",
    });
  }

  // -------------------------------------------------------------
  // เคส 2: Fat Loss & Weight Loss (ลงทั้งน้ำหนักและไขมัน)
  // -------------------------------------------------------------
  if (bmiDiff < -0.3 && fatDiff <= -0.5) {
    insights.push({
      type: "info",
      title: "📉 สุขภาพและรูปร่างดีขึ้นต่อเนื่อง",
      detail: "ทั้ง BMI และ % ไขมันลดลง แสดงถึงการเผาผลาญไขมันสะสมได้ดี",
    });
  }

  // -------------------------------------------------------------
  // เคส 3: Overtraining Warning (ซ้อมสม่ำเสมอ แต่ VO2 Max ลด)
  // -------------------------------------------------------------
  if (trainingCount >= 4 && vo2Diff <= -1.5) {
    insights.push({
      type: "warning",
      title: "⚠️ สมรรถภาพหัวใจ-ปอดลดลง ทั้งที่เข้าฝึกสม่ำเสมอ",
      detail:
        "VO2 Max มีแนวโน้มลดลงแม้จะฝึกซ้อมต่อเนื่อง อาจเกิดจากภาวะล้าสะสม (Overtraining), พักผ่อนไม่พอ หรือโปรแกรมเข้มข้นเกินไป ควรพิจารณาปรับช่วง Rest Days",
    });
  }

  // -------------------------------------------------------------
  // เคส 4: Muscle Loss Warning (BMI ลด แต่ % ไขมันเพิ่ม)
  // -------------------------------------------------------------
  if (bmiDiff < -0.3 && fatDiff > 0) {
    insights.push({
      type: "danger",
      title: "🚨 สัญญาณสูญเสียมวลกล้ามเนื้อ (Muscle Loss)",
      detail:
        "BMI ลดลงแต่ % ไขมันกลับเพิ่มขึ้น บ่งชี้ว่าน้ำหนักที่หายไปอาจเป็นมวลกล้ามเนื้อและน้ำ ควรเพิ่มโปรแกรมเวทเทรนนิ่งและเสริมโปรตีน",
    });
  }

  // กรณีที่ผลประเมินอยู่ในเกณฑ์ปกติ
  if (insights.length === 0) {
    insights.push({
      type: "neutral",
      title: "📊 รักษาระดับสมรรถภาพได้ดี",
      detail:
        "แนวโน้มร่างกายอยู่ในเกณฑ์เสถียร แนะนำให้ฝึกซ้อมตามโปรแกรมอย่างต่อเนื่อง",
    });
  }

  return insights;
};