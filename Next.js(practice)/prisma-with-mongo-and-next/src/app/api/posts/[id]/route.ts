import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id }, include: { author: true, comments: true } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const body = await request.json();
  const updated = await prisma.post.update({ where: { id }, data: body });
  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  await prisma.post.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
