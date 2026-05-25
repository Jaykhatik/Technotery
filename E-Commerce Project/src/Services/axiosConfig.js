import axios from "axios";
import ls from "../Utils/secureStorage";

export const getAxiosInstance = (baseURL) => {
    if (!baseURL) {
        throw new Error("Base Url is missing. Check your .env file");
    } //Prevents app crash if .env is wrong and Good safety check

    const instance = axios.create({
        baseURL,
        headers: {
            "Content-Type": "application/json",
        },
    });//All requests will use this base URL and All requests send JSON data

    // REQUEST INTERCEPTOR
    instance.interceptors.request.use(
        (config) => {
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