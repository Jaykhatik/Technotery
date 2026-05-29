import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany({ include: { posts: true, comments: true } });
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();
  const user = await prisma.user.create({ data: { email: body.email, name: body.name } });
  return NextResponse.json(user, { status: 201 });
}
