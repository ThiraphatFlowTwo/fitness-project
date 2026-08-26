import React, { useRef, useState } from "react";
import { Download, Share2, X, Trophy, Activity, Dumbbell, Calendar, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const TraineeReportModal = ({ isOpen, onClose, trainee, metrics, trainingLogs, smartInsights }) => {
  const reportRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen || !trainee) return null;

  // 1. ฟังก์ชันดาวน์โหลดเป็นรูปภาพ (PNG)
  const handleDownloadImage = async () => {
    if (!reportRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `Fitness_Report_${trainee.name}_${new Date().toISOString().slice(0,10)}.png`;
      link.click();
    } catch (err) {
      console.error("Export Image Error:", err);
      alert("เกิดข้อผิดพลาดในการดาวน์โหลดรูปภาพ");
    } finally {
      setDownloading(false);
    }
  };

  // 2. ฟังก์ชันดาวน์โหลดเป็นไฟล์ PDF
  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
      pdf.save(`Fitness_Report_${trainee.name}_${new Date().toISOString().slice(0,10)}.pdf`);
    } catch (err) {
      console.error("Export PDF Error:", err);
      alert("เกิดข้อผิดพลาดในการดาวน์โหลด PDF");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-800 shadow-2xl overflow-hidden my-8">
        
        {/* Header Modal */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Share2 className="w-5 h-5 text-purple-400" /> ตัวอย่างรายงานพัฒนาการ
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= AREA TO BE CAPTURED / EXPORTED ================= */}
        <div className="p-4 sm:p-6 flex justify-center bg-slate-950">
          <div
            ref={reportRef}
            className="w-full bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden"
          >
            {/* Background Graphic Effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Brand Header */}
            <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-black tracking-widest uppercase bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">
                  FITNESS PROGRESS REPORT
                </span>
                <h2 className="text-2xl font-black text-white mt-2">{trainee.name}</h2>
                <p className="text-xs text-slate-400 mt-0.5">เป้าหมาย: {trainee.goal || "พัฒนาสุขภาพโดยรวม"}</p>
              </div>
              <div className="text-right">
                <div className="p-2.5 bg-purple-600/20 rounded-2xl border border-purple-500/30 inline-block">
                  <Trophy className="w-6 h-6 text-purple-400" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  {new Date().toLocaleDateString("th-TH", { month: "long", year: "numeric" })}
                </p>
              </div>
            </div>

            {/* Metrics Highlights Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white/5 border border-white/10 p-3 rounded-2xl text-center">
                <span className="text-[10px] text-slate-400 font-bold block mb-1">BMI</span>
                <span className="text-xl font-black text-blue-400">{metrics?.bmi?.value ?? "-"}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  ({metrics?.bmi?.change > 0 ? `+${metrics.bmi.change}` : metrics?.bmi?.change || "0"})
                </span>
              </div>
              <div className="bg-white/5 border border-white/10 p-3 rounded-2xl text-center">
                <span className="text-[10px] text-slate-400 font-bold block mb-1">% ไขมัน</span>
                <span className="text-xl font-black text-emerald-400">{metrics?.bodyFat?.value ? `${metrics.bodyFat.value}%` : "-"}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  ({metrics?.bodyFat?.change > 0 ? `+${metrics.bodyFat.change}` : metrics?.bodyFat?.change || "0"}%)
                </span>
              </div>
              <div className="bg-white/5 border border-white/10 p-3 rounded-2xl text-center">
                <span className="text-[10px] text-slate-400 font-bold block mb-1">มวลกล้ามเนื้อ</span>
                <span className="text-xl font-black text-amber-400">{metrics?.muscleMass?.value ? `${metrics.muscleMass.value} kg` : "-"}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  ({metrics?.muscleMass?.change > 0 ? `+${metrics.muscleMass.change}` : metrics?.muscleMass?.change || "0"} kg)
                </span>
              </div>
            </div>

            {/* Smart Insights Summary */}
            {smartInsights && smartInsights.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> บทวิเคราะห์พัฒนาการ
                </h4>
                <ul className="space-y-2">
                  {smartInsights.slice(0, 2).map((item, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-purple-400 font-bold">•</span>
                      <div>
                        <span className="font-bold text-white">{item.title}: </span>
                        <span>{item.detail}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Stats Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4 text-purple-400" />
                <span>ซ้อมไปทั้งหมด <strong className="text-white">{trainingLogs?.length || 0}</strong> ครั้ง</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>อัปเดตล่าสุด {new Date().toLocaleDateString("th-TH")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 sm:p-6 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
          <button
            disabled={downloading}
            onClick={handleDownloadImage}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition-all text-sm"
          >
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4 text-purple-400" />}
            บันทึกเป็นรูปภาพ (Share)
          </button>
          
          <button
            disabled={downloading}
            onClick={handleDownloadPDF}
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-600/20 text-sm"
          >
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            ดาวน์โหลดรายงาน (PDF)
          </button>
        </div>

      </div>
    </div>
  );
};

export default TraineeReportModal;