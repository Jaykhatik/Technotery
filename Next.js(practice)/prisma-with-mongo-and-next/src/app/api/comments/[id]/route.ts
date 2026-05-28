import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const comment = await prisma.comment.findUnique({ where: { id }, include: { author: true, post: true } });
  if (!comment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(comment);
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  await prisma.comment.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
