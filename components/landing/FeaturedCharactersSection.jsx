"use client";

import { ArrowUpRight } from "lucide-react";

export default function FeaturedCharactersSection({ id, appUrl = "https://app.nextaichat.online", onExploreClick }) {
  const featured = [
    {
      num: "01",
      name: "KOTA VERMA SIR",
      role: "IIT JEE & NEET Physics Guru",
      category: "Academic Tutor & Problem Solver",
      avatar: "/avatars/kota_verma_teacher.png",
      tag: "JEE / PHYSICS"
    },
    {
      num: "02",
      name: "SHANAYA DELHI",
      role: "Delhi Drama Queen & Style Icon",
      category: "Popular Bestie & Gossip Circle",
      avatar: "/avatars/shanaya_delhi.png",
      tag: "LIFESTYLE / BESTIE"
    },
    {
      num: "03",
      name: "ESCAPE ROOM RPG",
      role: "Interactive Mystery Scenario Master",
      category: "Survival RPG Story Game",
      avatar: "/avatars/escape_room_game.png",
      tag: "ROLEPLAY GAME"
    }
  ];

  return (
    <section id={id} className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto border-b border-purple-500/10">
      
      {/* Section Title Header (Exact Layout from Image) */}
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-white font-sans">
          FEATURED <span className="text-purple-400">CHARACTERS</span>
        </h2>
        <button
          onClick={onExploreClick}
          className="text-xs font-bold uppercase tracking-wider text-purple-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>VIEW ALL 33+ AVATARS</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3 Featured Cards Grid (Exact Layout 01, 02, 03 from Image) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featured.map((item, idx) => (
          <a
            key={idx}
            href={appUrl}
            className="group rounded-2xl bg-neutral-900/60 border border-purple-500/15 hover:border-purple-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between hover:-translate-y-1 shadow-lg"
          >
            {/* Card Top Banner with Number Tag */}
            <div className="p-3 border-b border-neutral-800 bg-neutral-950/80 flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                {item.num}
              </span>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                {item.tag}
              </span>
            </div>

            {/* Image Preview Container */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-neutral-950">
              <img
                src={item.avatar}
                alt={item.name}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />
            </div>

            {/* Content Container */}
            <div className="p-5 bg-neutral-950/90 flex items-center justify-between border-t border-neutral-800">
              <div>
                <h3 className="text-base font-extrabold uppercase tracking-tight text-white group-hover:text-purple-300 transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">{item.category}</p>
              </div>

              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300 group-hover:bg-purple-500 group-hover:text-neutral-950 transition-all">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>

          </a>
        ))}
      </div>

    </section>
  );
}
