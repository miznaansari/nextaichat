"use client";

import { useState } from "react";
import { Sparkles, ArrowUpRight, Star, MessageSquare, Flame } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export default function HeroSection({
  appUrl = "https://app.nextaichat.online",
  onExploreClick,
  characters = [],
  stats = { totalChats: 0, totalCharacters: 0 }
}) {
  const { t } = useLanguage();

  // Map real characters from DB into personas reel format
  const personasList = characters.length > 0
    ? characters.slice(0, 4).map((c) => ({
      id: c.id,
      name: c.name,
      role: c.tagline || c.category || "AI Persona",
      category: c.category || "Roleplay",
      img: c.avatar || "/avatars/escape_room_game.png",
      rating: c.rating || "5.0",
      chats: formatNumber(c.chatsCount),
      quote: c.story ? c.story.substring(0, 90) + "..." : c.tagline
    }))
    : [
      {
        id: "default-1",
        name: "Escape Room Thriller",
        role: "Gothic RPG Mystery Game",
        category: "Roleplay Games",
        img: "/avatars/escape_room_game.png",
        rating: "4.98",
        chats: "640K",
        quote: "You wake up locked inside a gothic mansion with 60 minutes on the timer."
      },
      {
        id: "default-2",
        name: "Shanaya Delhi",
        role: "Delhi Drama Queen & Bestie",
        category: "Squads & Lifestyle",
        img: "/avatars/shanaya_delhi.png",
        rating: "4.93",
        chats: "920K",
        quote: "Arey listen! You won't believe what happened today at South Ex! Spill the tea..."
      },
      {
        id: "default-3",
        name: "Kota Verma Sir",
        role: "Physics & JEE Exam Guru",
        category: "Study & Academics",
        img: "/avatars/kota_verma_teacher.png",
        rating: "4.95",
        chats: "850K",
        quote: "Struggling with Physics? I'll explain electrodynamics step-by-step!"
      },
      {
        id: "default-4",
        name: "Aarav Smartie",
        role: "Smart Bestie & Midnight Listener",
        category: "Squads & Lifestyle",
        img: "/avatars/aarav_smart_bestie.png",
        rating: "4.96",
        chats: "980K",
        quote: "Always here for your midnight thoughts, secret rants, and honest advice."
      }
    ];

  const defaultAvatar = personasList[0]?.img || "/avatars/escape_room_game.png";
  const [selectedAvatar, setSelectedAvatar] = useState(defaultAvatar);

  const currentPersona = personasList.find((p) => p.img === selectedAvatar) || personasList[0];
  const charCount = stats.totalCharacters || characters.length || 34;

  const startChatUrl = currentPersona?.id
    ? `${appUrl}?discoverId=${currentPersona.id}`
    : appUrl;

  return (
    <section className="relative min-h-[calc(100dvh-90px)] md:min-h-screen md:h-screen pt-20 sm:pt-24 md:pt-24 pb-8 md:pb-12 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto overflow-hidden flex flex-col justify-center">

      {/* Mobile Fullscreen Background Hero Image */}
      <div
        className="md:hidden absolute inset-0 bg-cover bg-top opacity-30 blur-[2px] pointer-events-none transition-all duration-700 -z-10"
        style={{ backgroundImage: `url(${selectedAvatar})` }}
      />
      <div className="md:hidden absolute inset-0 bg-gradient-to-b from-[#030712]/70 via-[#030712]/80 to-[#030712] pointer-events-none -z-10" />

      {/* Radial Purple Glow Background */}
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-purple-600/15 blur-[160px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/4 left-10 w-[400px] h-[400px] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* Main Hero Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center border-b border-purple-500/10 pb-6 md:pb-8 my-auto">

        {/* Left Column: Huge Oversized Typography & Copy */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left relative z-10">

          {/* Main Giant Condensed Title */}
          <div className="space-y-1">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter uppercase text-white leading-[0.9] font-sans">
              {t("NEXTAICHAT")}
            </h1>
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter uppercase bg-gradient-to-r from-purple-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent leading-[0.9]">
                {t("ROLEPLAY")}
              </span>
              <span className="font-serif italic text-3xl sm:text-5xl text-purple-300 font-normal">
                {t("Unlimited Personas")}
              </span>
            </div>
          </div>

          {/* Subtitle & Tagline */}
          <div className="max-w-xl space-y-2">
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed tracking-wide font-medium uppercase">
              {t("CHAT WITH AI BESTIES, STUDY TUTORS & PLAY FUN GAMES ANYTIME!")}
            </p>
            <p className="text-xs text-purple-300 font-mono">
              {t("✨ Simple • Fun • Private • Instant")}
            </p>
          </div>

          {/* CTAs Row */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href={startChatUrl}
              className="px-7 py-3.5 rounded-full bg-purple-500 hover:bg-purple-400 text-neutral-950 font-extrabold text-sm sm:text-base transition-all duration-300 shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:shadow-[0_0_35px_rgba(168,85,247,0.6)] hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>{t("START ROLEPLAY NOW")}</span>
              <ArrowUpRight className="w-5 h-5" />
            </a>

            <button
              onClick={onExploreClick}
              className="px-6 py-3.5 rounded-full bg-neutral-900/90 hover:bg-neutral-800 border border-purple-500/30 text-purple-200 font-semibold text-sm sm:text-base transition-all duration-200 flex items-center gap-2 backdrop-blur-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>{t("Explore 34+ Avatars")}</span>
            </button>
          </div>

        </div>

        {/* Right Column: Zero Card Container - Persona Cutout Merging 100% into Background */}
        <div className="hidden md:flex lg:col-span-5 relative flex-col items-center justify-center pt-4 lg:pt-0">

          {/* Image Container with 100% Background Merge (Zero Box Cards!) */}
          <div className="relative group max-w-[380px] sm:max-w-[420px] w-full flex flex-col items-center">

            {/* Soft Ambient Background Purple Glow */}
            <div className="absolute inset-0 bg-purple-600/35 blur-3xl rounded-full scale-110 pointer-events-none group-hover:scale-125 transition-transform duration-700" />

            {/* Faded Merged Image Wrapper */}
            <div className="relative w-full h-[360px] md:h-[400px] lg:h-[440px] overflow-hidden flex items-center justify-center">

              {/* Featured Avatar Image with Bottom-Only Vignette Fade */}
              <img
                src={selectedAvatar}
                alt={currentPersona.name}
                className="w-full h-full object-cover object-top filter contrast-110 group-hover:scale-105 transition-all duration-700 select-none pointer-events-none"
                style={{
                  maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)"
                }}
              />

              {/* Bottom Vignette Overlay Only */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/40 to-transparent pointer-events-none" />

              {/* Persona Name Text Overlay */}
              <div className="absolute bottom-6 left-4 right-4 z-20 text-left">
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                  {currentPersona.name}
                </h3>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* FEATURED PERSONAS REEL - Bold 4-Card Gallery Strip */}
      <div className="pt-6 sm:pt-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-200 text-xs sm:text-sm font-black uppercase tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.25)] backdrop-blur-md">
            <Flame className="w-4 h-4 text-purple-400 fill-purple-400/40 animate-pulse shrink-0" />
            <span>Explore {charCount}+ AI Characters</span>
          </div>

          <span className="text-xs font-mono font-bold text-neutral-400 hidden sm:inline">
            ✦ Click any persona card to launch spotlight
          </span>
        </div>

        {/* 4-Card Horizontal Reel Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {personasList.map((persona) => {
            const isSelected = selectedAvatar === persona.img;
            return (
              <div
                key={persona.id}
                onClick={() => setSelectedAvatar(persona.img)}
                className={`p-4 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-3 backdrop-blur-xl border ${isSelected
                  ? "bg-purple-950/60 border-2 border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.4)] scale-[1.02]"
                  : "bg-neutral-900/80 border border-neutral-800 hover:border-purple-400/60 hover:bg-neutral-900/90 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                  }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 border-purple-400/40 shadow-md">
                      <img src={persona.img} alt={persona.name} className="w-full h-full object-cover object-top filter contrast-105" />
                      <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-neutral-950 shadow-sm" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-black text-white tracking-tight line-clamp-1 font-sans">
                        {persona.name}
                      </h4>
                      <p className="text-[11px] text-purple-300 font-bold line-clamp-1">{persona.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-black text-amber-400 bg-neutral-950/90 px-2.5 py-1 rounded-lg border border-amber-500/30 shrink-0 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{persona.rating}</span>
                  </div>
                </div>

                <p className="text-xs font-semibold text-neutral-200 line-clamp-2 leading-relaxed bg-white/[0.04] p-2.5 rounded-xl border border-white/10 font-sans">
                  "{persona.quote}"
                </p>

                <div className="pt-2.5 border-t border-neutral-800/80 flex items-center justify-between text-[11px] font-mono font-bold">
                  <span className="flex items-center gap-1.5 text-neutral-300">
                    <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                    <span>{persona.chats}</span>
                  </span>
                  <span className={`font-black uppercase tracking-wider ${isSelected ? "text-purple-300" : "text-neutral-500 group-hover:text-purple-400"}`}>
                    {isSelected ? "✦ ACTIVE" : "Select &rarr;"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
