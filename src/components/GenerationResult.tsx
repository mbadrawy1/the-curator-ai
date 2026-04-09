"use client";

import { Download, Share2, Heart, RefreshCw } from "lucide-react";

interface GenerationResultProps {
  imageBase64: string;
  prompt: string;
  seed: number;
  steps: number;
  resolution: string;
  onRegenerate: () => void;
  isLoading: boolean;
}

export default function GenerationResult({
  imageBase64,
  prompt,
  seed,
  steps,
  resolution,
  onRegenerate,
  isLoading,
}: GenerationResultProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${imageBase64}`;
    link.download = `curator-${seed}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const dims = resolution.split(" ")[0];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="bg-navy-800 rounded-2xl p-5 border border-white/5">
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs text-gray-500">وصف الأمر (PROMPT)</span>
          <span className="text-xs text-accent-cyan">تعديل الوصف</span>
        </div>
        <p className="text-sm text-gray-200 leading-relaxed">&ldquo;{prompt}&rdquo;</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className="bg-navy-700 rounded-xl p-3 text-center">
            <p className="text-[10px] text-gray-500 mb-1">SAMPLER</p>
            <p className="text-sm font-bold text-white">DPM++ 2M</p>
          </div>
          <div className="bg-navy-700 rounded-xl p-3 text-center">
            <p className="text-[10px] text-gray-500 mb-1">DIMENSIONS</p>
            <p className="text-sm font-bold text-white">{dims}</p>
          </div>
          <div className="bg-navy-700 rounded-xl p-3 text-center">
            <p className="text-[10px] text-gray-500 mb-1">SEED</p>
            <p className="text-sm font-bold text-white">{seed}</p>
          </div>
          <div className="bg-navy-700 rounded-xl p-3 text-center">
            <p className="text-[10px] text-gray-500 mb-1">STEPS</p>
            <p className="text-sm font-bold text-white">{steps}</p>
          </div>
        </div>
      </div>

      <button
        onClick={onRegenerate}
        disabled={isLoading}
        className="w-full gradient-btn flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-xl disabled:opacity-50"
      >
        <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
        <span>إعادة التوليد بمتغيرات جديدة</span>
      </button>

      <div className="flex items-center justify-center gap-4">
        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <Share2 size={16} />
          <span>مشاركة</span>
        </button>
        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <Heart size={16} />
          <span>المفضلة</span>
        </button>
      </div>

      <div className="relative rounded-2xl overflow-hidden">
        <img
          src={`data:image/png;base64,${imageBase64}`}
          alt={prompt}
          className="w-full rounded-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-transparent" />
        <button
          onClick={handleDownload}
          className="absolute bottom-4 start-4 gradient-btn flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl"
        >
          <Download size={16} />
          <span>تحميل الصورة</span>
        </button>
      </div>
    </div>
  );
}
