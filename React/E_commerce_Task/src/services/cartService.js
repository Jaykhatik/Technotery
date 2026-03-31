import { CART_PRODUCTS_API } from "./api";
import { API_ROUTES } from "./api/routes";
import { getRequest } from "./apiMethods";

export const getCarts = () => {
  return getRequest(CART_PRODUCTS_API,API_ROUTES.cart)
    .then((data) => data||[])
};
export const getProducts = () => {
  return getRequest(CART_PRODUCTS_API,API_ROUTES.product)
    .then((data) => data||[])
};