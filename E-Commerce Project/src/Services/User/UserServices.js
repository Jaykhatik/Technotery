import { USER_API } from "../api";
import { USER_API_ROUTES } from "../api/routes";

// User Profile
export const getUserProfile = async () => {
    try {
        const res = await USER_API.get(USER_API_ROUTES.UserProfile);
        return res.data.user_data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};