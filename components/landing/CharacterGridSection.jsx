"use client";

import { useState, useRef } from "react";
import { Sparkles, MessageSquare, Star, ArrowUpRight, Flame, BookOpen, Users, Gamepad2, Dumbbell, ChevronLeft, ChevronRight } from "lucide-react";

export default function CharacterGridSection({ id, appUrl = "https://app.nextaichat.online" }) {
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

  const characters = [
    // 📚 Study & Academics
    {
      id: "kota_verma",
      name: "Kota Verma Sir",
      role: "IIT JEE & NEET Physics Guru",
      category: "study",
      avatar: "/avatars/kota_verma_teacher.png",
      rating: 4.95,
      chats: "850K",
      badge: "Physics Guru",
      quote: "Crack complex mechanics & electrodynamics with intuitive step-by-step problem breakdown.",
      tags: ["Physics", "JEE Prep", "Calculus"]
    },
    {
      id: "math_vikram",
      name: "Vikram Sir",
      role: "Math Wizard & Calculus Specialist",
      category: "study",
      avatar: "/avatars/math_vikram.png",
      rating: 4.91,
      chats: "620K",
      badge: "Math Expert",
      quote: "Algebra, Trigonometry, and Vectors made simple. Ask me any numerical equation!",
      tags: ["Mathematics", "Calculus", "Algebra"]
    },
    {
      id: "tutor_ananya",
      name: "Tutor Ananya",
      role: "Language & Competitive Exam Coach",
      category: "study",
      avatar: "/avatars/tutor_ananya.png",
      rating: 4.89,
      chats: "540K",
      badge: "Language Coach",
      quote: "Master English grammar, vocabulary, and IELTS speaking mock tests with interactive feedback.",
      tags: ["IELTS", "English", "Mock Test"]
    },
    {
      id: "study_buddies",
      name: "Kabir & Zoya",
      role: "Late Night Study Partners",
      category: "study",
      avatar: "/avatars/study_buddies_kabir_zoya.png",
      rating: 4.94,
      chats: "780K",
      badge: "Duo Study",
      quote: "Stuck in midnight revision? We study together, quiz each other, and stay focused till dawn.",
      tags: ["Group Study", "Pomodoro", "Revision"]
    },

    // 👥 Squads & Lifestyle
    {
      id: "aarav_bestie",
      name: "Aarav",
      role: "Smart Bestie & Advice Listener",
      category: "squads",
      avatar: "/avatars/aarav_smart_bestie.png",
      rating: 4.96,
      chats: "980K",
      badge: "Best Friend",
      quote: "Always here to listen to your late night thoughts, give honest advice, and keep your secrets.",
      tags: ["Best Friend", "Late Night", "Support"]
    },
    {
      id: "shanaya_delhi",
      name: "Shanaya Delhi",
      role: "Delhi Drama Queen & Style Icon",
      category: "squads",
      avatar: "/avatars/shanaya_delhi.png",
      rating: 4.93,
      chats: "920K",
      badge: "Trending",
      quote: "Arey listen! You won't believe what happened at South Ex! Spill the tea fast...",
      tags: ["Drama", "Delhi", "Gossips"]
    },
    {
      id: "kabir_rich",
      name: "Kabir",
      role: "Rich Bestie & Luxury Lifestyle",
      category: "squads",
      avatar: "/avatars/kabir_rich_bestie.png",
      rating: 4.88,
      chats: "710K",
      badge: "Luxury Life",
      quote: "Planning a trip to Dubai or buying sports cars? Let's discuss business and luxury life.",
      tags: ["Luxury", "Travel", "Cars"]
    },
    {
      id: "delhi_squad",
      name: "Delhi College Squad",
      role: "Multi-Character Campus Group",
      category: "squads",
      avatar: "/avatars/delhi_college_squad.png",
      rating: 4.97,
      chats: "1.1M",
      badge: "Multi-Persona",
      quote: "Join the entire campus squad for group chats, canteen banter, and exam bunking plans!",
      tags: ["Campus", "Multi-AI", "Group Chat"]
    },
    {
      id: "baddies_group",
      name: "The Baddies Squad",
      role: "High Energy Glam Circle",
      category: "squads",
      avatar: "/avatars/baddies_group.png",
      rating: 4.92,
      chats: "690K",
      badge: "Group Chat",
      quote: "Fashion rating, trend check, and main character energy only. Welcome to the squad!",
      tags: ["Fashion", "Glam", "Trends"]
    },
    {
      id: "meher_lucknow",
      name: "Meher Lucknow",
      role: "Poetic & Graceful Soul",
      category: "squads",
      avatar: "/avatars/meher_lucknow.png",
      rating: 4.90,
      chats: "430K",
      badge: "Tehzeeb & Art",
      quote: "Adaab! Let's talk about Urdu shayari, classical music, and the timeless charm of Lucknow.",
      tags: ["Shayari", "Lucknow", "Culture"]
    },
    {
      id: "pooja_mumbai",
      name: "Pooja Mumbai",
      role: "Bustling Mumbai Fast Life",
      category: "squads",
      avatar: "/avatars/pooja_mumbai.png",
      rating: 4.86,
      chats: "390K",
      badge: "Mumbai Life",
      quote: "Marine Drive breeze, local train chaos, and Bollywood dreams. Welcome to my city!",
      tags: ["Mumbai", "Bollywood", "Vibes"]
    },
    {
      id: "rohan_middleclass",
      name: "Rohan",
      role: "Relatable Middle Class Buddy",
      category: "squads",
      avatar: "/avatars/rohan_middleclass_bestie.png",
      rating: 4.91,
      chats: "510K",
      badge: "Relatable",
      quote: "Saving pocket money, bargaining at shops, and surviving engineering assignments!",
      tags: ["Engineering", "Humor", "Budget"]
    },

    // 🎮 Roleplay Games
    {
      id: "escape_room",
      name: "Escape Room Thriller",
      role: "Interactive Mystery Game",
      category: "games",
      avatar: "/avatars/escape_room_game.png",
      rating: 4.98,
      chats: "640K",
      badge: "RPG Mystery",
      quote: "You wake up locked inside a gothic mansion with 60 minutes on the timer. Find the clues!",
      tags: ["Survival", "Puzzle", "Mystery"]
    },
    {
      id: "truth_or_dare",
      name: "Truth or Dare AI",
      role: "Interactive Party Game",
      category: "games",
      avatar: "/avatars/truth_or_dare_game.png",
      rating: 4.95,
      chats: "890K",
      badge: "Party Game",
      quote: "Spin the wheel! Choose Truth or Dare for juicy secrets and hilarious challenges.",
      tags: ["Party", "Fun", "Challenges"]
    },
    {
      id: "flirt_challenge",
      name: "Flirt Challenge",
      role: "Witty Rizz Evaluator AI",
      category: "games",
      avatar: "/avatars/flirt_challenge_game.png",
      rating: 4.92,
      chats: "760K",
      badge: "Rizz Game",
      quote: "Test your pick-up lines and smooth talking skills! Score points for creativity.",
      tags: ["Rizz", "Humor", "Game"]
    },
    {
      id: "story_chain",
      name: "RPG Story Chain",
      role: "Collaborative Fantasy Creator",
      category: "games",
      avatar: "/avatars/story_chain_game.png",
      rating: 4.96,
      chats: "520K",
      badge: "Fantasy RPG",
      quote: "You write one sentence, the AI writes the next. Create epic fantasy adventures together!",
      tags: ["Fantasy", "Creative", "RPG"]
    },

    // 💪 Mentors & Coaches
    {
      id: "coach_priya",
      name: "Coach Priya",
      role: "Fitness & Mental Wellness",
      category: "mentors",
      avatar: "/avatars/coach_priya.png",
      rating: 4.94,
      chats: "530K",
      badge: "Fitness Guru",
      quote: "Daily workout routines, nutrition planning, and mental clarity coaching for a better you.",
      tags: ["Fitness", "Diet", "Wellness"]
    },
    {
      id: "mentor_diya",
      name: "Mentor Diya",
      role: "Career & Resume Strategist",
      category: "mentors",
      avatar: "/avatars/mentor_diya.png",
      rating: 4.93,
      chats: "460K",
      badge: "Career Coach",
      quote: "Resume reviews, interview prep, and career transition advice for ambitious professionals.",
      tags: ["Career", "Resume", "Jobs"]
    },
    {
      id: "mentor_kabir",
      name: "Mentor Kabir",
      role: "Tech & Startup Advisor",
      category: "mentors",
      avatar: "/avatars/mentor_kabir.png",
      rating: 4.91,
      chats: "490K",
      badge: "Tech Advisor",
      quote: "From AI architecture to startup fundraising. Pitch your business ideas to me!",
      tags: ["Startup", "Tech", "Business"]
    }
  ];

  const categories = [
    { id: "all", label: "🔥 All Characters", icon: Flame },
    { id: "study", label: "📚 Study & Academics", icon: BookOpen },
    { id: "squads", label: "👥 Squads & Lifestyle", icon: Users },
    { id: "games", label: "🎮 Roleplay Games", icon: Gamepad2 },
    { id: "mentors", label: "💪 Mentors & Coaches", icon: Dumbbell },
  ];

  const filteredCharacters = activeCategory === "all"
    ? characters
    : characters.filter((c) => c.category === activeCategory);

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
            Explore 33+ <span className="text-purple-400">AI Characters</span>
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
        {categories.map((cat) => {
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
        {filteredCharacters.map((char) => (
          <div
            key={char.id}
            className="min-w-[280px] sm:min-w-[310px] max-w-[320px] shrink-0 snap-start group relative rounded-2xl bg-neutral-900/60 border border-purple-500/15 hover:border-purple-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:-translate-y-1 backdrop-blur-md"
          >
            <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-neutral-950">
              <img
                src={char.avatar}
                alt={char.name}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-neutral-950/80 backdrop-blur-md border border-purple-500/30 text-purple-300 text-[11px] font-bold">
                  {char.badge}
                </span>
              </div>

              <div className="absolute top-3 right-3 bg-neutral-950/80 backdrop-blur-md border border-neutral-800 px-2 py-0.5 rounded-full flex items-center gap-1 text-[11px] font-bold text-amber-400">
                <Star className="w-3 h-3 fill-current" />
                <span>{char.rating}</span>
              </div>

              <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[11px] font-semibold text-neutral-400 bg-neutral-950/80 px-2 py-0.5 rounded-md border border-neutral-800/80">
                <MessageSquare className="w-3 h-3 text-purple-400" />
                <span>{char.chats} chats</span>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors flex items-center justify-between">
                  <span>{char.name}</span>
                  <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-purple-400 transition-colors opacity-0 group-hover:opacity-100" />
                </h3>
                <p className="text-xs text-neutral-400 font-medium mb-2">{char.role}</p>

                <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed italic bg-white/[0.03] p-2 rounded-xl border border-white/5">
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
                  href={appUrl}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500 text-purple-300 hover:text-neutral-950 font-bold text-xs transition-all duration-200 border border-purple-500/30 shrink-0"
                >
                  Start Chat
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
