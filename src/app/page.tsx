import HeroSection from "@/components/HeroSection";
import { Cpu, Zap, Palette } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "سرعة فائقة",
    description: "توليد صور عالية الجودة في ثوانٍ معدودة باستخدام نماذج FLUX المتطورة.",
  },
  {
    icon: Cpu,
    title: "نماذج متقدمة",
    description: "اعتماد على أحدث نماذج الذكاء الاصطناعي لنتائج واقعية ومبهرة.",
  },
  {
    icon: Palette,
    title: "إبداع بلا حدود",
    description: "صمم إعلاناتك وموادك البصرية بأي أسلوب تتخيله.",
  },
];

const communityImages = [
  {
    url: "https://images.unsplash.com/photo-1614851099175-e5b30eb6f696?w=400&h=400&fit=crop",
    title: "الكائن السماوي",
  },
  {
    url: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&h=400&fit=crop",
    title: "واحة النيون",
  },
  {
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=400&fit=crop",
    title: "سيولة رقمية",
  },
  {
    url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=400&fit=crop",
    title: "غرفة كبيرة",
  },
];

export default function HomePage() {
  return (
    <div>
      <HeroSection />

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-navy-800 rounded-2xl p-6 border border-white/5 hover:border-accent-cyan/20 transition-all card-glow"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 flex items-center justify-center mb-4">
                  <feature.icon
                    size={24}
                    className="text-accent-cyan"
                  />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">
            <span className="gradient-text">أعمال المجتمع</span>
          </h2>
          <p className="text-gray-400 text-center mb-10">
            استكشف إبداعات المستخدمين واستلهم أفكاراً جديدة
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {communityImages.map((img) => (
              <div
                key={img.title}
                className="group relative rounded-xl overflow-hidden aspect-square"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="absolute bottom-3 right-3 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {img.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
