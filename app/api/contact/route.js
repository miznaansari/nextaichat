import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, category = "General", message } = body;

    if (!name || !name.trim() || !email || !email.trim() || !message || !message.trim()) {
      return NextResponse.json(
        { error: "Name, email, and message are required fields." },
        { status: 400 }
      );
    }

    let savedSubmission = null;
    try {
      if (prisma.contactSubmission) {
        savedSubmission = await prisma.contactSubmission.create({
          data: {
            name: name.trim(),
            email: email.trim(),
            category: category.trim(),
            message: message.trim(),
            status: "sent",
          },
        });
      }
    } catch (dbErr) {
      console.warn("Database storage skipped for contact submission:", dbErr?.message || dbErr);
    }

    let discordSuccess = false;
    if (DISCORD_WEBHOOK_URL) {
      try {
        const embedCategoryColors = {
          Bug: 0xEF4444,
          Feature: 0x3B82F6,
          Feedback: 0x10B981,
          DMCA: 0xF59E0B,
          General: 0x8B5CF6,
        };

        const embedColor = embedCategoryColors[category] || 0x8B5CF6;

        const discordPayload = {
          username: "NextAiChat Support Bot",
          avatar_url: "https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/sparkles.png",
          embeds: [
            {
              title: `📩 New Contact Submission [${category}]`,
              color: embedColor,
              fields: [
                { name: "👤 Sender Name", value: name.trim(), inline: true },
                { name: "✉️ Email Address", value: email.trim(), inline: true },
                { name: "🏷️ Category", value: category.trim(), inline: true },
                {
                  name: "📝 Message",
                  value: message.trim().length > 1000 ? message.trim().substring(0, 1000) + "..." : message.trim(),
                  inline: false,
                },
              ],
              footer: {
                text: `Submission ID: ${savedSubmission ? savedSubmission.id : "N/A"} • NextAiChat Platform`,
              },
              timestamp: new Date().toISOString(),
            },
          ],
        };

        const discordRes = await fetch(DISCORD_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(discordPayload),
        });

        discordSuccess = discordRes.ok;
      } catch (webhookErr) {
        console.error("Failed to send Discord webhook:", webhookErr?.message || webhookErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Your message has been sent successfully. Our team will get back to you shortly.",
      submissionId: savedSubmission ? savedSubmission.id : null,
      discordDelivered: discordSuccess,
    });
  } catch (error) {
    console.error("Contact Submission API Error:", error);
    return NextResponse.json(
      { error: "Internal server error processing contact submission." },
      { status: 500 }
    );
  }
}
