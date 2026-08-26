// src/components/SmartInsightSection.jsx
import React from "react";
import { Sparkles, AlertTriangle, Info, Flame } from "lucide-react";

const SmartInsightSection = ({ insights }) => {
  if (!insights || insights.length === 0) return null;

  const getStyle = (type) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-emerald-50 border-emerald-200 text-emerald-900",
          icon: <Flame className="w-5 h-5 text-emerald-600 shrink-0" />,
        };
      case "warning":
        return {
          bg: "bg-amber-50 border-amber-200 text-amber-900",
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
        };
      case "danger":
        return {
          bg: "bg-rose-50 border-rose-200 text-rose-900",
          icon: <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />,
        };
      default:
        return {
          bg: "bg-blue-50 border-blue-200 text-blue-900",
          icon: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
        };
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-purple-100 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-purple-100 rounded-xl text-purple-600">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-base md:text-lg font-bold text-slate-800">
            AI Smart Health Insights (สรุปการวิเคราะห์ภาพรวม)
          </h4>
          <p className="text-xs text-slate-400">
            ประเมินความสัมพันธ์ระหว่างมวลร่างกาย สมรรถภาพ และความถี่ในการฝึก
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {insights.map((item, idx) => {
          const style = getStyle(item.type);
          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border ${style.bg} flex items-start gap-3 transition-all`}
            >
              {style.icon}
              <div className="flex-1">
                <h5 className="font-bold text-sm md:text-base mb-1">
                  {item.title}
                </h5>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  {item.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SmartInsightSection;