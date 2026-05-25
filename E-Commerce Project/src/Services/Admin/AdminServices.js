import { ADMIN_API } from "../api";
import { ADMIN_API_ROUTES } from "../api/routes";

// GET ALL CATEGORIES
export const getCategories = async () => {
    try {
        const res = await ADMIN_API.get(ADMIN_API_ROUTES.Allcategories);
        return res.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};

//add one cat
export const addCat = async (data) => {
    try {
        const res = await ADMIN_API.post(ADMIN_API_ROUTES.addCategory, data);
        return res.data;
    }
    catch (err) {
        throw err.response?.data || err.message;
    }
}

//fetch the all requests of seller for categories in notification page
export const getCategoryRequests = async () => {
    try {
        const res = await ADMIN_API.get(ADMIN_API_ROUTES.AllNotiCatRequests); 
        return res.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};

//manage request status in notification page
export const updateCategoryRequestStatus = async (request_uuid, action) => {
    try {
        const res = await ADMIN_API.put(
            `${ADMIN_API_ROUTES.App_DisApp}/${request_uuid}/action`,
            {
                action: action   
            }
        );
        return res.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};

//fetch all requests of sellers for categories in all requests page
export const getAllCategoryRequests = async () => {
    try {
        const res = await ADMIN_API.get(ADMIN_API_ROUTES.AllRequests);  
        return res.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};
//manage request status in request all page
export const updateCategoryRequestStatusAll = async (request_uuid, action_all) => {
    try {
        const res = await ADMIN_API.put(
            `${ADMIN_API_ROUTES.App_DisApp}/${request_uuid}/action_all`,
            {
                action_all: action_all   
            }
        );
        return res.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};
