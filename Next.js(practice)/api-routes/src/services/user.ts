import { ApiResponse, User } from "@/types";

export async function getUsersList(): Promise<ApiResponse> {
  const res = await fetch("http://localhost:3000/api/users", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch users list");
  }
  return res.json();
}

export async function getUserDetail(userId: string): Promise<User[] | null> {
  try {
    const res = await fetch(`http://localhost:3000/api/users/${userId}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching user detail:", error);
    return null;
  }
}

export async function createUser(payload: User): Promise<any> {
  const res = await fetch("http://localhost:3000/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error("Failed to create user");
  }
  return res.json();
}
