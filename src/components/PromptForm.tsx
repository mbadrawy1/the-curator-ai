"use client";

import { useState } from "react";
import { Wand2, Loader2, Settings2, ChevronDown, ChevronUp } from "lucide-react";

interface PromptFormProps {
  onGenerate: (data: {
    prompt: string;
    resolution: string;
    steps: number;
  }) => void;
  isLoading: boolean;
}

const RESOLUTIONS = [
  { label: "1:1 مربع", value: "1024x1024 ( 1:1 )" },
  { label: "16:9 عريض", value: "1280x720 ( 16:9 )" },
  { label: "9:16 طولي", value: "720x1280 ( 9:16 )" },
  { label: "4:3 كلاسيكي", value: "1152x864 ( 4:3 )" },
  { label: "3:2 فوتوغرافي", value: "1248x832 ( 3:2 )" },
];

export default function PromptForm({ onGenerate, isLoading }: PromptFormProps) {
  const [prompt, setPrompt] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [resolution, setResolution] = useState(RESOLUTIONS[0].value);
  const [steps, setSteps] = useState(8);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onGenerate({ prompt: prompt.trim(), resolution, steps });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="bg-navy-800 rounded-2xl p-4 border border-white/5 card-glow">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='أدخل وصف الصورة المطلوبة... مثال: "بورتريه سينمائي لشخصية فضائية غامضة، إضاءة درامية"'
          className="w-full bg-transparent text-white placeholder-gray-500 text-sm resize-none outline-none min-h-[100px] p-2"
          dir="rtl"
        />

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <Settings2 size={14} />
            <span>إعدادات متقدمة</span>
            {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="gradient-btn flex items-center gap-2 text-white text-sm font-semibold px-6 py-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>جارٍ التوليد...</span>
              </>
            ) : (
              <>
                <Wand2 size={16} />
                <span>توليد الصورة</span>
              </>
            )}
          </button>
        </div>

        {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">
                الدقة
              </label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full bg-navy-700 text-white text-sm rounded-lg px-3 py-2 border border-white/10 outline-none"
              >
                {RESOLUTIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">
                خطوات التوليد: {steps}
              </label>
              <input
                type="range"
                min={4}
                max={20}
                value={steps}
                onChange={(e) => setSteps(Number(e.target.value))}
                className="w-full accent-accent-cyan"
              />
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
