import { CATEGORY_API_ROUTES } from "../api/routes";
import { PRODUCT_API } from "../api";
import { ApiResponse, Category } from "@/types";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getAllCategories = async (): Promise<ApiResponse<Category[]>> => {
  const res = await fetch(`${BASE}${CATEGORY_API_ROUTES.categories}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch categories list");
  }
  return res.json() as Promise<ApiResponse<Category[]>>;
};

export const createCategory = async (categoryData: Omit<Category, "_id">): Promise<ApiResponse<Category>> => {
  try {
    const response = await PRODUCT_API.post(CATEGORY_API_ROUTES.categories, categoryData);
    return response.data;
  } catch (error: unknown) {
    console.error("Error creating category in service:", error);
    const responseData =
      typeof error === "object" && error !== null && "response" in error
        ? (error as { response?: { data?: unknown } }).response?.data
        : undefined;
    throw responseData || new Error("Failed to create category");
  }
};

