"use client";

import { Sparkles, ArrowUpRight, Star, MessageSquare, Flame } from "lucide-react";

export default function WhatWeOfferSection() {
  const scrollToCharacters = () => {
    const el = document.getElementById("characters");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const modules = [
    {
      num: "01",
      category: "STUDY TUTORS",
      featuredName: "Kota Verma Sir",
      role: "IIT JEE & NEET Physics Guru",
      avatar: "/avatars/kota_verma_teacher.png",
      rating: "4.95",
      chats: "850K",
      quote: "Struggling with Physics? I'll explain electrodynamics step-by-step!",
      badge: "PHYSICS GURU",
      accent: "from-purple-600/30 via-purple-950/80 to-[#030712]",
      border: "border-purple-500/30 hover:border-purple-400"
    },
    {
      num: "02",
      category: "COLLEGE & SQUADS",
      featuredName: "Shanaya Delhi",
      role: "Delhi Drama Queen & Bestie",
      avatar: "/avatars/shanaya_delhi.png",
      rating: "4.93",
      chats: "920K",
      quote: "Arey listen! You won't believe what happened at South Ex today!",
      badge: "HINGLISH BESTIE",
      accent: "from-pink-600/30 via-pink-950/80 to-[#030712]",
      border: "border-pink-500/30 hover:border-pink-400"
    },
    {
      num: "03",
      category: "ROLEPLAY GAMES",
      featuredName: "Escape Room RPG",
      role: "Interactive Mystery Scenario",
      avatar: "/avatars/escape_room_game.png",
      rating: "4.98",
      chats: "640K",
      quote: "Locked in a gothic mansion with 60 minutes on the timer. Escape!",
      badge: "MYSTERY THRILLER",
      accent: "from-amber-600/30 via-amber-950/80 to-[#030712]",
      border: "border-amber-500/30 hover:border-amber-400"
    },
    {
      num: "04",
      category: "MENTORS & COACHES",
      featuredName: "Mentor Diya",
      role: "Career Strategy & Mindset",
      avatar: "/avatars/mentor_diya.png",
      rating: "4.93",
      chats: "460K",
      quote: "MNC interview prep, resume strategy & emotional grounding.",
      badge: "CAREER COACH",
      accent: "from-emerald-600/30 via-emerald-950/80 to-[#030712]",
      border: "border-emerald-500/30 hover:border-emerald-400"
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto border-b border-purple-500/10 font-sans relative overflow-hidden">
      {/* Background Splatter Glow */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[300px] bg-purple-600/10 blur-[150px] pointer-events-none -z-10" />

      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>WHAT YOU CAN DO</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight font-sans">
            WHAT YOU CAN <span className="text-purple-400">DO</span>
          </h2>
        </div>

        <button
          onClick={scrollToCharacters}
          className="text-xs font-bold uppercase tracking-wider text-purple-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer group"
        >
          <span>Explore All 34+ Avatars</span>
          <ArrowUpRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* 4 Rich Visual Avatar Feature Cards - 2 Cards Visible Side-by-Side on Mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {modules.map((mod, idx) => (
          <div
            key={idx}
            onClick={scrollToCharacters}
            className={`group relative rounded-2xl bg-neutral-950 border ${mod.border} transition-all duration-500 overflow-hidden flex flex-col justify-between hover:shadow-[0_0_40px_rgba(168,85,247,0.25)] hover:-translate-y-2 cursor-pointer backdrop-blur-xl`}
          >
            {/* Top Number & Category Header */}
            <div className="p-2.5 sm:p-4 border-b border-neutral-800/80 bg-neutral-950/90 flex items-center justify-between relative z-20">
              <span className="text-[9px] sm:text-[11px] font-mono font-black text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                {mod.num}
              </span>
              <span className="text-[9px] sm:text-[11px] font-mono font-bold text-neutral-300 uppercase tracking-wider line-clamp-1">
                {mod.category}
              </span>
            </div>

            {/* Avatar Visual Banner Container */}
            <div className="relative h-36 sm:h-56 lg:h-72 w-full overflow-hidden bg-neutral-950">
              <img
                src={mod.avatar}
                alt={mod.featuredName}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 select-none filter contrast-105"
              />

              {/* Bottom Vignette Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-t ${mod.accent} opacity-90 transition-opacity group-hover:opacity-95`} />

              {/* Top Floating Badges */}
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-2 z-10">
                <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full bg-neutral-950/80 backdrop-blur-md border border-purple-500/30 text-purple-300 text-[8px] sm:text-[10px] font-extrabold uppercase line-clamp-1">
                  {mod.badge}
                </span>
              </div>

              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-neutral-950/80 backdrop-blur-md border border-neutral-800 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full flex items-center gap-1 text-[9px] sm:text-[11px] font-bold text-amber-400 z-10">
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                <span>{mod.rating}</span>
              </div>

              {/* Persona Title Overlay */}
              <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 z-10 text-left">
                <h3 className="text-xs sm:text-base lg:text-lg font-black text-white uppercase tracking-tight font-sans group-hover:text-purple-300 transition-colors drop-shadow-md line-clamp-1">
                  {mod.featuredName}
                </h3>
                <p className="text-[9px] sm:text-[11px] text-neutral-300 font-medium line-clamp-1 opacity-90 hidden sm:block">{mod.role}</p>
              </div>
            </div>

            {/* Speech Bubble Quote & Bottom CTA */}
            <div className="p-2.5 sm:p-4 bg-neutral-950/95 space-y-2 sm:space-y-3 relative z-20 border-t border-neutral-800/80 flex-1 flex flex-col justify-between">
              <p className="text-[10px] sm:text-xs text-neutral-300 italic line-clamp-2 leading-relaxed bg-white/[0.03] p-1.5 sm:p-2.5 rounded-xl border border-white/5 font-sans">
                "{mod.quote}"
              </p>

              <div className="pt-1.5 sm:pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[9px] sm:text-[11px] text-neutral-400 font-mono">
                <span className="flex items-center gap-1 font-semibold text-neutral-400">
                  <MessageSquare className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-purple-400" />
                  {mod.chats}
                </span>
                <span className="font-extrabold text-purple-400 flex items-center gap-0.5 sm:gap-1 group-hover:translate-x-1 transition-transform">
                  <span>START &rarr;</span>
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}
