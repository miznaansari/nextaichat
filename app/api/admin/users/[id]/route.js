import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import RequireAdmin from "@/lib/RequireAdmin";

// GET user detail with all associated chat sessions
export async function GET(req, { params }) {
  try {
    const admin = await RequireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        authProvider: true,
        dailyLimit: true,
        createdAt: true,
        chats: {
          orderBy: { updatedAt: "desc" },
          select: {
            id: true,
            title: true,
            selectedModel: true,
            createdAt: true,
            updatedAt: true,
            story: true,
            discoverCharacter: {
              select: {
                id: true,
                name: true,
                avatar: true,
                tagline: true,
                category: true,
              },
            },
            _count: {
              select: { messages: true },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Admin Fetch User Detail Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch user details" },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    const admin = await RequireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const { dailyLimit } = body;

    const newLimit = parseInt(dailyLimit, 10);
    if (isNaN(newLimit) || newLimit < 1) {
      return NextResponse.json(
        { error: "Daily credit limit must be a positive integer" },
        { status: 400 }
      );
    }

    const userExists = await prisma.user.findUnique({
      where: { id },
    });

    if (!userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { dailyLimit: newLimit },
      select: {
        id: true,
        name: true,
        email: true,
        dailyLimit: true,
      },
    });

    return NextResponse.json({
      message: `Successfully updated daily limit for ${updatedUser.name} to ${updatedUser.dailyLimit} credits.`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Admin Update User Limit Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update user daily limit" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const admin = await RequireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      message: `User ${targetUser.name} and all associated chat sessions, messages, personas, and usage logs have been permanently deleted.`,
    });
  } catch (error) {
    console.error("Admin Delete User Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete user and chat data" },
      { status: 500 }
    );
  }
}
