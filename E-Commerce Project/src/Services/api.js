import axios from "axios";
import { getAxiosInstance } from "./axiosConfig";

const API=getAxiosInstance(import.meta.env.VITE_LOGIN_BASE_URL);

const ADMIN_API=getAxiosInstance(import.meta.env.VITE_ADMIN_BASE_URL);

const SELLER_API=getAxiosInstance(import.meta.env.VITE_SELLER_BASE_URL);

const USER_API=getAxiosInstance(import.meta.env.VITE_USER_BASE_URL)



export {API,ADMIN_API,SELLER_API,USER_API};