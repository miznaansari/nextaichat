import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import RequireAdmin from "@/lib/RequireAdmin";

export async function GET(req, { params }) {
  try {
    const admin = await RequireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, chatId } = await params;
    if (!id || !chatId) {
      return NextResponse.json(
        { error: "User ID and Chat ID are required" },
        { status: 400 }
      );
    }

    const chatSession = await prisma.chatSession.findFirst({
      where: { id: chatId, userId: id },
      select: {
        id: true,
        userId: true,
        title: true,
        selectedModel: true,
        story: true,
        userPersonaName: true,
        userPersonaDetails: true,
        createdAt: true,
        updatedAt: true,
        discoverCharacter: {
          select: {
            id: true,
            name: true,
            avatar: true,
            tagline: true,
            category: true,
          },
        },
        sessionCharacters: {
          select: {
            id: true,
            name: true,
            persona: true,
          },
        },
        messages: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            role: true,
            content: true,
            tokenEstimate: true,
            includeInContext: true,
            createdAt: true,
          },
        },
      },
    });

    if (!chatSession) {
      return NextResponse.json({ error: "Chat session not found" }, { status: 404 });
    }

    return NextResponse.json({ chatSession });
  } catch (error) {
    console.error("Admin Fetch Chat Messages Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch chat messages" },
      { status: 500 }
    );
  }
}
