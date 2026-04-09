import API from "./api";

//GET
export const getRequest = (url, config = {}) => {
    return API.get(url, config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err.response?.data || err.message));
};

//POST
export const postRequest = (url, data, config = {}) => {
    return API.post(url, data, config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err.response?.data || err.message));
};
