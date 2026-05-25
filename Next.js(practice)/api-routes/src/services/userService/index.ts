import { USER_API } from "../api";
import { USER_API_ROUTES } from "../api/routes";
import { ApiResponse, User } from "@/types";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// ─── SERVER-SIDE (used in Server Components with fetch) ───

// GET ALL USERS
export const getAllUsers = async (): Promise<ApiResponse> => {
    const res = await fetch(`${BASE}${USER_API_ROUTES.users}`, {
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error("Failed to fetch users list");
    }
    return res.json();
};

// GET USER BY ID
export const getUserById = async (userId: string): Promise<User[] | null> => {
    try {
        const res = await fetch(
            `${BASE}${USER_API_ROUTES.users}/${userId}`,
            { cache: "no-store" }
        );
        if (!res.ok) {
            return null;
        }
        return res.json();
    } catch (err) {
        console.error("Get User Error:", err);
        return null;
    }
};

// ─── CLIENT-SIDE (used in Client Components with Axios) ───

// CREATE USER
export const createUser = async (data: {
    userId: number;
    userName: string;
    age: number;
    city: string;
    email: string;
}) => {
    try {
        const res = await USER_API.post(
            USER_API_ROUTES.users,
            data
        );
        return res.data;
    } catch (err: any) {
        throw err.response?.data || err.message;
    }
};
