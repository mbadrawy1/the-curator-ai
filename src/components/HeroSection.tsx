"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-accent-cyan/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-purple/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-navy-700/50 border border-white/10 text-xs text-gray-300 px-4 py-1.5 rounded-full mb-6">
          <Sparkles size={14} className="text-accent-cyan" />
          <span>مدعوم بالذكاء الاصطناعي</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
          <span className="gradient-text">مختبر الخيال</span>
          <br />
          <span className="text-white">الرقمي</span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          حوّل أفكارك إلى أعمال بصرية مذهلة في ثوانٍ معدودة باستخدام أقوى
          نماذج الذكاء الاصطناعي.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/generate"
            className="gradient-btn text-white font-semibold px-8 py-3 rounded-xl text-lg"
          >
            ابدأ التوليد
          </Link>
          <Link
            href="/gallery"
            className="bg-navy-700 hover:bg-navy-600 text-white font-medium px-8 py-3 rounded-xl text-lg border border-white/10 transition-colors"
          >
            تصفّح المعرض
          </Link>
        </div>
      </div>
    </section>
  );
}
