"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  Download,
  Share2,
  Heart,
  ArrowRight,
  Loader2,
  Calendar,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Generation } from "@/lib/types";

export default function ImageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [generation, setGeneration] = useState<Generation | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadGeneration();
  }, [id]);

  const loadGeneration = async () => {
    const { data } = await supabase
      .from("generations")
      .select("*")
      .eq("id", id)
      .single();

    setGeneration(data);
    setLoading(false);
  };

  const handleDownload = async () => {
    if (!generation) return;
    try {
      const response = await fetch(generation.image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `curator-${generation.seed || "image"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      window.open(generation.image_url, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-accent-cyan" />
      </div>
    );
  }

  if (!generation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">لم يتم العثور على هذا التصميم</p>
          <button
            onClick={() => router.back()}
            className="gradient-btn text-white px-6 py-2 rounded-xl"
          >
            العودة
          </button>
        </div>
      </div>
    );
  }

  const dims = generation.resolution?.split(" ")[0] || "1024x1024";

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowRight size={16} />
          <span>العودة</span>
        </button>

        <div className="bg-navy-800 rounded-2xl p-5 border border-white/5 mb-6">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs text-gray-500">وصف الأمر (PROMPT)</span>
          </div>
          <p className="text-sm text-gray-200 leading-relaxed">
            &ldquo;{generation.prompt}&rdquo;
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            <div className="bg-navy-700 rounded-xl p-3 text-center">
              <p className="text-[10px] text-gray-500 mb-1">SAMPLER</p>
              <p className="text-sm font-bold">DPM++ 2M</p>
            </div>
            <div className="bg-navy-700 rounded-xl p-3 text-center">
              <p className="text-[10px] text-gray-500 mb-1">DIMENSIONS</p>
              <p className="text-sm font-bold">{dims}</p>
            </div>
            <div className="bg-navy-700 rounded-xl p-3 text-center">
              <p className="text-[10px] text-gray-500 mb-1">SEED</p>
              <p className="text-sm font-bold">{generation.seed || "---"}</p>
            </div>
            <div className="bg-navy-700 rounded-xl p-3 text-center">
              <p className="text-[10px] text-gray-500 mb-1">STEPS</p>
              <p className="text-sm font-bold">{generation.steps || "---"}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mb-6">
          <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <Share2 size={16} />
            <span>مشاركة</span>
          </button>
          <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <Heart size={16} />
            <span>المفضلة</span>
          </button>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar size={12} />
            <span>
              {new Date(generation.created_at).toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden">
          <img
            src={generation.image_url}
            alt={generation.prompt}
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
    </div>
  );
}
