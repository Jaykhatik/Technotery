import { API } from "./api";
import { API_ROUTES } from "./api/routes";
import { getRequest } from "./apiMethods";


export const getUsers = () => {
    return getRequest(API,API_ROUTES.user)
        .then((data) => data?.data)
};