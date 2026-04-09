"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupaUser } from "@supabase/supabase-js";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<SupaUser | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/generate", label: "توليد" },
    { href: "/gallery", label: "المعرض" },
    { href: "/pricing", label: "الأسعار" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-navy-900/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            The Curator
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link
                href="/profile"
                className="flex items-center gap-2 bg-navy-700 hover:bg-navy-600 text-white text-sm px-4 py-2 rounded-lg transition-colors"
              >
                <User size={16} />
                <span>حسابي</span>
              </Link>
            ) : (
              <Link
                href="/auth"
                className="gradient-btn text-white text-sm font-medium px-5 py-2 rounded-lg"
              >
                تسجيل الدخول
              </Link>
            )}
          </div>

          <button
            className="md:hidden text-gray-300"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-navy-800 border-t border-white/5 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block text-sm text-gray-300 hover:text-white py-2"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              className="block text-sm text-gray-300 hover:text-white py-2"
            >
              حسابي
            </Link>
          ) : (
            <Link
              href="/auth"
              onClick={() => setMenuOpen(false)}
              className="block gradient-btn text-white text-sm font-medium px-5 py-2 rounded-lg text-center"
            >
              تسجيل الدخول
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
