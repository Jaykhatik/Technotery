import fs from "fs";
import path from "path";
import { User } from "@/types";

const filePath = path.join(process.cwd(), "db.json");

export function getUsers(): User[] {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const fileData = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileData);
  } catch (error) {
    console.error("Error reading db.json:", error);
    return [];
  }
}

export function saveUser(newUser: User): void {
  try {
    const users = getUsers();
    users.push(newUser);
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to db.json:", error);
  }
}

export function saveUsers(allUsers: User[]): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(allUsers, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to db.json:", error);
  }
}

