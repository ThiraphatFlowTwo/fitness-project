// controllers/fitnessController.js
import Fitness from '../models/Fitness.js';
import Trainee from '../models/Trainee.js';
import { evaluateFitnessRecord } from '../utils/fitnessEvaluator.js';

export const createFitnessRecord = async (req, res) => {
  try {
    const { traineeId, weight, height, bodyFat, vo2Max } = req.body;

    // 1. ดึงข้อมูล Trainee เพื่อนำ เพศ และ อายุ มาใช้ประเมินเกณฑ์
    const trainee = await Trainee.findById(traineeId);
    if (!trainee) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลผู้รับการฝึก' });
    }

    // คำนวณ BMI อัตโนมัติ (ถ้าไม่ได้ส่งมา)
    const heightInMeters = height / 100;
    const calculatedBMI = weight / (heightInMeters * heightInMeters);

    // 2. วิเคราะห์และแปลผลอัตโนมัติ (Automated Evaluation)
    const evaluationResult = evaluateFitnessRecord(
      { bmi: calculatedBMI, bodyFat, vo2Max },
      { age: trainee.age, gender: trainee.gender }
    );

    // 3. บันทึกลง DB พร้อมผลการแปลผล
    const newRecord = new Fitness({
      traineeId,
      trainerId: req.user.id,
      weight,
      height,
      bmi: Number(calculatedBMI.toFixed(1)),
      bodyFat,
      vo2Max,
      evaluation: evaluationResult, // เก็บผลวิเคราะห์ลงใน DB
      recordedAt: new Date(),
    });

    await newRecord.save();

    res.status(201).json({
      message: 'บันทึกข้อมูลและประมวลผลเรียบร้อยแล้ว',
      data: newRecord,
    });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการประมวลผล', error: error.message });
  }
};