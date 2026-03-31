import { getAxiosInstance } from "./axiosConfig";

const API = getAxiosInstance(import.meta.env.VITE_BASE_USER_URL);
const CART_PRODUCTS_API = getAxiosInstance(import.meta.env.VITE_BASE_CART_URL);

export { API, CART_PRODUCTS_API }; 