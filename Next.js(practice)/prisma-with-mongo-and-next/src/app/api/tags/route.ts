import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// GET /api/tags - Fetch all tags with their linked posts
export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });
    return NextResponse.json(tags);
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
  }
}

// POST /api/tags - Create a new tag (optionally linked to a post)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const postId = body.postId ? parseInt(body.postId, 10) : null;

    if (!name) {
      return NextResponse.json({ error: "Tag name is required" }, { status: 400 });
    }

    // Check if tag with this name already exists
    const existingTag = await prisma.tag.findUnique({
      where: { name },
    });

    if (existingTag) {
      // If the tag exists and they provided a postId, let's link it to the new post
      if (postId && !isNaN(postId)) {
        const updatedTag = await prisma.tag.update({
          where: { name },
          data: { postId },
          include: { post: true },
        });
        return NextResponse.json(updatedTag, { status: 200 });
      }
      return NextResponse.json({ error: "Tag name already exists" }, { status: 400 });
    }

    // Create a new tag
    const newTag = await prisma.tag.create({
      data: {
        name,
        postId: postId && !isNaN(postId) ? postId : null,
      },
      include: {
        post: true,
      },
    });

    return NextResponse.json(newTag, { status: 201 });
  } catch (error) {
    console.error("Failed to create tag:", error);
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 });
  }
}
