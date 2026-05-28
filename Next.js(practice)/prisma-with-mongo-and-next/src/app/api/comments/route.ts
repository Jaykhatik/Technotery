import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET() {
  const comments = await prisma.comment.findMany({ include: { author: true, post: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(comments);
}

export async function POST(request: Request) {
  const body = await request.json();
  const commentBody = typeof body.body === "string" ? body.body.trim() : "";
  const postId = typeof body.postId === "string" ? body.postId : "";
  const authorEmail = typeof body.authorEmail === "string" ? body.authorEmail.trim().toLowerCase() : "";
  const authorName = typeof body.authorName === "string" ? body.authorName.trim() : "";

  if (!commentBody) {
    return NextResponse.json({ error: "Comment is required" }, { status: 400 });
  }

  if (!postId) {
    return NextResponse.json({ error: "Post id is required" }, { status: 400 });
  }

  const author = authorEmail
    ? await prisma.user.upsert({
        where: { email: authorEmail },
        update: authorName ? { name: authorName } : {},
        create: {
          email: authorEmail,
          name: authorName || null,
        },
      })
    : null;

  const comment = await prisma.comment.create({
    data: {
      body: commentBody,
      post: { connect: { id: postId } },
      author: author ? { connect: { id: author.id } } : undefined,
    },
    include: { author: true },
  });
  return NextResponse.json(comment, { status: 201 });
}
