"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Sparkles, Compass, ArrowUpRight, ArrowRight, Languages } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const pathname = usePathname();
  const { language, toggleLanguage, t } = useLanguage();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Compare (vs Character.ai)", href: "/compare" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <header className="sticky top-0 z-50 h-24 border-b border-purple-500/20 px-4 sm:px-6 lg:px-10 bg-neutral-950/80 backdrop-blur-2xl shrink-0 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
      <div className="max-w-[1440px] mx-auto w-full h-full flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group transition-transform duration-300 hover:scale-[1.02]">
            <div className="relative flex items-center">
              <Image
                src="/logo-landspace.png"
                alt="NextAiChat Brand Logo"
                width={360}
                height={100}
                priority
                className="h-16 sm:h-20 md:h-20 w-auto object-contain drop-shadow-[0_0_25px_rgba(168,85,247,0.5)]"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-neutral-900/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600/90 to-indigo-600/90 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)] border border-purple-400/30"
                      : "text-neutral-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {t(link.name)}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right CTA & Language Toggle */}
        <div className="flex items-center gap-2.5">
          {/* English / Hinglish Toggle Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold bg-neutral-900/90 hover:bg-neutral-800 text-purple-300 hover:text-white border border-purple-500/30 hover:border-purple-400/60 transition-all cursor-pointer shadow-sm active:scale-95"
            title="Switch Language (English / Hinglish)"
          >
            <Languages className="w-3.5 h-3.5 text-purple-400" />
            <span>{language === "en" ? "EN | Hinglish" : "Hinglish | EN"}</span>
          </button>

          <Link
            href="/compare"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-900/80 transition-all border border-neutral-800 hover:border-cyan-500/40"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>vs Character.ai</span>
          </Link>

          <a
            href={process.env.NEXT_PUBLIC_APP_URL || "https://app.nextaichat.online"}
            target="_blank"
            rel="noopener noreferrer"
            className="relative group px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-[0_0_25px_rgba(147,51,234,0.4)] flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(147,51,234,0.7)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-200 animate-pulse" />
            <span className="sm:hidden">Launch</span>
            <span className="hidden sm:inline">{t("Launch App")}</span>
            <ArrowRight className="w-4 h-4 text-cyan-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </header>
  );
}
