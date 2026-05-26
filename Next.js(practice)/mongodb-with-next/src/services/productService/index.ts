import { PRODUCT_API_ROUTES } from "../api/routes";
import { PRODUCT_API } from "../api";
import { ApiResponse, Product } from "@/types";

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

// GET PRODUCT BY ID
export const getProductById = async (productId: string): Promise<ApiResponse> => {
    const res = await fetch(`${BASE}${PRODUCT_API_ROUTES.products}/${productId}`, {
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error("Failed to fetch product details");
    }
    return res.json();
};

// ─── CLIENT-SIDE (used in Client Components with Axios instance PRODUCT_API) ───

// CREATE PRODUCT
export const createProduct = async (productData: Omit<Product, "_id">): Promise<ApiResponse> => {
    try {
        const response = await PRODUCT_API.post(PRODUCT_API_ROUTES.products, productData);
        return response.data;
    } catch (error: any) {
        console.error("Error creating product in service:", error);
        throw error.response?.data || new Error("Failed to create product");
    }
};

// UPDATE PRODUCT
export const updateProduct = async (productId: string, productData: Partial<Product>): Promise<ApiResponse> => {
    try {
        const response = await PRODUCT_API.put(`${PRODUCT_API_ROUTES.products}/${productId}`, productData);
        return response.data;
    } catch (error: any) {
        console.error("Error updating product in service:", error);
        throw error.response?.data || new Error("Failed to update product");
    }
};

// DELETE PRODUCT
export const deleteProduct = async (productId: string): Promise<ApiResponse> => {
    try {
        const response = await PRODUCT_API.delete(`${PRODUCT_API_ROUTES.products}/${productId}`);
        return response.data;
    } catch (error: any) {
        console.error("Error deleting product in service:", error);
        throw error.response?.data || new Error("Failed to delete product");
    }
};

