import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });

  const post = await prisma.post.findUnique({ where: { id: parsedId }, include: { author: true, comments: true } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });

  const body = await request.json();
  const updated = await prisma.post.update({ where: { id: parsedId }, data: body });
  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });

  await prisma.post.delete({ where: { id: parsedId } });
  return new Response(null, { status: 204 });
}
