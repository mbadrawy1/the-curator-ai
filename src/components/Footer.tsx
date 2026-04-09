import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy-950 border-t border-white/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className="text-lg font-bold"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Digital Curator AI
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-white transition-colors">
              الخصوصية
            </Link>
            <Link href="/gallery" className="hover:text-white transition-colors">
              المعرض
            </Link>
            <Link href="/pricing" className="hover:text-white transition-colors">
              الأسعار
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              عن المنصة
            </Link>
          </div>
        </div>
        <p className="text-center text-gray-500 text-xs mt-6">
          Digital Curator AI 2024 &copy;
        </p>
      </div>
    </footer>
  );
}
