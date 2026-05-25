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
  let payload: Record<string, unknown>;
  try {
    payload = await req.json() as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { message: "Please provide a valid JSON body" },
      { status: 400 }
    );
  }

  const { userId, userName, email, age, city } = payload;

  // 1. Validation for empty / missing fields
  if (userId === undefined || userId === null || userId === "") {
    return NextResponse.json({ message: "User ID is required" }, { status: 400 });
  }
  if (!userName || String(userName).trim() === "") {
    return NextResponse.json({ message: "User Name is required" }, { status: 400 });
  }
  if (!email || String(email).trim() === "") {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }
  if (age === undefined || age === null || age === "") {
    return NextResponse.json({ message: "Age is required" }, { status: 400 });
  }
  if (!city || String(city).trim() === "") {
    return NextResponse.json({ message: "City is required" }, { status: 400 });
  }

  const parsedUserId = Number(userId);
  const parsedAge = Number(age);

  if (isNaN(parsedUserId) || parsedUserId <= 0) {
    return NextResponse.json({ message: "User ID must be a valid positive number" }, { status: 400 });
  }
  if (isNaN(parsedAge) || parsedAge <= 0) {
    return NextResponse.json({ message: "Age must be a valid positive number" }, { status: 400 });
  }

  // 2. Check for duplicate User ID
  const existingUsers = getUsers();
  const duplicateId = existingUsers.some(
    (user) => Number(user.userId) === parsedUserId
  );

  if (duplicateId) {
    return NextResponse.json(
      { message: `User with ID ${parsedUserId} already exists` },
      { status: 400 }
    );
  }

  // Check for duplicate Email
  const duplicateEmail = existingUsers.some(
    (user) => String(user.email).trim().toLowerCase() === String(email).trim().toLowerCase()
  );

  if (duplicateEmail) {
    return NextResponse.json(
      { message: `User with Email '${email}' already exists` },
      { status: 400 }
    );
  }

  // Sanitized payload
  const sanitizedPayload = {
    userId: parsedUserId,
    userName: String(userName).trim(),
    email: String(email).trim(),
    age: parsedAge,
    city: String(city).trim(),
  };

  saveUser(sanitizedPayload);
  console.log(sanitizedPayload);

  return NextResponse.json(
    {
      message: "User created successfully",
      data: sanitizedPayload,
    },
    {
      status: 201,
    }
  );
}
