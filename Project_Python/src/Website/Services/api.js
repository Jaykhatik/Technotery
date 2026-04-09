import axios from "axios";
import { getAxiosInstance } from "./axiosConfig";

const API=getAxiosInstance(import.meta.env.VITE_LOGIN_BASE_URL);

export default API;