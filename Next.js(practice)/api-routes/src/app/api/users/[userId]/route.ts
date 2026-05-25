import { NextResponse } from "next/server";
import { getUsers } from "@/utils/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const users = getUsers();

  const userdata = users.filter((item) => item.userId === Number(userId));

  if (userdata.length === 0) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(userdata, {
    status: 200,
  });
}
