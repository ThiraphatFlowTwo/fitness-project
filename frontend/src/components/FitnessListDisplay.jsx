import React from 'react';
import { evaluateMetric } from '../utils/fitnessEvaluator';

const FitnessListDisplay = ({ recordData, gender = 'male' }) => {
  // กำหนดโครงสร้างรายการที่จะนำมาแสดงผล
  const items = [
    { key: 'weight', label: 'น้ำหนัก', unit: 'kg' },
    { key: 'bmi', label: 'ดัชนีมวลกาย (BMI)', unit: '' },
    { key: 'body_fat_percent', label: 'ไขมันในร่างกาย', unit: '%' },
    { key: 'subcutaneous_fat', label: 'ไขมันใต้ผิวหนัง', unit: '%' },
    { key: 'visceral_fat_level', label: 'ระดับไขมันในช่องท้อง', unit: '' },
    { key: 'body_water', label: 'น้ำในร่างกาย', unit: '%' },
    { key: 'muscle_mass', label: 'มวลกล้ามเนื้อ', unit: 'kg' },
    { key: 'bone_mass', label: 'มวลกระดูก', unit: 'kg' },
    { key: 'protein', label: 'โปรตีน', unit: '%' },
    { key: 'bmr', label: 'พลังงานขั้นพื้นฐาน', unit: 'kcal' },
    { key: 'body_age', label: 'อายุร่างกาย', unit: '' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 divide-y divide-slate-800/60 max-w-md mx-auto">
      <div className="pb-3 text-center text-xs text-slate-400 font-medium">
        ผลการประเมินล่าสุด ({recordData?.test_date || 'ไม่ระบุวันที่'})
      </div>

      {items.map((item) => {
        const value = recordData?.[item.key];
        // หากมีสถานะจากการสแกน OCR ให้ใช้สถานะ OCR ก่อน หากไม่มีให้เข้าฟังก์ชันคำนวณอัตโนมัติ
        const evaluation = recordData?.[`${item.key}_status`] 
          ? { label: recordData[`${item.key}_status`], color: 'text-amber-400 bg-amber-500/10' }
          : evaluateMetric(item.key, value, gender);

        return (
          <div key={item.key} className="py-2.5 flex items-center justify-between text-sm">
            {/* ฝั่งซ้าย: ชื่อหัวข้อ */}
            <span className="text-slate-300">{item.label}</span>

            {/* ฝั่งขวา: ค่าตัวเลข + เกณฑ์ประเมิน */}
            <div className="flex items-center gap-3">
              <span className="font-semibold text-white">
                {value !== undefined && value !== null && value !== '' ? `${value} ${item.unit}` : '-'}
              </span>

              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${evaluation.color}`}>
                {evaluation.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FitnessListDisplay;