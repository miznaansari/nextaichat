"use client";

import { useState, useRef, useMemo } from "react";
import { Sparkles, MessageSquare, Star, ArrowUpRight, Flame, BookOpen, Users, Gamepad2, Dumbbell, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import OptimizedAvatar from "@/components/landing/OptimizedAvatar";

export default function CharacterGridSection({
  id,
  appUrl = "https://app.nextaichat.online",
  characters = [],
  stats = { totalChats: 0, totalCharacters: 0 }
}) {
  const [activeCategory, setActiveCategory] = useState("all");
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -340, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 340, behavior: "smooth" });
    }
  };

  // Process real DB characters or fallback to default
  const formattedList = useMemo(() => {
    if (characters && characters.length > 0) {
      return characters.map((c) => ({
        id: c.id,
        name: c.name,
        role: c.tagline || c.category,
        category: c.category || "General",
        avatar: c.avatar || "/avatars/kota_verma_teacher.png",
        rating: c.rating || "5.0",
        chats: formatNumber(c.chatsCount),
        rawChats: c.chatsCount || 0,
        badge: c.badge || c.category || "AI Persona",
        quote: c.story ? c.story.substring(0, 100) + "..." : c.tagline,
        tags: [c.category, c.filterGroup || "Roleplay"].filter(Boolean)
      }));
    }

    return [
      {
        id: "kota_verma",
        name: "Kota Verma Sir",
        role: "IIT JEE & NEET Physics Guru",
        category: "Exam & Tutors",
        avatar: "/avatars/kota_verma_teacher.png",
        rating: "4.95",
        chats: "850K",
        rawChats: 850000,
        badge: "Physics Guru",
        quote: "Crack complex mechanics & electrodynamics with intuitive step-by-step problem breakdown.",
        tags: ["Physics", "JEE Prep"]
      },
      {
        id: "shanaya_delhi",
        name: "Shanaya Delhi",
        role: "Delhi Drama Queen & Style Icon",
        category: "Best Friend",
        avatar: "/avatars/shanaya_delhi.png",
        rating: "4.93",
        chats: "920K",
        rawChats: 920000,
        badge: "Trending",
        quote: "Arey listen! You won't believe what happened at South Ex! Spill the tea fast...",
        tags: ["Delhi", "Gossips"]
      },
      {
        id: "escape_room",
        name: "Escape Room Thriller",
        role: "Interactive Mystery Game",
        category: "Game",
        avatar: "/avatars/escape_room_game.png",
        rating: "4.98",
        chats: "640K",
        rawChats: 640000,
        badge: "RPG Mystery",
        quote: "You wake up locked inside a gothic mansion with 60 minutes on the timer. Find the clues!",
        tags: ["Puzzle", "Mystery"]
      }
    ];
  }, [characters]);

  // Extract dynamic categories from real characters list
  const categoryTabs = useMemo(() => {
    const rawCategories = Array.from(new Set(formattedList.map((c) => c.category))).filter(Boolean);

    const categoryIconMap = {
      "Exam & Tutors": BookOpen,
      "WhatsApp Group": MessageCircle,
      "Hinglish & Campus": Users,
      "Best Friend": Users,
      "Game": Gamepad2,
      "Languages & Career": BookOpen,
      "Tech & Startups": Dumbbell,
      "Wellness & Mindset": Dumbbell
    };

    const tabs = [{ id: "all", label: "🔥 All Characters", icon: Flame }];

    rawCategories.forEach((catName) => {
      const icon = categoryIconMap[catName] || Sparkles;
      tabs.push({
        id: catName,
        label: catName,
        icon
      });
    });

    return tabs;
  }, [formattedList]);

  const filteredCharacters = activeCategory === "all"
    ? formattedList
    : formattedList.filter((c) => c.category === activeCategory);

  const totalCharCount = stats.totalCharacters || characters.length || formattedList.length;

  return (
    <section id={id} className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto relative overflow-hidden">

      {/* Section Header with Left/Right Scroll Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DISCOVER AI PERSONAS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight font-sans">
            Explore {totalCharCount}+ <span className="text-purple-400">AI Characters</span>
          </h2>
        </div>

        {/* Scroll Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={scrollLeft}
            className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 hover:border-purple-500/40 text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollRight}
            className="w-10 h-10 rounded-full bg-purple-500 hover:bg-purple-400 text-neutral-950 flex items-center justify-center transition-all cursor-pointer shadow-md font-bold"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth">
        {categoryTabs.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 whitespace-nowrap cursor-pointer ${isActive
                ? "bg-purple-500 text-neutral-950 shadow-[0_0_20px_rgba(168,85,247,0.4)] font-bold scale-105"
                : "bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white"
                }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* X-Axis Scrollable Card Row (Single Row Layout as requested) */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-6 overflow-x-auto pb-6 pt-2 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {filteredCharacters.map((char) => {
          const chatUrl = `${appUrl}?discoverId=${char.id}`;
          return (
            <div
              key={char.id}
              className="min-w-[280px] sm:min-w-[310px] max-w-[320px] shrink-0 snap-start group relative rounded-2xl bg-neutral-900/60 border border-purple-500/15 hover:border-purple-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:-translate-y-1 backdrop-blur-md"
            >
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-neutral-950">
                <OptimizedAvatar
                  src={char.avatar}
                  alt={char.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent pointer-events-none" />

                <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                  <span className="px-2.5 py-0.5 rounded-full bg-neutral-950/80 backdrop-blur-md border border-purple-500/30 text-purple-300 text-[11px] font-bold">
                    {char.badge}
                  </span>
                </div>

                <div className="absolute top-3 right-3 bg-neutral-950/80 backdrop-blur-md border border-neutral-800 px-2 py-0.5 rounded-full flex items-center gap-1 text-[11px] font-bold text-amber-400 z-10">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{char.rating}</span>
                </div>

                <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[11px] font-semibold text-neutral-400 bg-neutral-950/80 px-2 py-0.5 rounded-md border border-neutral-800/80 z-10">
                  <MessageSquare className="w-3 h-3 text-purple-400" />
                  <span>{char.chats} chats</span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors flex items-center justify-between">
                    <span className="line-clamp-1">{char.name}</span>
                    <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-purple-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0" />
                  </h3>
                  <p className="text-xs text-neutral-400 font-medium mb-2 line-clamp-1">{char.role}</p>

                  <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed italic bg-white/[0.03] p-2 rounded-xl border border-white/5 font-sans">
                    "{char.quote}"
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {char.tags.slice(0, 2).map((t, idx) => (
                      <span key={idx} className="text-[10px] text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <a
                    href={chatUrl}
                    aria-label={`Start chat with ${char.name}`}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500 text-purple-300 hover:text-neutral-950 font-bold text-xs transition-all duration-200 border border-purple-500/30 shrink-0"
                  >
                    Start Chat
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
