import { Login_API_ROUTES } from "./api/routes";
import { getRequest, postRequest } from "./apiMethods";

export const loginUser = (data) => {
    return postRequest(Login_API_ROUTES.login, data);
};

export const signupUser = (data) => {
    return postRequest(Login_API_ROUTES.signup, data);
};

