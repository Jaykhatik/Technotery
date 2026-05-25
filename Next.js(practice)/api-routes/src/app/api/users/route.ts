import { NextResponse } from "next/server";
import { getUsers, saveUser } from "@/utils/db";

export async function GET() {
  const data = getUsers();

  return NextResponse.json(
    {
      message: "Data fetched successfully",
      data: data,
    },
    {
      status: 200,
    }
  );
}

export async function POST(req: Request) {
  const payload = await req.json();
  saveUser(payload);
  console.log(payload);

  return NextResponse.json(
    {
      message: "User created successfully",
      data: payload,
    },
    {
      status: 201,
    }
  );
}
