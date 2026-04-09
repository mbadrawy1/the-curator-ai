import { Sparkles, Zap, ImageIcon } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: ImageIcon,
    title: "نماذج بدقة عالية",
    value: "8K",
    description: "احصل على صور بأعلى دقة متاحة",
  },
  {
    icon: Zap,
    title: "سرعة فائقة",
    description: "توليد في أقل من 10 ثوانٍ",
  },
  {
    icon: Sparkles,
    title: "إبداع بلا حدود",
    description: "تمتع بتوليد غير محدود للصور",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xs text-accent-cyan mb-4 tracking-wider">
          الأسعار والباقات
        </p>
        <h1 className="text-3xl md:text-5xl font-black mb-4">
          <span className="gradient-text">صمم إعلاناتك</span>
          <br />
          <span className="text-white">وموادك بسهولة</span>
        </h1>
        <p className="text-gray-400 text-sm max-w-xl mx-auto mb-4">
          أداة ذكية تساعدك في إنشاء محتوى بصري احترافي من أي وصف. اكتب ما
          تريده، ودع الذكاء الاصطناعي يحول أفكارك إلى واقع.
        </p>

        <Link
          href="/generate"
          className="inline-block gradient-btn text-white font-semibold px-8 py-3 rounded-xl text-lg mb-16"
        >
          ابدأ الاستخدام
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-navy-800 rounded-2xl p-8 border border-white/5 hover:border-accent-cyan/20 transition-all card-glow text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 flex items-center justify-center mb-5">
                <feature.icon size={28} className="text-accent-cyan" />
              </div>
              {feature.value && (
                <p className="text-4xl font-black gradient-text mb-2">
                  {feature.value}
                </p>
              )}
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
