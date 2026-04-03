import axios from "axios";
import getAxiosInstance from "./axiosConfig";

const API=getAxiosInstance(import.meta.env.VITE_PRODUCT_URL);
export default API;