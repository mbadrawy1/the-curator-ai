"use client";

import { useState, useEffect } from "react";
import { Info } from "lucide-react";
import PromptForm from "@/components/PromptForm";
import GenerationResult from "@/components/GenerationResult";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";

interface GenerationData {
  image: string;
  seed: number;
  steps: number;
  resolution: string;
  prompt: string;
}

export default function GeneratePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerationData | null>(null);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleGenerate = async (data: {
    prompt: string;
    resolution: string;
    steps: number;
  }) => {
    setIsLoading(true);
    setError("");
    setSaved(false);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "حدث خطأ أثناء التوليد");
        return;
      }

      const genResult = { ...json, prompt: data.prompt };
      setResult(genResult);

      if (user) {
        await saveGeneration(genResult);
      }
    } catch {
      setError("فشل الاتصال بالخادم. تحقق من اتصالك بالإنترنت.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveGeneration = async (data: GenerationData) => {
    try {
      const blob = await fetch(
        `data:image/png;base64,${data.image}`
      ).then((r) => r.blob());
      const fileName = `${user!.id}/${Date.now()}-${data.seed}.png`;

      const { error: uploadError } = await supabase.storage
        .from("generations")
        .upload(fileName, blob, { contentType: "image/png" });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("generations").getPublicUrl(fileName);

      await supabase.from("generations").insert({
        user_id: user!.id,
        prompt: data.prompt,
        image_url: publicUrl,
        seed: data.seed,
        steps: data.steps,
        resolution: data.resolution,
      });

      setSaved(true);
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleRegenerate = () => {
    if (result) {
      handleGenerate({
        prompt: result.prompt,
        resolution: result.resolution,
        steps: result.steps,
      });
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="gradient-text">صمم إعلاناتك</span>
            <br />
            وموادك بسهولة
          </h1>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            أدخل وصفاً تفصيلياً للصورة التي تريدها وسيقوم الذكاء الاصطناعي
            بتوليدها لك في ثوانٍ.
          </p>
        </div>

        <PromptForm onGenerate={handleGenerate} isLoading={isLoading} />

        {error && (
          <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {isLoading && !result && (
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full animate-pulse-glow bg-navy-700 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-accent-cyan border-t-transparent animate-spin" />
            </div>
            <p className="text-gray-400 text-sm">
              جارٍ توليد الصورة... قد يستغرق الأمر بضع ثوانٍ
            </p>
          </div>
        )}

        {result && (
          <div className="mt-10">
            <GenerationResult
              imageBase64={result.image}
              prompt={result.prompt}
              seed={result.seed}
              steps={result.steps}
              resolution={result.resolution}
              onRegenerate={handleRegenerate}
              isLoading={isLoading}
            />

            {!user && (
              <div className="mt-6 bg-navy-800 rounded-xl p-4 border border-white/5 flex items-center gap-3">
                <Info size={18} className="text-accent-cyan shrink-0" />
                <p className="text-sm text-gray-400">
                  سجل دخولك لحفظ تصميماتك.{" "}
                  <Link
                    href="/auth"
                    className="text-accent-cyan hover:underline"
                  >
                    إنشاء حساب
                  </Link>
                </p>
              </div>
            )}

            {saved && (
              <div className="mt-4 bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
                <p className="text-green-400 text-sm">
                  تم حفظ الصورة في سجلّك بنجاح!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
