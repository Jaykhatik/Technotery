import { NextResponse } from "next/server";
import { getUsers, saveUsers } from "@/utils/db";
import { RouteParams } from "@/types";

export async function GET(
  req: Request,
  { params }: RouteParams
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

export async function PUT(
  req: Request,
  { params }: RouteParams
) {
  const { userId } = await params;
  const parsedUserId = Number(userId);

  if (isNaN(parsedUserId) || parsedUserId <= 0) {
    return NextResponse.json(
      { message: "Invalid User ID" },
      { status: 400 }
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json() as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { message: "Please provide a valid JSON body" },
      { status: 400 }
    );
  }

  const { userName, email, age, city } = payload;

  // Validation for empty / missing fields
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

  const parsedAge = Number(age);
  if (isNaN(parsedAge) || parsedAge <= 0) {
    return NextResponse.json({ message: "Age must be a valid positive number" }, { status: 400 });
  }

  const existingUsers = getUsers();
  const userIndex = existingUsers.findIndex(
    (user) => Number(user.userId) === parsedUserId
  );

  if (userIndex === -1) {
    return NextResponse.json(
      { message: `User with ID ${parsedUserId} not found` },
      { status: 404 }
    );
  }

  // Check for duplicate Email among OTHER users
  const duplicateEmail = existingUsers.some(
    (user) => 
      Number(user.userId) !== parsedUserId &&
      String(user.email).trim().toLowerCase() === String(email).trim().toLowerCase()
  );

  if (duplicateEmail) {
    return NextResponse.json(
      { message: `User with Email '${email}' already exists` },
      { status: 400 }
    );
  }

  // Update existing user fields
  const updatedUser = {
    userId: parsedUserId,
    userName: String(userName).trim(),
    email: String(email).trim(),
    age: parsedAge,
    city: String(city).trim(),
  };

  existingUsers[userIndex] = updatedUser;
  saveUsers(existingUsers);

  return NextResponse.json(
    {
      message: "User updated successfully",
      data: updatedUser,
    },
    {
      status: 200,
    }
  );
}

export async function DELETE(
  req: Request,
  { params }: RouteParams
) {
  const { userId } = await params;
  const parsedUserId = Number(userId);

  if (isNaN(parsedUserId) || parsedUserId <= 0) {
    return NextResponse.json(
      { message: "Invalid User ID" },
      { status: 400 }
    );
  }

  const existingUsers = getUsers();
  const userIndex = existingUsers.findIndex(
    (user) => Number(user.userId) === parsedUserId
  );

  if (userIndex === -1) {
    return NextResponse.json(
      { message: `User with ID ${parsedUserId} not found` },
      { status: 404 }
    );
  }

  // Filter out the user to delete
  const remainingUsers = existingUsers.filter(
    (user) => Number(user.userId) !== parsedUserId
  );

  saveUsers(remainingUsers);

  return NextResponse.json(
    {
      message: "User deleted successfully",
    },
    {
      status: 200,
    }
  );
}


