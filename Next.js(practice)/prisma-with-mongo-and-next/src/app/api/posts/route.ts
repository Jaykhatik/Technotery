import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET() {
  const posts = await prisma.post.findMany({ include: { author: true, comments: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const body = await request.json();
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const authorEmail = typeof body.authorEmail === "string" ? body.authorEmail.trim().toLowerCase() : "";
  const authorName = typeof body.authorName === "string" ? body.authorName.trim() : "";

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  if (!authorEmail) {
    return NextResponse.json({ error: "Author email is required" }, { status: 400 });
  }

  const author = await prisma.user.upsert({
    where: { email: authorEmail },
    update: authorName ? { name: authorName } : {},
    create: {
      email: authorEmail,
      name: authorName || null,
    },
  });

  const post = await prisma.post.create({
    data: {
      title,
      content: content || null,
      published: body.published !== false,
      author: { connect: { id: author.id } },
    },
    include: { author: true },
  });
  return NextResponse.json(post, { status: 201 });
}
