import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });

  const comment = await prisma.comment.findUnique({ where: { id: parsedId }, include: { author: true, post: true } });
  if (!comment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(comment);
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });

  await prisma.comment.delete({ where: { id: parsedId } });
  return new Response(null, { status: 204 });
}
