"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Settings,
  LogOut,
  Globe,
  Bell,
  Lock,
  ImageIcon,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";
import type { User as SupaUser } from "@supabase/supabase-js";

export default function ProfilePage() {
  const [user, setUser] = useState<SupaUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [genCount, setGenCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth");
      return;
    }
    setUser(user);

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    setProfile(profileData);

    const { count } = await supabase
      .from("generations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);
    setGenCount(count || 0);

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-accent-cyan" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center mb-4">
            <User size={40} className="text-white" />
          </div>
          <h2 className="text-xl font-bold">
            {profile?.full_name || user?.email?.split("@")[0] || "مستخدم"}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            CURATOR ID: {profile?.curator_id || "---"}
          </p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="bg-navy-700 text-xs text-gray-300 px-3 py-1 rounded-full">
              مبدع محتوى
            </span>
            <span className="bg-accent-cyan/10 text-accent-cyan text-xs px-3 py-1 rounded-full">
              عضو نشط
            </span>
          </div>
        </div>

        <div className="bg-navy-800 rounded-2xl p-6 border border-white/5">
          <h3 className="text-lg font-bold mb-4 text-center">
            إحصائيات سريعة
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-navy-700 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{genCount}</p>
              <p className="text-xs text-gray-400 mt-1">التصميمات</p>
            </div>
            <div className="bg-navy-700 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">
                {new Date(
                  user?.created_at || Date.now()
                ).toLocaleDateString("ar-EG", {
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <p className="text-xs text-gray-400 mt-1">تاريخ الانضمام</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 bg-red-400/5 hover:bg-red-400/10 py-3 rounded-xl border border-red-400/10 transition-colors"
        >
          <LogOut size={18} />
          <span className="font-medium">تسجيل الخروج</span>
        </button>

        <div className="bg-navy-800 rounded-2xl p-6 border border-white/5 space-y-5">
          <h3 className="text-lg font-bold text-center mb-2">
            إعدادات الحساب
          </h3>

          <div className="flex items-center gap-4 p-4 bg-navy-700 rounded-xl">
            <Lock size={20} className="text-accent-cyan shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">تغيير كلمة المرور</p>
              <p className="text-xs text-gray-500">
                تحديث بيانات الأمان الخاصة بك
              </p>
            </div>
            <Settings size={16} className="text-gray-500" />
          </div>

          <div className="flex items-center gap-4 p-4 bg-navy-700 rounded-xl">
            <Globe size={20} className="text-accent-cyan shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">إعدادات اللغة</p>
              <p className="text-xs text-gray-500">العربية (الفصحى)</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-navy-700 rounded-xl">
            <ImageIcon size={20} className="text-accent-cyan shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">الخطة الحالية</p>
              <p className="text-xs text-gray-500">مجانية - أساسية</p>
            </div>
            <span className="text-xs bg-green-400/10 text-green-400 px-2 py-0.5 rounded-full">
              ACTIVE
            </span>
          </div>

          <div className="flex items-center gap-4 p-4 bg-navy-700 rounded-xl">
            <Bell size={20} className="text-accent-cyan shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">التنبيهات</p>
              <p className="text-xs text-gray-500">
                إدارة كيفية وصول الإشعارات إليك
              </p>
            </div>
          </div>

          <button className="w-full gradient-btn text-white font-semibold py-3 rounded-xl">
            حفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  );
}
