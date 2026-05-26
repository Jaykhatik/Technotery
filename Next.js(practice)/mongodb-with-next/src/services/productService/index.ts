import { PRODUCT_API_ROUTES } from "../api/routes";
import { ApiResponse } from "@/types";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// ─── SERVER-SIDE (used in Server Components with fetch) ───

// GET ALL PRODUCTS
export const getAllProducts = async (): Promise<ApiResponse> => {
    const res = await fetch(`${BASE}${PRODUCT_API_ROUTES.products}`, {
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error("Failed to fetch products list");
    }
    return res.json();
};
