"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AuthForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        router.push("/generate");
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      if (error) {
        setError(error.message);
      } else {
        setMessage("تم إرسال رابط التأكيد إلى بريدك الإلكتروني.");
      }
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative bg-navy-800/50 backdrop-blur-xl rounded-2xl p-8 border border-white/5">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">ابدأ رحلتك الإبداعية</h2>
          <p className="text-gray-400 text-sm">
            استخدم قوة الذكاء الاصطناعي لتقييم وتنسيق أعمالك الفنية في بيئة
            رقمية فاخرة.
          </p>
        </div>

        <div className="flex bg-navy-700 rounded-xl p-1 mb-6">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
              mode === "login"
                ? "gradient-btn text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
              mode === "signup"
                ? "gradient-btn text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            إنشاء حساب
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 text-left">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="البريد الإلكتروني"
                required
                className="w-full bg-navy-700 text-white placeholder-gray-500 text-sm rounded-xl px-4 py-3 pe-10 border border-white/10 outline-none focus:border-accent-cyan/50 transition-colors"
              />
              <Mail
                size={16}
                className="absolute top-1/2 -translate-y-1/2 end-3 text-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5 text-left">
              PASSWORD
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور"
                required
                minLength={6}
                className="w-full bg-navy-700 text-white placeholder-gray-500 text-sm rounded-xl px-4 py-3 pe-10 border border-white/10 outline-none focus:border-accent-cyan/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 end-3 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-xs bg-red-400/10 rounded-lg p-3">
              {error}
            </p>
          )}
          {message && (
            <p className="text-green-400 text-xs bg-green-400/10 rounded-lg p-3">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-btn text-white font-semibold py-3 rounded-xl text-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : mode === "login" ? (
              "دخول إلى المعرض"
            ) : (
              "إنشاء الحساب"
            )}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-navy-800/50 px-3 text-gray-500">
                أو الدخول عبر
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 bg-navy-700 hover:bg-navy-600 text-white text-sm py-2.5 rounded-xl border border-white/10 transition-colors"
            >
              <span>جوجل</span>
            </button>
            <button
              disabled
              className="flex items-center justify-center gap-2 bg-navy-700 text-gray-500 text-sm py-2.5 rounded-xl border border-white/10 cursor-not-allowed"
            >
              <span>أبل iOS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
