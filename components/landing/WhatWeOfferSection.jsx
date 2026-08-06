"use client";

import { BookOpen, Users, Gamepad2, Dumbbell, Sparkles } from "lucide-react";

export default function WhatWeOfferSection() {
  const offers = [
    {
      num: "01",
      title: "AI STUDY TUTORS",
      description: "Interactive oral exam prep, physics problem solving, and language evaluators with step-by-step guidance.",
      icon: BookOpen
    },
    {
      num: "02",
      title: "COLLEGE & SQUADS",
      description: "Multi-character campus groups, late night gossip, banter, and relatable student conversations.",
      icon: Users
    },
    {
      num: "03",
      title: "ROLEPLAY GAMES",
      description: "Escape Room mystery thrillers, Truth or Dare, Flirt Challenges, and collaborative fantasy RPGs.",
      icon: Gamepad2
    },
    {
      num: "04",
      title: "MENTORS & COACHES",
      description: "Career advice, resume strategy, fitness coaching, and startup tech guidance from AI advisors.",
      icon: Dumbbell
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto border-b border-purple-500/10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Title Box */}
        <div className="lg:col-span-3 space-y-3">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-white font-sans">
              WHAT WE <br /> DO
            </h2>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed max-w-xs">
            We design, craft and ship hyper-realistic AI character experiences that are fast, intuitive, and deeply engaging.
          </p>
        </div>

        {/* Right 4 Cards Row (Exact Layout 01, 02, 03, 04 from Image) */}
        <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {offers.map((offer, idx) => {
            const Icon = offer.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-neutral-900/60 border border-purple-500/15 hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between space-y-6 group hover:-translate-y-1 backdrop-blur-md"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider group-hover:text-purple-300 transition-colors">
                      {offer.title}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                      {offer.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800 text-[11px] font-mono text-neutral-500 font-bold">
                  {offer.num}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
