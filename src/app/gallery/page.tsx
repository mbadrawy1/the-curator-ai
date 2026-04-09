"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import ImageCard from "@/components/ImageCard";
import { createClient } from "@/lib/supabase/client";
import type { Generation } from "@/lib/types";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";

export default function GalleryPage() {
  const [tab, setTab] = useState<"my" | "explore">("my");
  const [search, setSearch] = useState("");
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      fetchGenerations(data.user, "my");
    });
  }, []);

  const fetchGenerations = async (
    currentUser: User | null,
    currentTab: "my" | "explore"
  ) => {
    setLoading(true);
    let query = supabase
      .from("generations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (currentTab === "my" && currentUser) {
      query = query.eq("user_id", currentUser.id);
    } else {
      query = query.eq("is_public", true);
    }

    const { data } = await query;
    setGenerations(data || []);
    setLoading(false);
  };

  const handleTabChange = (newTab: "my" | "explore") => {
    setTab(newTab);
    fetchGenerations(user, newTab);
  };

  const filtered = generations.filter((g) =>
    g.prompt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          <span className="gradient-text">سجل تصميماتك</span>
        </h1>
        <p className="text-gray-400 text-sm mb-8 max-w-xl">
          تصفح وأرشف جميع أعمالك الفنية التي تم إنشاؤها في مكان واحد. منظمة
          وجاهزة وقتما تريد.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <div className="flex bg-navy-800 rounded-xl p-1 border border-white/5">
            <button
              onClick={() => handleTabChange("my")}
              className={`px-5 py-2 text-sm rounded-lg transition-colors ${
                tab === "my"
                  ? "gradient-btn text-white font-medium"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              تصميماتي
            </button>
            <button
              onClick={() => handleTabChange("explore")}
              className={`px-5 py-2 text-sm rounded-lg transition-colors ${
                tab === "explore"
                  ? "gradient-btn text-white font-medium"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              استكشاف
            </button>
          </div>

          <div className="flex-1 w-full sm:w-auto relative">
            <Search
              size={16}
              className="absolute top-1/2 -translate-y-1/2 start-3 text-gray-500"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث في التصميمات..."
              className="w-full bg-navy-800 text-white placeholder-gray-500 text-sm rounded-xl ps-10 pe-4 py-2.5 border border-white/5 outline-none focus:border-accent-cyan/30 transition-colors"
            />
          </div>

          <button className="bg-navy-800 p-2.5 rounded-xl border border-white/5 text-gray-400 hover:text-white transition-colors">
            <SlidersHorizontal size={16} />
          </button>
        </div>

        {!user && tab === "my" && (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">
              سجل دخولك لعرض تصميماتك المحفوظة
            </p>
            <Link
              href="/auth"
              className="gradient-btn inline-block text-white font-medium px-6 py-2.5 rounded-xl"
            >
              تسجيل الدخول
            </Link>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-accent-cyan" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">لا توجد تصميمات بعد.</p>
            <Link
              href="/generate"
              className="gradient-btn inline-block text-white font-medium px-6 py-2.5 rounded-xl mt-4"
            >
              ابدأ التوليد
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((gen) => (
              <ImageCard
                key={gen.id}
                id={gen.id}
                imageUrl={gen.image_url}
                prompt={gen.prompt}
                createdAt={gen.created_at}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
