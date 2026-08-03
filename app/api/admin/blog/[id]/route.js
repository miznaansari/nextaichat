import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import RequireAdmin from "@/lib/RequireAdmin";

// PUT update blog post
export async function PUT(req, { params }) {
  try {
    const admin = await RequireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const formattedSlug = body.slug
      ? body.slug
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
      : undefined;

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title.trim() }),
        ...(formattedSlug && { slug: formattedSlug }),
        ...(body.excerpt !== undefined && { excerpt: body.excerpt.trim() }),
        ...(body.content && { content: body.content.trim() }),
        ...(body.coverImage !== undefined && { coverImage: body.coverImage }),
        ...(body.category && { category: body.category }),
        ...(body.author && { author: body.author }),
        ...(body.published !== undefined && { published: Boolean(body.published) }),
      },
    });

    return NextResponse.json({ blog: updated });
  } catch (error) {
    console.error("Admin Update Blog Error:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "A blog post with this slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
  }
}

// DELETE blog post
export async function DELETE(req, { params }) {
  try {
    const admin = await RequireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Admin Delete Blog Error:", error);
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}
