import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import ls from "../../utils/secureStorage";

export const getAxiosInstance = (baseURL: string | undefined): AxiosInstance => {
    if (!baseURL) {
        throw new Error("Base URL is missing. Check your .env file");
    }

    const instance = axios.create({
        baseURL,
        headers: {
            "Content-Type": "application/json",
        },
    });

    // REQUEST INTERCEPTOR
    instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const token = ls.get("token");

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        },
        (error) => Promise.reject(error)
    );

    // RESPONSE INTERCEPTOR
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                ls.remove("token");
                ls.remove("user");
                window.location.replace("/login");
            }
            return Promise.reject(error);
        }
    );

    return instance;
};
