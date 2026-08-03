import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import RequireAdmin from "@/lib/RequireAdmin";

// GET all blog posts (Admin View)
export async function GET(req) {
  try {
    const admin = await RequireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
    }

    const blogs = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ blogs });
  } catch (error) {
    console.error("Admin Get Blogs Error:", error);
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}

// POST create new blog post (Admin View)
export async function POST(req) {
  try {
    const admin = await RequireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      category,
      author,
      published,
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and full content are required" },
        { status: 400 }
      );
    }

    // Auto-generate slug if not provided
    const blogSlug = (slug || title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const newBlog = await prisma.blogPost.create({
      data: {
        title: title.trim(),
        slug: blogSlug,
        excerpt: (excerpt || title).trim(),
        content: content.trim(),
        coverImage: coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
        category: category || "Study & Education",
        author: author || "NextAiChat Team",
        published: published !== undefined ? Boolean(published) : true,
      },
    });

    return NextResponse.json({ blog: newBlog });
  } catch (error) {
    console.error("Admin Create Blog Error:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "A blog post with this slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}
