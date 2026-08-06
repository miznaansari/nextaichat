import prisma from "@/lib/prisma";
import JsonLd from "@/components/JsonLd";
import HomeClient from "@/components/HomeClient";

export const revalidate = 0;

export const metadata = {
  title: "NextAiChat - AI Roleplay Platform for Study & Entertainment",
  description:
    "NextAiChat is the premier AI Roleplay platform designed for interactive study simulations, exam prep tutors, language practice, and multi-character storytelling with dynamic speaker turns.",
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  let blogs = [];
  let characters = [];
  let stats = {
    totalChats: 0,
    totalCharacters: 0,
  };

  try {
    blogs = await prisma.blogPost.findMany({
      where: { published: true },
      take: 3,
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error("Home page blog fetch error:", e);
  }

  try {
    const rawChars = await prisma.discoverCharacter.findMany({
      where: { isPublic: true },
      take: 9,
      orderBy: { createdAt: "desc" },
    });
    
    // Serialize Prisma objects safely for Client Component
    characters = rawChars.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    }));
  } catch (e) {
    console.error("Home page character fetch error:", e);
  }

  try {
    const sessionCount = await prisma.chatSession.count();
    const charCount = await prisma.discoverCharacter.count({ where: { isPublic: true } });
    
    const charChatsSum = await prisma.discoverCharacter.aggregate({
      _sum: {
        chatsCount: true,
      },
    });

    const calculatedTotalChats = (charChatsSum._sum.chatsCount || 0) + sessionCount;

    stats = {
      totalChats: calculatedTotalChats,
      totalCharacters: charCount,
    };
  } catch (e) {
    console.error("Home page stats fetch error:", e);
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is NextAiChat?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "NextAiChat is an advanced AI roleplay platform engineered specifically for interactive study simulations, exam prep tutoring, foreign language practice, and multi-character storytelling with automated turn management.",
        },
      },
      {
        "@type": "Question",
        name: "How does NextAiChat compare to Character.ai?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "NextAiChat features a Dynamic Speaker Turn Engine powered by Advanced AI, zero latency, dedicated study personas, private sessions, custom snippet libraries, and 1-click memory inclusion toggles.",
        },
      },
      {
        "@type": "Question",
        name: "Can I prep for exams or practice languages here?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! NextAiChat includes pre-configured AI tutors for oral exam simulations (Physics, Chemistry, Law), IELTS/TOEFL speaking test evaluators, and multi-speaker debate rooms.",
        },
      },
      {
        "@type": "Question",
        name: "Are my chat sessions private and secure?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely. All chat sessions are completely private and stored securely. Your roleplay data is never used to train public models without permission.",
        },
      },
    ],
  };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.nextaichat.online";

  return (
    <>
      <JsonLd data={faqSchema} />
      <HomeClient blogs={blogs} characters={characters} stats={stats} appUrl={appUrl} />
    </>
  );
}
