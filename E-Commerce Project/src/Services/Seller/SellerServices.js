import { SELLER_API } from "../api";
import { SELLER_API_ROUTES } from "../api/routes";

// GET ALL PRODUCTS
export const getAllProducts = async () => {
    try {
        const res = await SELLER_API.get(SELLER_API_ROUTES.AllProducts);
        return res.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};
//seller request api

export const requestCategoryAccess = async (category_uuid) => {
    try {
        const res = await SELLER_API.post(
            SELLER_API_ROUTES.CatReq,
            { category_uuid }
        );
        return res.data;
    } catch (err) {
        console.error("Request Category Error:", err);
        throw err.response?.data?.message || err.message || "Something went wrong";
    }
};
// add product by seller
export const addProductSeller = async (data) => {
    try {
        const res = await SELLER_API.post(
            SELLER_API_ROUTES.AddProduct,
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return res.data;
    }
    catch (err) {
        throw err.response?.data || err.message;
    }
};

// GET seller category requests
export const getSellerRequests = async () => {
    try {
        const res = await SELLER_API.get(
            SELLER_API_ROUTES.SellerAllReq
        );
        return res.data;

    } catch (err) {
        console.error("Get Seller Requests Error:", err);
        throw err.response?.data?.message || err.message;
    }
};