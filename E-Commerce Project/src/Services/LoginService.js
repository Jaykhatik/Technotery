import {API} from "./api";
import { Login_API_ROUTES } from "./api/routes";

//Login
export const loginUser = async (data) => {
    try {
        const res = await API.post(Login_API_ROUTES.login, data);
        return res.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};


//Signup
export const signupUser = async (data) => {
    try {
        const res = await API.post(Login_API_ROUTES.signup, data);
        return res.data;
    } catch (err) {
        throw err.response?.data || err.message;
    }
};



//GET
// export const getRequest = (url, config = {}) => {
//     return API.get(url, config)
//         .then((res) => res.data)
//         .catch((err) => Promise.reject(err.response?.data || err.message));
// };

//POST
// export const postRequest = (url, data, config = {}) => {
//     return API.post(url, data, config)
//         .then((res) => res.data)
//         .catch((err) => Promise.reject(err.response?.data || err.message));
// };
