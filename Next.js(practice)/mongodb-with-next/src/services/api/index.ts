import { getAxiosInstance } from "../config";

export const PRODUCT_API = getAxiosInstance(process.env.NEXT_PUBLIC_API_BASE_URL);
